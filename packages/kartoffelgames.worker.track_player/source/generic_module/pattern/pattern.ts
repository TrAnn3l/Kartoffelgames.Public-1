import { Exception } from '@kartoffelgames/core.data';
import { Division } from './division';

export class Pattern {
    private readonly mDivisionList: Array<Division>;

    /**
     * Get division count.
     */
    public get divisionCount(): number {
        return this.mDivisionList.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mDivisionList = new Array<Division>();
    }

    /**
     * Add new division. Appends if no index is specified.
     * @param pIndex - Index of new division.
     */
    public addDivision(pIndex?: number): Division {
        const lNewDivision: Division = new Division();

        // Add new when no index is specified.
        if (pIndex === null || pIndex === this.mDivisionList.length) {
            this.mDivisionList.push(lNewDivision);
        } else {
            // Check if index would produce gaps.
            if (pIndex > this.mDivisionList.length) {
                throw new Exception(`Division index would produce gaps with missing dicisions.`, this);
            }

            // Set pattern to index.
            this.mDivisionList[pIndex] = lNewDivision;
        }

        return lNewDivision;
    }

    /**
     * Get pattern row information.
     * @param pDivisionIndex - Division index.
     */
    public getDivision(pDivisionIndex: number): Division {
        // Return real row.
        return this.mDivisionList[pDivisionIndex] ?? new Division();
    }

    /**
     * Remove sample by index.
     * @param pIndex - Index of sample.
     */
    public removeDivision(pIndex: number): void {
        // Exit if index is out of bound.
        if (pIndex >= (this.mDivisionList.length - 1)) {
            return;
        }

        // Remove last element if index is last element.
        if (pIndex === (this.mDivisionList.length - 1)) {
            this.mDivisionList.pop();
        } else {
            // Replace with empty division if any gap would be produced.
            this.mDivisionList[pIndex] = new Division();
        }
    }
}