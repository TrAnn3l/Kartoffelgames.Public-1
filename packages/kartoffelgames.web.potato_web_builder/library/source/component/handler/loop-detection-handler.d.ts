import { ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
export declare class LoopDetectionHandler {
    private readonly mCurrentUpdateChain;
    private mInsideCall;
    private readonly mMaxStackSize;
    private mNextUpdateCycle;
    /**
     * Constructor.
     */
    constructor(pMaxStackSize: number);
    /**
     * Calls function asynchron. Checks for loops and
     * Throws error if stack overflows.
     * @param pReason - Stack reason.
     */
    callAsynchron<T>(pFunction: () => T, pReason: ChangeDetectionReason): void;
}
export declare class LoopError {
    readonly chain: Array<ChangeDetectionReason>;
    readonly message: string;
    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current update chain.
     */
    constructor(pMessage: string, pChain: Array<ChangeDetectionReason>);
}
//# sourceMappingURL=loop-detection-handler.d.ts.map