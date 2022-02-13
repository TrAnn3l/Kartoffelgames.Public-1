import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../../component/values/layer-values';
import { ManipulatorAttributeModule } from '../../../decorator/module/manipulator-attribute-module';
import { ModuleAccessType } from '../../../enum/module-access-type';
import { IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate } from '../../../interface/module/manipulator-attribute-module';
import { MultiplicatorResult } from '../../base/result/multiplicator-result';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@ManipulatorAttributeModule({
    accessType: ModuleAccessType.Write,
    attributeSelector: /^\*pwbIf$/,
    forbiddenInManipulatorScopes: false,
    manipulatesAttributes: false
})
export class IfManipulatorAttributeModule implements IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate {
    private readonly mAttribute: XmlAttribute;
    private mBooleanExpression: string;
    private readonly mTargetTemplate: XmlElement;
    private mValueCompare: CompareHandler<any>;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetTemplate: XmlElement, pValueHandler: LayerValues, pAttribute: XmlAttribute) {
        this.mTargetTemplate = pTargetTemplate;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
    }

    /**
     * Process module.
     * Execute attribute value and decide if template should be rendered.
     */
    public onProcess(): MultiplicatorResult {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mAttribute.value, this.mValueHandler);

        // Add compare handler with depth 0. No need to check for inner values on boolean compare.
        this.mValueCompare = new CompareHandler(lExecutionResult, 0);
        this.mBooleanExpression = this.mAttribute.value;

        // If in any way the execution result is true, add template to result.
        const lModuleResult: MultiplicatorResult = new MultiplicatorResult();
        if (lExecutionResult) {
            lModuleResult.addElement(this.mTargetTemplate.clone(), new LayerValues(this.mValueHandler));
        }

        return lModuleResult;
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): boolean {
        const lListObject: { [key: string]: any; } = ComponentScopeExecutor.executeSilent(this.mBooleanExpression, this.mValueHandler);
        // Update if values are not same.
        return !this.mValueCompare.compare(lListObject);
    }
}