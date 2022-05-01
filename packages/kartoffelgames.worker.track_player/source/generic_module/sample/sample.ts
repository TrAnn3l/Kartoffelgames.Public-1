/**
 * Sample information.
 */
export class Sample {
    private mData: Float32Array;
    private mFineTune: number;
    private mName: string;
    private mRepeatLength: number;
    private mRepeatStartOffset: number;
    private mVolume: number;

    /**
     * Get sample name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Set sample name.
     */
    public set name(pName: string) {
        this.mName = pName;
    }

    /**
     * Get sample byte data.
     */
    public get data(): Float32Array {
        return this.mData;
    }

    /**
     * Set sample byte data.
     */
    public set data(pData: Float32Array) {
        this.mData = pData;
    }

    /**
     * Get sample repeat offset.
     */
    public get repeatOffset(): number {
        return this.mRepeatStartOffset;
    }

    /**
     * Get sample repeat length.
     */
    public get repeatLength(): number {
        return this.mRepeatLength;
    }

    /**
     * Get samples fine tune.
     */
    public get fineTune(): number {
        return this.mFineTune;
    }

    /**
     * Set samples fine tune.
     */
    public set fineTune(pFineTune: number) {
        this.mFineTune = pFineTune;
    }

    /**
     * Get samples volume.
     */
    public get volume(): number {
        return this.mVolume;
    }

    /**
     * Set samples volume.
     */
    public set volume(pVolume: number) {
        this.mVolume = pVolume;
    }

    /**
     * Constructor.
     * Set defaults.
     */
    public constructor() {
        // Empty values.
        this.mName = '';
        this.mData = new Float32Array(1);
        this.mVolume = 0;
        this.mFineTune = 0;
        this.mRepeatLength = 1;
        this.mRepeatStartOffset = 0;
    }

    /**
     * Set repeat information.
     * @param pRepeatOffset - Repeat offset, where the repeat should start.
     * @param pRepeatLength - Repeat byte length.
     */
    public setRepeatInformation(pRepeatOffset: number, pRepeatLength: number): void {
        this.mRepeatStartOffset = pRepeatOffset;
        this.mRepeatLength = pRepeatLength;
    }
}