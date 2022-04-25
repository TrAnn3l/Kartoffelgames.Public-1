import { Pattern } from './pattern';

/**
 * Complete pattern data.
 */
export class PatternList {
    private readonly mPattern: Array<Pattern>;
    private mSongPositionList: Array<number>;

    /**
     * Get pattern count.
     */
    public get patternCount(): number {
        return this.mPattern.length;
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
        this.mPattern = new Array<Pattern>();
    }

    /**
     * Add pattern.
     * @param pPattern - Data of one pattern.
     * @param pIndex - Index of pattern. If not specified, the pattern get append after last known pattern index.
     */
    public addPattern(pPattern: Pattern, pIndex?: number): void {
        if (typeof pIndex === 'number') {
            this.mPattern[pIndex] = pPattern;
        } else {
            this.mPattern.push(pPattern);
        }
    }

    /**
     * Get pattern data by index.
     * @param pIndex - Index of pattern.
     */
    public getPattern(pIndex: number): Pattern {
        return this.mPattern[pIndex];
    }
}