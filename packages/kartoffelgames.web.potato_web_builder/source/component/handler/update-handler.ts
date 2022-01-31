import { List } from '@kartoffelgames/core.data';
import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
import { UpdateScope } from '../../enum/update-scope';

export class UpdateHandler {
    private readonly mChangeDetection: ChangeDetection;
    private readonly mChangeDetectionListener: (pReason: ChangeDetectionReason) => void;
    private mEnabled: boolean;
    private readonly mUpdateListener: List<UpdateListener>;
    private readonly mUpdateScope: UpdateScope;

    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    public get enabled(): boolean {
        return this.mEnabled;
    }

    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    public set enabled(pEnabled: boolean) {
        this.mEnabled = pEnabled;
    }

    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    public constructor(pUpdateScope: UpdateScope) {
        this.mUpdateScope = pUpdateScope;
        this.mUpdateListener = new List<UpdateListener>();
        this.mEnabled = false;

        // Create new change detection if component is not inside change detection or mode is capsuled.
        if (!ChangeDetection.current || this.mUpdateScope === UpdateScope.Capsuled) {
            this.mChangeDetection = new ChangeDetection('DefaultComponentZone');
        } else if (this.mUpdateScope === UpdateScope.Manual) {
            // Manual zone outside every other zone.
            this.mChangeDetection = new ChangeDetection('Manual Zone', null, true);
        } else {
            this.mChangeDetection = ChangeDetection.currentNoneSilent;
        }

        // Add listener for changes inside change detection.
        if (this.mUpdateScope === UpdateScope.Manual) {
            this.mChangeDetectionListener = () => { return; }; // Empty.
        } else {
            this.mChangeDetectionListener = (pReason: ChangeDetectionReason) => { this.sheduleUpdate(pReason); };
        }
        this.mChangeDetection.addChangeListener(this.mChangeDetectionListener);
    }

    /**
     * Listen for updates.
     * @param pListener - Listener.
     */
    public addUpdateListener(pListener: UpdateListener): void {
        this.mUpdateListener.push(pListener);
    }

    /**
     * Deconstruct update handler. 
     */
    public deconstruct(): void {
        // Disconnect from change listener.
        this.mChangeDetection.removeChangeListener(this.mChangeDetectionListener);

        // Remove all update listener.
        this.mUpdateListener.clear();

        // Disable handling.
        this.enabled = false;
    }

    /**
     * Execute function inside update detection scope.
     * @param pFunction - Function.
     */
    public execute(pFunction: () => void): void {
        this.mChangeDetection.execute(pFunction);
    }

    /**
     * Register object and pass on update events.
     * @param pObject - Object.
     */
    public registerObject<T extends object>(pObject: T): T {
        return this.mChangeDetection.registerObject(pObject);
    }

    /**
     * Shedule manual update.
     * @param pReason - Update reason.
     */
    public triggerUpdate(pReason: ChangeDetectionReason): void {
        this.sheduleUpdate(pReason);
    }

    /**
     * Trigger update manual.
     */
    private dispatchUpdateListener(pReason: ChangeDetectionReason): void {
        for (const lListener of this.mUpdateListener) {
            lListener.bind(this, pReason);
        }
    }

    private sheduleUpdate(pReason: ChangeDetectionReason): void {

    }
}

export type UpdateListener = (pReason: ChangeDetectionReason) => void;