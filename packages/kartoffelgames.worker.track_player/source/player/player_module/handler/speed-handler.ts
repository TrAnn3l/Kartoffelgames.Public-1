export class SpeedHandler {
    private readonly mSpeedInformation: SpeedInformation;

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
     * Constructor.
     * @param pModule - Playing module.
     * @param pSampleRate - Global sample rate.
     */
    public constructor(pSampleRate: number) {
        // Init speed information.
        this.mSpeedInformation = {
            sampleRate: pSampleRate,
            beatsPerMinute: 0,
            speedUp: 0
        };

        // Set default speed.
        this.setSpeed(125, 1);
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
    }
}

interface SpeedInformation {
    sampleRate: number;
    beatsPerMinute: number;
    speedUp: number
}