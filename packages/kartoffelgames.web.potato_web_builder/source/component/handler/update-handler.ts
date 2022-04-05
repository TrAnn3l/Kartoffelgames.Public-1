import { List } from '@kartoffelgames/core.data';
import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
import { UpdateScope } from '../enum/update-scope';
import { LoopDetectionHandler } from './loop-detection-handler';

export class UpdateHandler {
    private readonly mChangeDetection: ChangeDetection;
    private readonly mChangeDetectionListener: (pReason: ChangeDetectionReason) => void;
    private mEnabled: boolean;
    private readonly mLoopDetectionHandler: LoopDetectionHandler;
    private readonly mUpdateListener: List<UpdateListener>;
    private readonly mUpdateScope: UpdateScope;
    private readonly mUpdateWaiter: List<UpdateWaiter>;

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
        this.mUpdateWaiter = new List<UpdateWaiter>();
        this.mLoopDetectionHandler = new LoopDetectionHandler(10);

        // Create new change detection if component is not inside change detection or mode is capsuled.
        if (this.mUpdateScope === UpdateScope.Manual) {
            // Manual zone outside every other zone.
            this.mChangeDetection = new ChangeDetection('Manual Zone', null, true);
        } else if (!ChangeDetection.current || this.mUpdateScope === UpdateScope.Capsuled) {
            this.mChangeDetection = new ChangeDetection('DefaultComponentZone');
        } else {
            this.mChangeDetection = ChangeDetection.currentNoneSilent;
        }

        // Add listener for changes inside change detection.
        if (this.mUpdateScope !== UpdateScope.Manual) {
            this.mChangeDetectionListener = (pReason: ChangeDetectionReason) => { this.sheduleUpdate(pReason); };
            this.mChangeDetection.addChangeListener(this.mChangeDetectionListener);
        }

        // Define error handler.
        this.mLoopDetectionHandler.onError = (pError: any) => {
            this.releaseWaiter(pError);
        };
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
    public executeInZone(pFunction: () => void): void {
        this.mChangeDetection.execute(pFunction);
    }

    /**
     * Execute function outside update detection scope.
     * @param pFunction - Function.
     */
    public executeOutZone(pFunction: () => void): void {
        this.mChangeDetection.silentExecution(pFunction);
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
        if (this.mLoopDetectionHandler.activeChain) {
            // Add new callback to waiter line.
            return new Promise<boolean>((pResolve: (pValue: boolean) => void, pReject: (pError: any) => void) => {
                this.mUpdateWaiter.push((pError: any) => {
                    if (pError) {
                        // Reject if any error exist.
                        pReject(pError);
                    } else {
                        // Is resolved when all data were updated.
                        pResolve(true);
                    }
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
            lListener.call(this, pReason);
        }
    }

    /**
     * Release all update waiter.
     */
    private releaseWaiter(pError?: any): void {
        for (const lUpdateWaiter of this.mUpdateWaiter) {
            lUpdateWaiter(pError);
        }
        this.mUpdateWaiter.clear();
    }

    /**
     * Update component parts that used the property.
     */
    private sheduleUpdate(pReason: ChangeDetectionReason): void {
        if (!this.enabled) {
            this.releaseWaiter();
            return;
        }

        this.mLoopDetectionHandler.callAsynchron(() => {
            this.mChangeDetection.execute(() => {
                // Call every update listener.
                this.dispatchUpdateListener(pReason);

                // Check if any changes where made during the listener calls. If not, release all waiter.
                if (!this.mLoopDetectionHandler.activeChain) {
                    this.releaseWaiter();
                }
            });
        }, pReason);
    }
}

type UpdateWaiter = (pError?: any) => void;
export type UpdateListener = (pReason: ChangeDetectionReason) => void;
