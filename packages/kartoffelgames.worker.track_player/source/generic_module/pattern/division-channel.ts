import { BaseEffect } from '../effect/base-effect';
import { Pitch } from '../../enum/pitch';
import { EmptyEffect } from '../effect/empty-effect';

export class DivisionChannel {
    private mEffect: BaseEffect;
    private mPeriod: Pitch;
    private mSampleIndex: number;

    /**
     * Set effect.
     */
    public get effect(): BaseEffect {
        return this.mEffect;
    }

    /**
     * Set effect.
     */
    public set effect(pEffect: BaseEffect) {
        this.mEffect = pEffect;
    }

    /**
     * Set period.
     */
    public get period(): Pitch {
        return this.mPeriod;
    }

    /**
     * Set period.
     */
    public set period(pPeriod: Pitch) {
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

    /**
     * Constructor.
     * Set empty information.
     */
    public constructor() {
        this.mEffect = new EmptyEffect();
        this.mPeriod = 0;
        this.mSampleIndex = -1;
    }
}