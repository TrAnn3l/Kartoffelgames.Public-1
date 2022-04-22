import { Pattern } from './Pattern';

/**
 * Complete pattern data.
 */
export class PatternList {
    private readonly mPatternData: Array<Pattern>;
    private mPatternOrder: Array<number>;

    /**
     * Get pattern count.
     */
    public get patternCount(): number {
        return this.mPatternData.length;
    }

    /**
     * Get pattern order.
     */
    public get patternOrder(): Array<number> {
        return this.mPatternOrder;
    }

    /**
     * Set pattern order.
     */
    public set patternOrder(pPatternOrder: Array<number>) {
        this.mPatternOrder = pPatternOrder;
    }

    /**
     * Constructor.
     * Initialize lists.
     */
    public constructor() {
        this.mPatternData = new Array<Pattern>();
    }

    /**
     * Add pattern.
     * @param pPattern - Data of one pattern.
     * @param pIndex - Index of pattern. If not specified, the pattern get append after last known pattern index.
     */
    public addPattern(pPattern: Pattern, pIndex?: number): void {
        if (typeof pIndex === 'number') {
            this.mPatternData[pIndex] = pPattern;
        } else {
            this.mPatternData.push(pPattern);
        }
    }

    /**
     * Get pattern data by index.
     * @param pIndex - Index of pattern.
     */
    public getPattern(pIndex: number): Pattern {
        return this.mPatternData[pIndex];
    }
}