import { LayerValues } from '../../component/values/layer-values';
import { MultiplicatorAttributeModule } from '../../module/decorator/multiplicator-attribute-module.decorator';
import { IPwbMultiplicatorModuleOnUpdate } from '../../module/interface/module';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module-layer-values-reference';
import { ModuleTemplateReference } from '../../injection_reference/module-template-reference';
import { MultiplicatorResult } from '../../module/result/multiplicator-result';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@MultiplicatorAttributeModule({
    selector: /^\*pwbIf$/
})
export class IfManipulatorAttributeModule implements IPwbMultiplicatorModuleOnUpdate {
    private readonly mAttributeReference: ModuleAttributeReference;
    private mLastBoolean: boolean;
    private readonly mTemplateReference: ModuleTemplateReference;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTemplateReference - Target templat.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplateReference: ModuleTemplateReference, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference) {
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueReference.value;
        this.mAttributeReference = pAttributeReference;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): MultiplicatorResult {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mAttributeReference.value.value, this.mValueHandler);

        if (!!lExecutionResult !== this.mLastBoolean) {
            this.mLastBoolean = !!lExecutionResult;

            // If in any way the execution result is true, add template to result.
            const lModuleResult: MultiplicatorResult = new MultiplicatorResult();
            if (lExecutionResult) {
                lModuleResult.addElement(this.mTemplateReference.value.clone(), new LayerValues(this.mValueHandler));
            }

            return lModuleResult;
        } else {
            // No update needed.
            return null;
        }
    }
}