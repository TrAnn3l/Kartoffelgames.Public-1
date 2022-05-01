import { BaseEffect } from '../../generic_module/effect/base-effect';
import { EffectBound } from '../../enum/effect-bound';

export abstract class BasePlayerEffect<TEffect extends BaseEffect> {
    private readonly mEffect: TEffect;

    /**
     * Effect data.
     */
    protected get effectData(): TEffect {
        return this.mEffect;
    }

    /**
     * If this effect should only be called once at division start.
     */
    public abstract readonly effectBound: EffectBound;

    /**
     * Constructor.
     * @param pEffect - Effect data.
     */
    public constructor(pEffect: TEffect){
        this.mEffect = pEffect;
    }

    /**
     * Process effect and get last
     * @param pSampleStep - Current next sample step.
     * @param pTickChanged - If tick has changed since last process.
     */
    public abstract process(pSampleStep: number, pTickChanged: boolean): number;
}