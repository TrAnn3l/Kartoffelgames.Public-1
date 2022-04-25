export class PlayerGlobals {
    private mBeatsPerMinute: number;
    private mCurrentDivisionIndex: number;
    private readonly mSampleRate: number;
    private mSpeedUp: number;
    private mTicksPerDivision: number;

    /**
     * Get beats per minute.
     */
    public get beatsPerMinute(): number {
        return this.mBeatsPerMinute;
    }

    /**
     * Get beats per minute.
     */
    public set beatsPerMinute(pBeatsPerMinute: number) {
        this.mBeatsPerMinute = pBeatsPerMinute;
    }

    /**
     * Get current playing division index.
     */
    public get currentDivision(): number {
        return this.mCurrentDivisionIndex;
    }

    /**
     * Get current playing division index.
     */
    public set currentDivision(pCurrentDivisionIndex: number) {
        this.mCurrentDivisionIndex = pCurrentDivisionIndex;
    }

    /**
     * Get global sample rape.
     */
    public get sampleRate(): number {
        return this.mSampleRate;
    }

    /**
     * Get ticks per division.
     */
    public get ticksPerDivision(): number {
        return this.mTicksPerDivision;
    }

    /**
     * Get ticks per division.
     */
    public set ticksPerDivision(pTicksPerDivision: number) {
        this.mTicksPerDivision = pTicksPerDivision;
    }

    /**
     * Get global speed up.
     */
    public get speedUp(): number {
        return this.mSpeedUp;
    }

    /**
     * Get global speed up.
     */
    public set speedUp(pSpeedUp: number) {
        this.mSpeedUp = pSpeedUp;
    }

    /**
     * Constructor.
     * @param pSampleRate - Global sample rate.
     */
    public constructor(pSampleRate: number) {
        this.mSampleRate = pSampleRate;
    }
}