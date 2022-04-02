import { List } from '@kartoffelgames/core.data';
import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';

export class LoopDetectionHandler {
    private readonly mCurrentCallChain: List<ChangeDetectionReason>;
    private mInActiveChain: boolean;
    private readonly mMaxStackSize: number;
    private mNextSheduledCall: number;
    private mOnError: ErrorHandler;

    /**
     * Get if loop detection has an active chain.
     * Active chain breaks when the asynchron function is called.
     * The chain restores, when a new asyncron function is sheduled.
     */
    public get activeChain(): boolean {
        return this.mInActiveChain;
    }

    /**
     * Set callback for asynchron errors.
     */
    public set onError(pErrorHandler: ErrorHandler){
        this.mOnError = pErrorHandler;
    }

    /**
     * Constructor.
     */
    public constructor(pMaxStackSize: number) {
        this.mCurrentCallChain = new List<ChangeDetectionReason>();
        this.mMaxStackSize = pMaxStackSize;
    }

    /**
     * Calls function asynchron. Checks for loops and
     * Throws error if stack overflows.
     * @param pReason - Stack reason.
     */
    public callAsynchron<T>(pFunction: () => T, pReason: ChangeDetectionReason): void {
        if (!this.mInActiveChain) {
            this.mInActiveChain = true;

            // Create and expand call stack.
            this.mCurrentCallChain.push(pReason);

            const lAsynchronFunction = () => {
                // Set component to not updating so new changes doesn't get ignnored.
                this.mInActiveChain = false;
                const lLastLength: number = this.mCurrentCallChain.length;

                // Call function after saving last chain length.
                // If no other call was sheduled during this call, the length will be the same after. 
                pFunction();

                // Clear call chain list if no other call in this cycle was made.
                if (lLastLength === this.mCurrentCallChain.length) {
                    this.mCurrentCallChain.clear();
                } else if (this.mCurrentCallChain.length > this.mMaxStackSize) {
                    // Throw if too many calles were chained. 
                    throw new LoopError('Call loop detected', this.mCurrentCallChain);
                }
            };

            // Function for asynchron call.
            const lErrorHandlingFunction = () => {
                try {
                    // Call function. User can decide on none silent zone inside function.
                    lAsynchronFunction();
                } catch (pException) {
                    // Cancel next call cycle.
                    window.cancelAnimationFrame(this.mNextSheduledCall);

                    // Execute on error.
                    this.mOnError?.(pException);
                }
            };

            // Call on next frame. 
            // Do not call change detection on requestAnimationFrame.
            // When no Change detection is available, ignore any scope.
            const lChangeDetection: ChangeDetection = ChangeDetection.currentNoneSilent;
            if (lChangeDetection) {
                this.mNextSheduledCall = ChangeDetection.currentNoneSilent.silentExecution(window.requestAnimationFrame, lErrorHandlingFunction);
            } else {
                this.mNextSheduledCall = window.requestAnimationFrame(lErrorHandlingFunction);
            }
        }
    }
}

type ErrorHandler = (pError: any) => void;

export class LoopError {
    public readonly chain: Array<ChangeDetectionReason>;
    public readonly message: string;

    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current call chain.
     */
    public constructor(pMessage: string, pChain: Array<ChangeDetectionReason>) {
        this.message = pMessage;
        this.chain = pChain;
    }
}