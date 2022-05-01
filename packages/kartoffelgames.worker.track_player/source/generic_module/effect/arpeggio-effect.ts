import { BaseEffect } from './base-effect';

/**
 * Devision arpeggio effect.
 */
export class ArpeggioEffect extends BaseEffect {
    private mNoteChangList: Array<number>;

    /**
     * Get note changes in division.
     */
    public get noteChanges(): Array<number> {
        return this.mNoteChangList;
    }

    /**
     * Set note changes in division.
     */
    public set noteChanges(pNoteChanges: Array<number>) {
        this.mNoteChangList = pNoteChanges;
    }
}