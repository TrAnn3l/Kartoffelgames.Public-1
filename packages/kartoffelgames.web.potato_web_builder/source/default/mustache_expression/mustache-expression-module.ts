import { LayerValues } from '../../component/values/layer-values';
import { PwbExpressionModule } from '../../module/decorator/pwb-expression-module.decorator';
import { IPwbExpressionModuleOnUpdate } from '../../module/interface/module';
import { ModuleExpressionReference } from '../../injection_reference/module-expression-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module-layer-values-reference';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
@PwbExpressionModule({
    selector: /{{.*?}}/
})
export class MustacheExpressionModule implements IPwbExpressionModuleOnUpdate {
    private readonly mExpressionReference: ModuleExpressionReference;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pValueReference - Values of component.
     */
    public constructor(pValueReference: ModuleLayerValuesReference, pExpressionReference: ModuleExpressionReference) {
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