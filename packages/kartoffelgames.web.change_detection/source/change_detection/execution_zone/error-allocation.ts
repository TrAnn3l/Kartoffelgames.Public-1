import { ExecutionZone } from './execution-zone';

/**
 * Allocates current error to its execution zone.
 */
export class ErrorAllocation {
    private static mError: any;
    private static mExecutionZone: ExecutionZone;

    /**
     * Allocate error with execution zone.
     * @param pError - Error data.
     * @param pExecutionZone - Zone of error.
     */
    public static allocateError(pError: any, pExecutionZone: ExecutionZone): void {
        ErrorAllocation.mExecutionZone = pExecutionZone;
        ErrorAllocation.mError = pError;
    }

    /**
     * Get execution zone of error.
     * @param pError - Error.
     */
    public static getExecutionZoneOfError(pError: any): ExecutionZone {
        if (pError === ErrorAllocation.mError) {
            return ErrorAllocation.mExecutionZone;
        }

        return null;
    }
}