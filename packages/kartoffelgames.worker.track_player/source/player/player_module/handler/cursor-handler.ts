import { LengthHandler } from './length-handler';

export class CursorHandler {
    private mAudioSampleIndex: number;
    private mDivisionIndex: number;
    private readonly mModuleLengthInformation: LengthHandler;
    private mSongPositionIndex: number;
    private mTickIndex: number;

    /**
     * Get current songPosition index.
     */
    public get songPositionIndex(): number {
        return this.mSongPositionIndex;
    }

    /**
     * Get current division index.
     */
    public get divisionIndex(): number {
        return this.mDivisionIndex;
    }

    /**
     * Get current tick index.
     */
    public get tickIndex(): number {
        return this.mTickIndex;
    }

    /**
     * Get current audio sample index.
     */
    public get audioSampleIndex(): number {
        return this.mAudioSampleIndex;
    }

    /**
     * Constructor.
     * @param pLengthInformation - Module length calculator.
     */
    public constructor(pLengthInformation: LengthHandler) {
        this.mModuleLengthInformation = pLengthInformation;

        // Reset cursor.
        this.restart();
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
        this.mAudioSampleIndex = 0;
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

        // Check restart position.
        if (this.mSongPositionIndex === -1) {
            // Set everthing on change state.
            lCursorChange.songPosition = true;
            lCursorChange.division = true;
            lCursorChange.tick = true;

            // Set everything on first index.
            this.mAudioSampleIndex = 0;
            this.mTickIndex = 0;
            this.mDivisionIndex = 0;
            this.mSongPositionIndex = 0;
        } else {
            // Increment sample and check overflow.
            this.mAudioSampleIndex++;
            if (this.mAudioSampleIndex === this.mModuleLengthInformation.samples) {
                this.mAudioSampleIndex -= this.mModuleLengthInformation.samples;

                // Set change state, increment tick and check overflow.
                lCursorChange.tick = true;
                this.mTickIndex++;
                if (this.mTickIndex === this.mModuleLengthInformation.ticks) {
                    this.mTickIndex -= this.mModuleLengthInformation.ticks;

                    // Set change state, increment division and check overflow.
                    lCursorChange.division = true;
                    this.mDivisionIndex++;
                    if (this.mDivisionIndex === this.mModuleLengthInformation.divisions) {
                        this.mDivisionIndex -= this.mModuleLengthInformation.divisions;

                        // Set change state and increment song position. Song position can overflow.
                        lCursorChange.songPosition = true;
                        this.mSongPositionIndex++;
                    }
                }
            }
        }

        return lCursorChange;
    }

    /**
     * Restart cursor.
     */
    public restart(): void {
        this.mSongPositionIndex = -1;
        this.mDivisionIndex = -1;
        this.mTickIndex = -1;
        this.mAudioSampleIndex = -1;
    }
}

export interface CursorChange {
    songPosition: boolean;
    division: boolean;
    tick: boolean;
}