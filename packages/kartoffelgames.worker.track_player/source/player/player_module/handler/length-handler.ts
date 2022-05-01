import { GenericModule } from '../../../generic_module/generic-module';
import { Division } from '../../../generic_module/pattern/division';
import { Pattern } from '../../../generic_module/pattern/pattern';
import { SpeedHandler } from './speed-handler';

export class LengthHandler {
    private readonly mGenericModule: GenericModule;
    private readonly mSpeedHandler: SpeedHandler;
    private mTicksPerDivision: number;

    /**
     * Get channel count.
     */
    public get channels(): number {
        // For performance. Get channel count from first division.
        const lFirstPattern: Pattern = this.mGenericModule.pattern.getPattern(0);
        const lFirstDivision: Division = lFirstPattern.getDivision(0);

        return lFirstDivision.channelCount; 
    }

    /**
     * Get count of divisions per pattern.
     */
    public get divisions(): number {
        // Get all pattern lenfths.
        const lPatternLengthList: Array<number> = new Array<number>();
        for (let lPatternIndex: number = 0; lPatternIndex < this.mGenericModule.pattern.patternCount; lPatternIndex++) {
            const lPattern: Pattern = this.mGenericModule.pattern.getPattern(lPatternIndex);
            lPatternLengthList.push(lPattern.divisionCount);
        }

        // Return max patten length.
        return Math.max(...lPatternLengthList);
    }

    /**
     * Get count of samples per division.
     */
    public get samples(): number {
        return ((this.mSpeedHandler.speed.sampleRate * 60) / (this.mSpeedHandler.speed.beatsPerMinute * this.mSpeedHandler.speed.speedUp)) / 24;
    }

    /**
     * Get count of song positions.
     */
    public get songPositions(): number {
        return this.mGenericModule.pattern.songPositions.length;
    }

    /**
     * Get count of ticks per division.
     */
    public get ticks(): number {
        return this.mTicksPerDivision;
    }

    /**
     * Constructor.
     * @param pModule - Playing module.
     * @param pSpeedHandler - Speed handler.
     */
    public constructor(pModule: GenericModule, pSpeedHandler: SpeedHandler) {
        this.mGenericModule = pModule;
        this.mSpeedHandler = pSpeedHandler;

        // Set default tick rate.
        this.setTickRate(6);
    }

    /**
     * Set tick rate for next playing divisions.
     * @param pTicksPerDivision - Ticks per division.
     */
    public setTickRate(pTicksPerDivision: number): void {
        this.mTicksPerDivision = pTicksPerDivision;
    }
}