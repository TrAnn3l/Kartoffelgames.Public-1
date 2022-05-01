import { Pitch } from '../enum/pitch';
import { BaseEffect } from '../generic_module/effect/base-effect';
import { DivisionChannel } from '../generic_module/pattern/division-channel';
import { Pattern } from '../generic_module/pattern/pattern';
import { Sample } from '../generic_module/sample/sample';
import { BasePlayerEffect } from './effect/base-player-effect';
import { PlayerModule } from './player_module/player-module';

export class PlayerChannel {
    private readonly mChannelIndex: number;
    private readonly mContinuingInformation: ContinuingInformation;
    private readonly mPlayerModule: PlayerModule;

    /**
     * Get current division.
     */
    public get division(): DivisionChannel {
        return this.pattern.getDivision(this.mPlayerModule.cursor.divisionIndex).getChannel(this.mChannelIndex);
    }

    /**
     * Get current playing pattern.
     */
    public get pattern(): Pattern {
        const lSongPosition: number = this.mPlayerModule.module.pattern.songPositions[this.mPlayerModule.cursor.songPositionIndex];
        return this.mPlayerModule.module.pattern.getPattern(lSongPosition);
    }

    /**
     * Constructor.
     */
    public constructor(pPlayerModule: PlayerModule, pChannelIndex: number) {
        this.mChannelIndex = pChannelIndex;
        this.mPlayerModule = pPlayerModule;

        // Set empty continuing information.
        this.mContinuingInformation = {
            period: Pitch.Empty,
            sample: null,
            samplePosition: 0,
            effects: new Array<BasePlayerEffect<BaseEffect>>()
        };
    }

    /**
     * Play next tick and get sample position value.
     */
    public nextSample(pSongPositionChanged: boolean, pDivisionChanged: boolean, pTickChanged: boolean): number {
        // Call on change methods.
        if (pSongPositionChanged) {
            this.onPatternChange();
        }
        if (pDivisionChanged) {
            this.onDivisionChange();
        }

        // Get current sample.
        const lSample: Sample = this.mContinuingInformation.sample;

        // Exit if no sample exists or sample finished playing.
        if (lSample === null || lSample.data.length === 0 || (this.mContinuingInformation.samplePosition + 1) > lSample.data.length) {
            return 0;
        }

        // Get next sample position value.
        const lNextSamplePosition = Math.floor(this.mContinuingInformation.samplePosition);
        const lSamplePositionValue: number = lSample.data[lNextSamplePosition];

        // Calculate next sample position.
        const lSampleSpeed = 7093789.2 / ((this.mContinuingInformation.period * 2) * this.mPlayerModule.speed.speed.sampleRate);
        this.mContinuingInformation.samplePosition += lSampleSpeed;

        // TODO: Exceute effects.

        // Check for loop information.
        if (lSample.repeatLength > 0) {
            // Check if sample cursor is after the repeat range.
            if ((this.mContinuingInformation.samplePosition + 1) > (lSample.repeatOffset + lSample.repeatLength)) {
                // Move back as long as not inside repeat length.
                this.mContinuingInformation.samplePosition = lSample.repeatOffset;
            }
        }

        return lSamplePositionValue;
    }

    public onDivisionChange(): void {
        const lDivision: DivisionChannel = this.division;

        // Reset sample position if new sample should be played.
        if (lDivision.sampleIndex !== -1) {
            // Only change and reset sample if period is set or sample has changed.
            const lNewSample: Sample = this.mPlayerModule.module.samples.getSample(this.division.sampleIndex);
            if (lNewSample !== this.mContinuingInformation.sample || lDivision.period !== Pitch.Empty) {
                this.mContinuingInformation.samplePosition = 0;
                this.mContinuingInformation.period = this.division.period;
            }

            this.mContinuingInformation.sample = lNewSample;
        }

        // TODO: Add effect to ContinuingInformation.
    }

    public onPatternChange(): void {
        // Reset every continuing information.
        this.mContinuingInformation.period = 0;
        this.mContinuingInformation.sample = null;
        this.mContinuingInformation.samplePosition = 0;
        this.mContinuingInformation.effects = new Array<BasePlayerEffect<BaseEffect>>();
    }
}

interface ContinuingInformation {
    period: number;
    sample: Sample;
    samplePosition: number;
    effects: Array<BasePlayerEffect<BaseEffect>>;
}
