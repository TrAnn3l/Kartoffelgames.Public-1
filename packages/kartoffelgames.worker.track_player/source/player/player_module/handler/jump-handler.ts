import { CursorHandler } from './cursor-handler';

export class JumpHandler {
    private mJumpSongPosition: number;
    private readonly mLoopPosition: LoopPosition;
    private readonly mPlayerCursor: CursorHandler;

    /**
     * Constructor.
     * @param pCursor - Player cursor.
     */
    public constructor(pCursor: CursorHandler) {
        this.mPlayerCursor = pCursor;

        // Initialize with none working jump position. 
        this.mJumpSongPosition = null;
        this.mLoopPosition = {
            division: -1,
            counter: 0,
            active: false
        };
    }

    /**
     * Try to execute jump and return success.
     */
    public executeJump(): boolean {
        // Look for existing jump.
        if (this.mJumpSongPosition !== null) {
            // Execute jump.
            this.mPlayerCursor.jumpTo(this.mJumpSongPosition, 0);

            // Reset jump.
            this.mJumpSongPosition = null;

            return true;
        }

        return false;
    }

    public executeLoop(): boolean { 
        // Look for existing jump.
        if (this.mLoopPosition.counter > 0 && this.mLoopPosition.active) {
            // Execute jump.
            this.mPlayerCursor.jumpTo(this.mPlayerCursor.songPositionIndex, this.mLoopPosition.division);

            // Reset jump.
            this.mLoopPosition.counter--;

            return true;
        }

        return false;
    }

    /**
     * Reset loop position.
     */
    public resetLoop(): void { 
        this.mLoopPosition.counter = 0;
        this.mLoopPosition.division = -1;
        this.mLoopPosition.active = false;
    }

    /**
     * Set single jump executed after this division.
     * @param pSongPosition - Song position for jump.
     */
    public setJumpPosition(pSongPosition: number): void {
        this.mJumpSongPosition = pSongPosition;
    }

    public setLoopPosition(pDivision: number, pCounter: number): void {
        // TODO: Counter beim setzen oder beim sprung????
        // TODO: Jump wann.
    }
}

interface LoopPosition {
    division: number,
    counter: number;
    active: boolean
}