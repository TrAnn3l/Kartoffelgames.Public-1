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
    private readonly mUserObjectHandler: UserObjectHandler;


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
    public constructor(pUserObjectHandler: UserObjectHandler, pUpdateScope: UpdateScope) {
        this.mUpdateScope = pUpdateScope;
        this.mUpdateListener = new List<UpdateListener>();
        this.mEnabled = false;
        this.mUpdateWaiter = new List<() => void>();
        this.mLoopDetectionHandler = new LoopDetectionHandler(10);
        this.mUserObjectHandler = pUserObjectHandler;

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
    private dispatchUpdateListener(pReason: ChangeDetectionReason): boolean {
        // Trigger all update listener and check if any updates happened.
        let lChanges: boolean = false;
        for (const lListener of this.mUpdateListener) {
            lChanges = lListener.bind(this, pReason) || lChanges;
        }

        return lChanges;
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
                // Call user class on update function.
                this.mUserObjectHandler.callOnPwbUpdate();

                // Outside update before actual update happens.
                this.mUpdateSheduled = false;

                // Update component and get if any update was made.
                const lHasUpdated: boolean = this.dispatchUpdateListener(pReason);

                // Release all update waiter
                for (const lUpdateWaiter of this.mUpdateWaiter) {
                    lUpdateWaiter();
                }
                this.mUpdateWaiter.clear();

                // Call user class on update function if any update was made.
                if (lHasUpdated) {
                    this.mUserObjectHandler.callAfterPwbUpdate();
                }
            });
        }, pReason);
    }
}

export type UpdateListener = (pReason: ChangeDetectionReason) => boolean;