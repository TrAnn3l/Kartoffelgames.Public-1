import { LayerValues } from '../../component/values/layer-values';
import { ExpressionModule } from '../../decorator/module/expression-module';
import { IPwbExpressionModuleOnUpdate } from '../../interface/module';
import { ExpressionReference } from '../base/injection/expression-reference';
import { LayerValuesReference } from '../base/injection/layer-values-reference';
import { ComponentScopeExecutor } from '../execution/component-scope-executor';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@ExpressionModule({
    selector: /{{.*?}}/
})
export class MustacheExpressionModule implements IPwbExpressionModuleOnUpdate {
    private readonly mExpressionReference: ExpressionReference;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pValueReference - Values of component.
     */
    public constructor(pValueReference: LayerValuesReference, pExpressionReference: ExpressionReference) {
        this.mValueHandler = pValueReference.value;
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