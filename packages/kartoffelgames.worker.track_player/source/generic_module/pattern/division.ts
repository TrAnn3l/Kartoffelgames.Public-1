import { DivisionEffect } from './division_effect';

export class Division {
    private mEffect: DivisionEffect;
    private mPeriod: number;
    private mSampleIndex: number;

    /**
     * Set effect.
     */
    public get effect(): DivisionEffect {
        return this.mEffect;
    }

    /**
     * Set effect.
     */
    public set effect(pEffect: DivisionEffect) {
        this.mEffect = pEffect;
    }

    /**
     * Set period.
     */
    public get period(): number {
        return this.mPeriod;
    }

    /**
     * Set period.
     */
    public set period(pPeriod: number) {
        this.mPeriod = pPeriod;
    }

    /**
     * Set sample index.
     */
    public get sampleIndex(): number {
        return this.mSampleIndex;
    }

    /**
     * Set sample index.
     */
    public set sampleIndex(pSampleIndex: number) {
        this.mSampleIndex = pSampleIndex;
    }
}