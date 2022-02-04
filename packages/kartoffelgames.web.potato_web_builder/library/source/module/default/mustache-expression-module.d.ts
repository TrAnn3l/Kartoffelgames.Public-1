import { LayerValues } from '../../component/values/layer-values';
import { IPwbExpressionOnProcess } from '../../interface/module/expression-module';
/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
export declare class MustacheExpressionModule implements IPwbExpressionOnProcess {
    private readonly mValueHandler;
    /**
     * Constructor.
     * @param pValueHandler - Values of component.
     */
    constructor(pValueHandler: LayerValues);
    /**
     * Execute expression with ComponentScopeExecutor.
     * @param pExpression - Expression.
     * @param pValues - Component values.
     * @returns expression result.
     */
    processExpression(pExpression: string): string;
}
//# sourceMappingURL=mustache-expression-module.d.ts.map