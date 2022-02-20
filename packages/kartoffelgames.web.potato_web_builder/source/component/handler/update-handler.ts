import { List } from '@kartoffelgames/core.data';
import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
import { UpdateScope } from '../../enum/update-scope';
import { LoopDetectionHandler } from './loop-detection-handler';
import { UserObjectHandler } from './user-object-handler';

export class UpdateHandler {
    private readonly mChangeDetection: ChangeDetection;
    private readonly mChangeDetectionListener: (pReason: ChangeDetectionReason) => void;
    private mEnabled: boolean;
    private readonly mLoopDetectionHandler: LoopDetectionHandler;
    private readonly mUpdateListener: List<UpdateListener>;
    private readonly mUpdateScope: UpdateScope;
    private mUpdateSheduled: boolean;
    private readonly mUpdateWaiter: List<() => void>;

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
        this.mUpdateWaiter = new List<() => void>();
        this.mLoopDetectionHandler = new LoopDetectionHandler(10);

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
        if (this.mUpdateScope !== UpdateScope.Manual) {
            this.mChangeDetectionListener = (pReason: ChangeDetectionReason) => { this.sheduleUpdate(pReason); };
            this.mChangeDetection.addChangeListener(this.mChangeDetectionListener);
        }
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
        // Disconnect from change listener. Does nothing if listener is not defined.
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
     * Shedule forced manual update.
     * @param pReason - Update reason.
     */
    public forceUpdate(pReason: ChangeDetectionReason): void {
        this.sheduleUpdate(pReason);

        // Request update to dispatch change events on other components.
        this.requestUpdate(pReason);
    }

    /**
     * Register object and pass on update events.
     * @param pObject - Object.
     */
    public registerObject<T extends object>(pObject: T): T {
        return this.mChangeDetection.registerObject(pObject);
    }

    /**
     * Request update.
     * @param pReason 
     */
    public requestUpdate(pReason: ChangeDetectionReason): void {
        this.mChangeDetection.dispatchChangeEvent(pReason);
    }

    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    public async waitForUpdate(): Promise<boolean> {
        if (this.mUpdateSheduled) {
            // Add new callback to waiter line.
            return new Promise<boolean>((pResolve: (pValue: boolean) => void) => {
                this.mUpdateWaiter.push(() => {
                    // Is resolved when all data were updated.
                    pResolve(true);
                });
            });
        } else {
            return false;
        }
    }

    /**
     * Call all update listener.
     */
    private dispatchUpdateListener(pReason: ChangeDetectionReason): void {
        // Trigger all update listener.
        for (const lListener of this.mUpdateListener) {
            lListener.bind(this)(pReason);
        }
    }

    /**
     * Update component parts that used the property.
     */
    private sheduleUpdate(pReason: ChangeDetectionReason): void {
        if (!this.enabled) {
            return;
        }

        // Set update handler into update sheduled mode.
        this.mUpdateSheduled = true;

        this.mLoopDetectionHandler.callAsynchron(() => {
            this.mChangeDetection.execute(() => {
                // Outside update before actual update happens.
                this.mUpdateSheduled = false;

                // Update component and get if any update was made.
                this.dispatchUpdateListener(pReason);

                // Release all update waiter when no update is sheduled.
                if (!this.mUpdateSheduled) {
                    for (const lUpdateWaiter of this.mUpdateWaiter) {
                        lUpdateWaiter();
                    }
                    this.mUpdateWaiter.clear();
                }
            });
        }, pReason);
    }
}

export type UpdateListener = (pReason: ChangeDetectionReason) => void;