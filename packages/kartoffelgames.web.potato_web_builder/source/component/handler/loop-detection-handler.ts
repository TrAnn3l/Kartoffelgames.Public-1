import { List } from '@kartoffelgames/core.data';
import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';

export class LoopDetectionHandler {
    private readonly mCurrentUpdateChain: List<ChangeDetectionReason>;
    private mInsideCall: boolean;
    private readonly mMaxStackSize: number;
    private mNextUpdateCycle: number;
    
    /**
     * Constructor.
     */
    public constructor(pMaxStackSize: number) {
        this.mCurrentUpdateChain = new List<ChangeDetectionReason>();
        this.mMaxStackSize = pMaxStackSize;
    }

    /**
     * Calls function asynchron. Checks for loops and
     * Throws error if stack overflows.
     * @param pReason - Stack reason.
     */
    public callAsynchron<T>(pFunction: () => T, pReason: ChangeDetectionReason): void {
        if (!this.mInsideCall) {
            this.mInsideCall = true;

            // Create and expand call stack.
            this.mCurrentUpdateChain.push(pReason);

            const lUpdateFunction = () => {
                // Set component to not updating so new changes doesn't get ignnored.
                this.mInsideCall = false;
                const lLastLength: number = this.mCurrentUpdateChain.length;

                // Call function after saving last chain length.
                // If no update was made on this call, the length will be the same after. 
                pFunction();

                // Clear update chain list if no other update in this cycle was triggered.
                if (lLastLength === this.mCurrentUpdateChain.length) {
                    this.mCurrentUpdateChain.clear();
                } else if (this.mCurrentUpdateChain.length > this.mMaxStackSize) {
                    // Throw if too many updates were chained. 
                    throw new LoopError('Update loop detected', this.mCurrentUpdateChain);
                }
            };

            // Update on next frame. 
            // Do not call change detection on requestAnimationFrame.
            this.mNextUpdateCycle = ChangeDetection.currentNoneSilent.silentExecution(window.requestAnimationFrame, () => {
                try {
                    // Call function. User can decide on none silent zone inside function.
                    lUpdateFunction();
                } catch (pException) {
                    // Cancel update next update cycle.
                    window.cancelAnimationFrame(this.mNextUpdateCycle);

                    throw pException;
                }
            });
        }
    }
}

export class LoopError {
    public readonly chain: Array<ChangeDetectionReason>;
    public readonly message: string;

    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current update chain.
     */
    public constructor(pMessage: string, pChain: Array<ChangeDetectionReason>) {
        this.message = pMessage;
        this.chain = pChain;
    }
}