import { Division } from '../generic_module/pattern/division';
import { Pattern } from '../generic_module/pattern/pattern';
import { Sample } from '../generic_module/sample/sample';
import { PlayerGlobals } from './player-globals';

export class PlayerChannel {
    private readonly mChannelIndex: number;
    private readonly mContinuingInformation: ContinuingInformation;
    private readonly mGlobals: PlayerGlobals;
    private mSamplePositionIndex: number;

    private mSample: Sample;
    private mPeriod: number;



    /**
     * Get current division.
     */
    public get division(): Division {
        return this.pattern.getRow(this.mGlobals.cursor.division)[this.mChannelIndex];
    }

    /**
     * Get current playing sample.
     */
    public get sample(): Sample {
        return this.mSample;
    }

    /**
     * Get current playing pattern.
     */
    public get pattern(): Pattern {
        const lSongPosition: number = this.mGlobals.module.pattern.songPositions[this.mGlobals.cursor.songPosition];
        return this.mGlobals.module.pattern.getPattern(lSongPosition);
    }

    /**
     * Constructor.
     */
    public constructor(pGlobals: PlayerGlobals, pChannelIndex: number) {
        this.mChannelIndex = pChannelIndex;
        this.mGlobals = pGlobals;

        // Set channel startup defaults.
        this.mSamplePositionIndex = 0;

        // Default continuing information.
        this.mContinuingInformation = {
            sample: null,
            period: 0
        };

        // Get firt sample. // FIXME:
        this.mSample = this.mGlobals.module.samples.getSample(this.division.sampleIndex);
        this.mPeriod = this.division.period;
    }

    /**
     * Start next division.
     * Returns false if no pattern are left
     */
    public nextDivision(): void {
        // Reset sample position if new sample should be played.
        if (this.division.sampleIndex !== -1) {
            // Only change and reset sample if period is set or sample has changed.
            const lNewSample: Sample = this.mGlobals.module.samples.getSample(this.division.sampleIndex);
            if (lNewSample !== this.mSample || this.division.period !== 0) {
                this.mSamplePositionIndex = 0;
                this.mPeriod = this.division.period;
            }

            this.mSample = lNewSample;
        }
    }

    /**
     * Reset sample on new pattern.
     */
    public nextPattern(): void {
        // Reset sample.
        this.mSample = null;
        this.mSamplePositionIndex = 0;
        this.mPeriod = 0;
    }

    /**
     * Play next tick and get sample position value.
     */
    public nextSample(): number {
        const lSample: Sample = this.sample;

        // Exit if no sample exists or sample finished playing.
        if (lSample === null || lSample.data.length === 0 || (this.mSamplePositionIndex + 1) > lSample.data.length) {
            return 0;
        }

        // Get next sample position value.
        const lNextSamplePosition = Math.floor(this.mSamplePositionIndex);
        const lSamplePositionValue: number = lSample.data[lNextSamplePosition];

        // Calculate next sample position.
        const lSampleSpeed = 7093789.2 / ((this.mPeriod * 2) * this.mGlobals.lengthInformation.speed.sampleRate);
        this.mSamplePositionIndex += lSampleSpeed;

        // Check for loop information.
        if (lSample.repeatLength > 0) {
            // Check if sample cursor is after the repeat range.
            if ((this.mSamplePositionIndex + 1) > (lSample.repeatOffset + lSample.repeatLength)) {
                // Move back as long as not inside repeat length.
                this.mSamplePositionIndex = lSample.repeatOffset;
            }
        }

        return lSamplePositionValue;
    }

    public nextTick(): void {
        // TODO: 
    }
}

interface ContinuingInformation {
    sample: Sample;
    period: number;
}
