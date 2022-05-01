import { Exception } from '@kartoffelgames/core.data';
import { Pattern } from './pattern';

/**
 * Complete pattern data.
 */
export class PatternList {
    private readonly mPatternList: Array<Pattern>;
    private mSongPositionList: Array<number>;

    /**
     * Get pattern count.
     */
    public get patternCount(): number {
        return this.mPatternList.length;
    }

    /**
     * Get song positions.
     */
    public get songPositions(): Array<number> {
        return this.mSongPositionList;
    }

    /**
     * Set song positions.
     */
    public set songPositions(pPatternOrder: Array<number>) {
        this.mSongPositionList = pPatternOrder;
    }

    /**
     * Constructor.
     * Initialize lists.
     */
    public constructor() {
        this.mPatternList = new Array<Pattern>();
    }

    /**
     * Add pattern.
     * @param pPattern - Data of one pattern.
     * @param pIndex - Index of pattern. If not specified, the pattern get append after last known pattern index.
     */
    public addPattern(pIndex?: number): Pattern {
        const lNewPattern: Pattern = new Pattern();

        // Add new when no index is specified.
        if (pIndex === null || pIndex === this.mPatternList.length) {
            this.mPatternList.push(lNewPattern);
        } else {
            // Check if index would produce gaps.
            if (pIndex > this.mPatternList.length) {
                throw new Exception(`Pattern index would produce gaps with missing pattern.`, this);
            }

            // Set pattern to index.
            this.mPatternList[pIndex] = lNewPattern;
        }

        return lNewPattern;
    }

    /**
     * Get pattern data by index.
     * @param pIndex - Index of pattern.
     */
    public getPattern(pIndex: number): Pattern {
        return this.mPatternList[pIndex] ?? new Pattern();
    }

    /**
     * Clear Pattern or remove pattern when pattern is on last index.
     * @param pIndex - .
     */
    public removePattern(pIndex: number): void {
        // Exit when index is out of bound.
        if (pIndex >= this.mPatternList.length) {
            return;
        }

        // Remove last element or clear pattern.
        if (pIndex === (this.mPatternList.length - 1)) {
            this.mPatternList.pop();
        } else {
            // Replace pattern with empty one.
            this.mPatternList[pIndex] = new Pattern();
        }
    }
}