import { GenericModule } from '../../generic_module/generic-module';
import { CursorHandler } from './handler/cursor-handler';
import { JumpHandler } from './handler/jump-handler';
import { LengthHandler } from './handler/length-handler';
import { SpeedHandler } from './handler/speed-handler';

export class PlayerModule {
    private readonly mCursor: CursorHandler;
    private readonly mGenericModule: GenericModule;
    private readonly mJump: JumpHandler;
    private readonly mModuleLengthInformation: LengthHandler;
    private readonly mSpeedHandler: SpeedHandler;

    /**
     * Get current cursor.
     */
    public get cursor(): CursorHandler {
        return this.mCursor;
    }

    /**
     * Get jump handler.
     */
    public get jump(): JumpHandler {
        return this.mJump;
    }

    /**
     * Get length handler.
     */
    public get length(): LengthHandler {
        return this.mModuleLengthInformation;
    }

    /**
     * Get generic module.
     */
    public get module(): GenericModule {
        return this.mGenericModule;
    }

    /**
     * Get speed handler.
     */
    public get speed(): SpeedHandler {
        return this.mSpeedHandler;
    }

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: PlayerModuleConstructorParameter) {
        this.mGenericModule = pParameter.genericModule;
        this.mModuleLengthInformation = pParameter.lengthHandler;
        this.mCursor = pParameter.cursorHandler;
        this.mJump = pParameter.jumpHandler;
        this.mSpeedHandler = pParameter.speedHandler;
    }
}

interface PlayerModuleConstructorParameter {
    genericModule: GenericModule;
    speedHandler: SpeedHandler;
    lengthHandler: LengthHandler;
    cursorHandler: CursorHandler;
    jumpHandler: JumpHandler;
}