import { ComponentValues } from '../../component_manager/component-values';
import { IPwbExpressionOnProcess } from '../../interface/expression-module';
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
    constructor(pValueHandler: ComponentValues);
    /**
     * Execute expression with ComponentScopeExecutor.
     * @param pExpression - Expression.
     * @param pValues - Component values.
     * @returns expression result.
     */
    processExpression(pExpression: string): string;
}
//# sourceMappingURL=mustache-expression-module.d.ts.map