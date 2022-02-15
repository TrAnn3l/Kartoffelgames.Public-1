import { ComponentScopeExecutor } from '../execution/component-scope-executor';
import { LayerValues } from '../../component/values/layer-values';
import { ExpressionModule } from '../../decorator/module/expression-module';
import { IPwbExpressionModuleOnUpdate } from '../../interface/module';
import { ValueReference } from '../base/injection/value-reference';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@ExpressionModule({
    selector: /{{.*?}}/
})
export class MustacheExpressionModule implements IPwbExpressionModuleOnUpdate {
    private readonly mValueHandler: LayerValues;
    private readonly mExpressionReference: ValueReference;

    /**
     * Constructor.
     * @param pValueHandler - Values of component.
     */
    public constructor(pValueHandler: LayerValues, pExpressionReference: ValueReference) {
        this.mValueHandler = pValueHandler;
        this.mExpressionReference = pExpressionReference;
    }

    /**
     * Execute expression with ComponentScopeExecutor.
     * @param pExpression - Expression.
     * @param pValues - Component values.
     * @returns expression result.
     */
    public onUpdate(): string {
        // Cut out mustache.
        const lExpression = this.mExpressionReference.value;
        const lExpressionText: string = lExpression.substr(2, lExpression.length - 4);

        // Execute string
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(lExpressionText, this.mValueHandler);

        return lExecutionResult?.toString();
    }
}