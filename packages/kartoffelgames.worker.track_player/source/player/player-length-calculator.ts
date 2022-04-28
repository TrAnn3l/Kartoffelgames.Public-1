import { GenericModule } from '../generic_module/generic-module';

export class PlayerLengthCalculator {
    private readonly mModule: GenericModule;
    private mSamplesPerTick: number;
    private readonly mSpeedInformation: SpeedInformation;
    private mTicksPerDivision: number;

    /**
     * Get count of samples per division.
     */
    public get samples(): number {
        return this.mSamplesPerTick;
    }

    /**
     * Get count of divisions per pattern.
     */
    public get divisions(): number {
        return this.mModule.pattern.patternLength;
    }

    /**
     * Get count of song positions.
     */
    public get songPositions(): number {
        return this.mModule.pattern.songPositions.length;
    }

    /**
     * Get readonly speed information.
     */
    public get speed(): SpeedInformation {
        return {
            beatsPerMinute: this.mSpeedInformation.beatsPerMinute,
            sampleRate: this.mSpeedInformation.sampleRate,
            speedUp: this.mSpeedInformation.speedUp
        };
    }

    /**
     * Get count of ticks per division.
     */
    public get ticks(): number {
        return this.mTicksPerDivision;
    }

    /**
     * Constructor.
     * @param pModule - Playing module.
     * @param pSampleRate - Global sample rate.
     */
    public constructor(pModule: GenericModule, pSampleRate: number) {
        this.mModule = pModule;

        // Init speed information.
        this.mSpeedInformation = {
            sampleRate: pSampleRate,
            beatsPerMinute: 0,
            speedUp: 0
        };

        // Set default speed.
        this.setSpeed(125, 1);
        this.setTickRate(6);
    }

    /**
     * Set new global speed.
     * Recalculates samples per tick.
     * @param pBeatsPerMinute 
     * @param pSpeedUp 
     */
    public setSpeed(pBeatsPerMinute: number, pSpeedUp: number): void {
        this.mSpeedInformation.beatsPerMinute = pBeatsPerMinute;
        this.mSpeedInformation.speedUp = pSpeedUp;

        this.mSamplesPerTick = ((this.mSpeedInformation.sampleRate * 60) / (this.mSpeedInformation.beatsPerMinute * this.mSpeedInformation.speedUp)) / 24;
    }

    /**
     * Set tick rate for next playing divisions.
     * @param pTicksPerDivision - Ticks per division.
     */
    public setTickRate(pTicksPerDivision: number): void {
        this.mTicksPerDivision = pTicksPerDivision;
    }
}

interface SpeedInformation {
    sampleRate: number;
    beatsPerMinute: number;
    speedUp: number;
}