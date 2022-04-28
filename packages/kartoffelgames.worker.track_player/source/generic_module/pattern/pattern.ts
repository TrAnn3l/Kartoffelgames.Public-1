import { Exception } from '@kartoffelgames/core.data';
import { Division } from './division';

export class Pattern {
    private readonly mChannelCount: number;
    private readonly mRowCount: number;
    private readonly mRows: Array<Array<Division>>;

    /**
     * Get row count.
     */
    public get rowsCount(): number {
        return this.mRowCount;
    }

    /**
     * Constructor.
     * @param pChannelCount - Channel count.
     * @param pRowCount - Row count.
     */
    public constructor(pChannelCount: number, pRowCount: number) {
        this.mChannelCount = pChannelCount;
        this.mRowCount = pRowCount;
        this.mRows = new Array<Array<Division>>();
    }

    /**
     * Get pattern row information.
     * @param pRowIndex - Row index.
     */
    public getRow(pRowIndex: number): Array<Division> {
        // Return real row.
        return this.mRows[pRowIndex] ?? null;
    }

    public setRow(pRow: Array<Division>, pRowIndex: number = null): void {
        // Catch wrong channel index.
        if (pRow.length !== this.mChannelCount) {
            throw new Exception(`Pattern row needs ${this.mChannelCount} channels.`, this);
        }

        // Catch wrong row index.
        if (pRowIndex > (this.mRowCount - 1)) {
            throw new Exception(`Pattern has only ${this.mRowCount} rows.`, this);
        }

        if (pRowIndex !== null) {
            this.mRows[pRowIndex] = pRow;
        } else {
            this.mRows.push(pRow);
        }
    }
}