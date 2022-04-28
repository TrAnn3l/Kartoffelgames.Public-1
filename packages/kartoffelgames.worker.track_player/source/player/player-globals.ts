import { GenericModule } from '../generic_module/generic-module';
import { PlayerCursor } from './player-cursor';
import { PlayerLengthCalculator } from './player-length-calculator';

export class PlayerGlobals {
    private readonly mCursor: PlayerCursor;
    private readonly mLengthInformation: PlayerLengthCalculator;
    private readonly mModule: GenericModule;

    /**
     * Get cursor.
     */
    public get cursor(): PlayerCursor {
        return this.mCursor;
    }

    /**
     * Get length information.
     */
    public get lengthInformation(): PlayerLengthCalculator {
        return this.mLengthInformation;
    }

    /**
     * Get module.
     */
    public get module(): GenericModule {
        return this.mModule;
    }

    /**
     * Constructor.
     * @param pSampleRate - Global sample rate.
     */
    public constructor(pModule: GenericModule, pSampleRate: number) {
        this.mModule = pModule;
        this.mLengthInformation = new PlayerLengthCalculator(pModule, pSampleRate);
        this.mCursor = new PlayerCursor(this.mLengthInformation);
    }
}