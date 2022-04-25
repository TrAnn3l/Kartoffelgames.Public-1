import { GenericModule } from '../generic_module/generic-module';
import { Division } from '../generic_module/pattern/division';
import { Pattern } from '../generic_module/pattern/pattern';
import { Sample } from '../generic_module/sample/sample';
import { PlayerGlobals } from './player-globals';

export class PlayerChannel {
    private readonly mChannelIndex: number;
    private readonly mContinuingInformation: ContinuingInformation;
    private mDivisionIndex: number;
    private readonly mModule: GenericModule;
    private readonly mPlayerGlobals: PlayerGlobals;
    private mSamplePositionIndex: number;
    private mSongPositionIndex: number;

    private mSample: Sample;
    private mPeriod: number;



    /**
     * Get current division.
     */
    public get division(): Division {
        return this.pattern.getRow(this.mDivisionIndex)[this.mChannelIndex];
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
        const lSongPosition: number = this.mModule.pattern.songPositions[this.mSongPositionIndex];
        return this.mModule.pattern.getPattern(lSongPosition);
    }

    /**
     * Constructor.
     */
    public constructor(pModule: GenericModule, pGlobals: PlayerGlobals, pChannelIndex: number) {
        this.mModule = pModule;
        this.mChannelIndex = pChannelIndex;
        this.mPlayerGlobals = pGlobals;

        // Set channel startup defaults.
        this.mDivisionIndex = 0;
        this.mSamplePositionIndex = 0;
        this.mSongPositionIndex = 0;

        // Default continuing information.
        this.mContinuingInformation = {
            sample: null,
            period: 0
        };

        // Get firt sample. // FIXME:
        this.mSample = this.mModule.samples.getSample(this.division.sampleIndex);
        this.mPeriod = this.division.period;
    }

    /**
     * Start next division.
     * Returns false if no pattern are left
     */
    public nextDivision(): boolean {
        this.mDivisionIndex++;

        // Start next pattern and reset division if division overflows current pattern.
        if ((this.mDivisionIndex + 1) > this.pattern.rowsCount) {
            this.mSongPositionIndex++;
            this.mDivisionIndex = 0;
        }

        // Reset sample position if new sample should be played.
        if (this.division.sampleIndex !== -1) {
            // Only change and reset sample if period is set or sample has changed.
            const lNewSample: Sample = this.mModule.samples.getSample(this.division.sampleIndex);
            if (lNewSample !== this.mSample || this.division.period !== 0) {
                this.mSamplePositionIndex = 0;
                this.mPeriod = this.division.period;
            }
            
            this.mSample = lNewSample;      
        }

        // TODO: Check for exit.
        return true;
    }

    /**
     * Play next tick and get sample position value.
     */
    public nextSample(): number {
        const lSample: Sample = this.sample;

        // Exit if no sample exists or sample finished playing.
        if (lSample.data.length === 0 || (this.mSamplePositionIndex + 1) > lSample.data.length) {
            return 0;
        }

        // Get next sample position value.
        const lNextSamplePosition = Math.floor(this.mSamplePositionIndex);
        const lSamplePositionValue: number = lSample.data[lNextSamplePosition];

        // Calculate next sample position.
        const lSampleSpeed = 7093789.2 / ((this.mPeriod * 2) * this.mPlayerGlobals.sampleRate);
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
