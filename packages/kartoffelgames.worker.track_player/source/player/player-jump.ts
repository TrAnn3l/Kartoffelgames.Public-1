import { PlayerCursor } from './player-cursor';

export class PlayerJump {
    private mJumpPosition: number;
    private readonly mLoopPosition: LoopPosition;
    private readonly mPlayerCursor: PlayerCursor;

    /**
     * Constructor.
     * @param pCursor - Player cursor.
     */
    public constructor(pCursor: PlayerCursor) {
        this.mPlayerCursor = pCursor;

        // Initialize with none working jump position. 
        this.mJumpPosition = null;
        this.mLoopPosition = {
            division: -1,
            counter: 0,
            active: false
        };
    }

    /**
     * Try to execute jump and retunr success.
     */
    public executeJump(): boolean {
        // Look for existing jump.
        if (this.mJumpPosition !== null) {
            // Execute jump.
            this.mPlayerCursor.jumpTo(this.mJumpPosition, 0);

            // Reset jump.
            this.mJumpPosition = null;

            return true;
        }

        return false;
    }

    public executeLoop(): boolean { 
        // Look for existing jump.
        if (this.mLoopPosition.counter > 0 && this.mLoopPosition.active) {
            // Execute jump.
            this.mPlayerCursor.jumpTo(this.mPlayerCursor.songPosition, this.mLoopPosition.division);

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
        this.mJumpPosition = pSongPosition;
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