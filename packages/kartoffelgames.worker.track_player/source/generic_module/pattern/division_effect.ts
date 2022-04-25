/**
 * Devision effect.
 */
export class DivisionEffect {
    private mEffect: Effect;
    private mParameterX: number;
    private mParameterY: number;

    /**
     * Set effect.
     */
    public get effect(): Effect {
        return this.mEffect;
    }

    /**
     * Set effect.
     */
    public set effect(pEffect: Effect) {
        this.mEffect = pEffect;
    }

    /**
     * Set parameter X.
     */
    public get parameterX(): Effect {
        return this.mParameterX;
    }

    /**
     * Set parameter X.
     */
    public set parameterX(pParameterX: number) {
        this.mParameterX = pParameterX;
    }

    /**
     * Set parameter Y.
     */
    public get parameterY(): Effect {
        return this.mParameterY;
    }

    /**
     * Set parameter Y.
     */
    public set parameterY(pParameterY: number) {
        this.mParameterY = pParameterY;
    }
}

export enum Effect {

}