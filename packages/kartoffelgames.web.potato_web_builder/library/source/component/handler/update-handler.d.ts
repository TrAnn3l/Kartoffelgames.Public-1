import { UpdateScope } from '../../enum/update-scope';
export declare class UpdateHandler {
    private mChangeDetection;
    private mUpdateScope;
    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    constructor(pUpdateScope: UpdateScope);
    /**
     * Execute function inside update detection scope.
     * @param pFunction - Function.
     */
    execute(pFunction: () => void): void;
}
//# sourceMappingURL=update-handler.d.ts.map