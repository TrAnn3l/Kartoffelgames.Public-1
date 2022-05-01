import { Exception } from '@kartoffelgames/core.data';
import { Sample } from './sample';

export class SampleList {
    private readonly mSampleList: Array<Sample>;

    /**
     * Get sample count.
     */
    public get sampleCount(): number {
        return this.mSampleList.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mSampleList = new Array<Sample>();
    }

    /**
     * Add sample to list.
     * @param pIndex - Index of sample.
     * @param pSample - New sample.
     */
    public addSample(pIndex?: number): Sample {
        const lNewSample: Sample = new Sample();

        // Add new when no index is specified.
        if (pIndex === null || pIndex === this.mSampleList.length) {
            this.mSampleList.push(lNewSample);
        } else {
            // Check if index would produce gaps.
            if (pIndex > this.mSampleList.length) {
                throw new Exception(`Sample index would produce gaps with missing samples.`, this);
            }

            // Set sample to index.
            this.mSampleList[pIndex] = lNewSample;
        }

        return lNewSample;
    }

    /**
     * Get sample by index.
     * @param pIndex - Index of sample.
     */
    public getSample(pIndex: number): Sample | null {
        // Read sample.
        return this.mSampleList[pIndex] ?? new Sample();
    }

    /**
     * Remove sample by index.
     * @param pIndex - Index of sample.
     */
    public removeSample(pIndex: number): void {
        // Exit if index is out of bound.
        if (pIndex >= (this.mSampleList.length - 1)) {
            return;
        }

        // Remove last element if index is last element.
        if (pIndex === (this.mSampleList.length - 1)) {
            this.mSampleList.pop();
        } else {
            // Replace with empty sample if any gap would be produced.
            this.mSampleList[pIndex] = new Sample();
        }
    }
}