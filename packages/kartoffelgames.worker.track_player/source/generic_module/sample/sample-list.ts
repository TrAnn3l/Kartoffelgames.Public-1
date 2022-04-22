import { Exception } from '@kartoffelgames/core.data';
import { Sample } from './sample';

export class SampleList {
    private mSampleCount: number;
    private readonly mSampleList: Array<Sample>;

    /**
     * Get sample count.
     */
    public get sampleCount(): number {
        return this.mSampleCount;
    }

    /**
     * Get sample count.
     */
    public set sampleCount(pSampleCount: number) {
        this.mSampleCount = pSampleCount;
    }

    /**
     * Constructor.
     * @param pSampleCount - Sample count.
     */
    public constructor() {
        this.mSampleCount = 0;
        this.mSampleList = new Array<Sample>();
    }

    /**
     * Get sample by index.
     * @param pIndex - Index of sample.
     */
    public getSample(pIndex: number): Sample | null {
        // Restrict sample range.
        if (pIndex > this.mSampleCount - 1) {
            return null;
        }

        // Read sample.
        const lSample: Sample = this.mSampleList[pIndex];

        // Return empty sample when sample is not set.
        if (!(lSample instanceof Sample)) {
            return new Sample();
        }

        return lSample;
    }

    /**
     * Remove sample by index.
     * @param pIndex - Index of sample.
     */
    public removeSample(pIndex: number): void {
        // Restrict sample range.
        if (pIndex > this.mSampleCount - 1) {
            return;
        }

        // Reset sample.
        this.mSampleList[pIndex] = new Sample();
    }

    /**
     * Add sample to list.
     * @param pIndex - Index of sample.
     * @param pSample - New sample.
     */
    public setSample(pIndex: number, pSample: Sample): void {
        // Restrict sample range.
        if (pIndex > this.mSampleCount - 1) {
            throw new Exception(`Sample is out of range. Maximum ${this.mSampleCount + 1} samples are allowed.`, this);
        }

        // Set sample to index.
        this.mSampleList[pIndex] = pSample;
    }
}