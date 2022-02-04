import { ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
import { UpdateScope } from '../../enum/update-scope';
import { UserObjectHandler } from './user-object-handler';
export declare class UpdateHandler {
    private readonly mChangeDetection;
    private readonly mChangeDetectionListener;
    private mEnabled;
    private readonly mLoopDetectionHandler;
    private readonly mUpdateListener;
    private readonly mUpdateScope;
    private mUpdateSheduled;
    private readonly mUpdateWaiter;
    private readonly mUserObjectHandler;
    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    get enabled(): boolean;
    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    set enabled(pEnabled: boolean);
    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    constructor(pUserObjectHandler: UserObjectHandler, pUpdateScope: UpdateScope);
    /**
     * Listen for updates.
     * @param pListener - Listener.
     */
    addUpdateListener(pListener: UpdateListener): void;
    /**
     * Deconstruct update handler.
     */
    deconstruct(): void;
    /**
     * Execute function inside update detection scope.
     * @param pFunction - Function.
     */
    execute(pFunction: () => void): void;
    /**
     * Shedule forced manual update.
     * @param pReason - Update reason.
     */
    forceUpdate(pReason: ChangeDetectionReason): void;
    /**
     * Register object and pass on update events.
     * @param pObject - Object.
     */
    registerObject<T extends object>(pObject: T): T;
    /**
     * Request update.
     * @param pReason
     */
    requestUpdate(pReason: ChangeDetectionReason): void;
    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    waitForUpdate(): Promise<boolean>;
    /**
     * Call all update listener.
     */
    private dispatchUpdateListener;
    /**
     * Update component parts that used the property.
     */
    private sheduleUpdate;
}
export declare type UpdateListener = (pReason: ChangeDetectionReason) => boolean;
//# sourceMappingURL=update-handler.d.ts.map