import { PlayerLengthCalculator } from './player-length-calculator';

export class PlayerCursor {
    private mDivisionIndex: number;
    private readonly mLengthCalculator: PlayerLengthCalculator;
    private mSampleIndex: number;
    private mSongPositionIndex: number;
    private mTickIndex: number;

    /**
     * Get current songPosition index.
     */
    public get songPosition(): number {
        return this.mSongPositionIndex;
    }

    /**
     * Get current division index.
     */
    public get division(): number {
        return this.mDivisionIndex;
    }

    /**
     * Get current tick index.
     */
    public get tick(): number {
        return this.mTickIndex;
    }

    /**
     * Get current sample index.
     */
    public get sample(): number {
        return this.mSampleIndex;
    }

    /**
     * Constructor.
     * @param pLengthInformation - Module length calculator.
     */
    public constructor(pLengthInformation: PlayerLengthCalculator) {
        // Init.
        this.mSongPositionIndex = 0;
        this.mDivisionIndex = 0;
        this.mTickIndex = 0;
        this.mSampleIndex = 0;

        this.mLengthCalculator = pLengthInformation;
    }

    /**
     * Jump to position.
     * @param pSongPosition - Song position index.
     * @param pDivision - Division index.
     */
    public jumpTo(pSongPosition: number, pDivision: number): void {
        // Set song position and division.
        this.mSongPositionIndex = pSongPosition;
        this.mDivisionIndex = pDivision;

        // Reset tick and sample.
        this.mSampleIndex = 0;
        this.mTickIndex = 0;
    }

    /**
     * Move cursor one sample next. 
     */
    public next(): CursorChange {
        const lCursorChange = {
            songPosition: false,
            division: false,
            tick: false
        };

        // Increment sample and check overflow.
        this.mSampleIndex++;
        if (this.mSampleIndex === this.mLengthCalculator.samples) {
            this.mSampleIndex -= this.mLengthCalculator.samples;

            // Set change state, increment tick and check overflow.
            lCursorChange.tick = true;
            this.mTickIndex++;
            if (this.mTickIndex === this.mLengthCalculator.ticks) {
                this.mTickIndex -= this.mLengthCalculator.ticks;

                // Set change state, increment division and check overflow.
                lCursorChange.division = true;
                this.mDivisionIndex++;
                if (this.mDivisionIndex === this.mLengthCalculator.divisions) {
                    this.mDivisionIndex -= this.mLengthCalculator.divisions;

                    // Set change state and increment song position. Song position can overflow.
                    lCursorChange.songPosition = true;
                    this.mSongPositionIndex++;
                }
            }
        }

        return lCursorChange;
    }
}

export interface CursorChange {
    songPosition: boolean;
    division: boolean;
    tick: boolean;
}