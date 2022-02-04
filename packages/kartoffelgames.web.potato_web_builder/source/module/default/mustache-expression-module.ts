import { ComponentScopeExecutor } from '../execution/component-scope-executor';
import { LayerValues } from '../../component/values/layer-values';
import { ExpressionModule } from '../../decorator/expression-module';
import { IPwbExpressionOnProcess } from '../../interface/module/expression-module';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@ExpressionModule({
    expressionSelector: /{{.*?}}/
})
export class MustacheExpressionModule implements IPwbExpressionOnProcess {
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pValueHandler - Values of component.
     */
    public constructor(pValueHandler: LayerValues) {
        this.mValueHandler = pValueHandler;
    }

    /**
     * Execute expression with ComponentScopeExecutor.
     * @param pExpression - Expression.
     * @param pValues - Component values.
     * @returns expression result.
     */
    public processExpression(pExpression: string): string {
        // Cut out mustache.
        const lExpressionText: string = pExpression.substr(2, pExpression.length - 4);

        // Execute string
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(lExpressionText, this.mValueHandler);

        return lExecutionResult?.toString();
    }
}