import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { ComponentValues } from '../../../component_manager/component-values';
import { ManipulatorAttributeModule } from '../../../decorator/manipulator-attribute-module';
import { AttributeModuleAccessType } from '../../../enum/attribute-module-access-type';
import { IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate } from '../../../interface/manipulator-attribute-module';
import { ModuleManipulatorResult } from '../../base/module-manipulator-result';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
@ManipulatorAttributeModule({
    accessType: AttributeModuleAccessType.Write,
    attributeSelector: /^\*pwbIf$/,
    forbiddenInManipulatorScopes: false,
    manipulatesAttributes: false
})
export class IfManipulatorAttributeModule implements IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate {
    private readonly mAttribute: XmlAttribute;
    private mBooleanExpression: string;
    private readonly mTargetTemplate: XmlElement;
    private mValueCompare: CompareHandler<any>;
    private readonly mValueHandler: ComponentValues;

    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetTemplate: XmlElement, pValueHandler: ComponentValues, pAttribute: XmlAttribute) {
        this.mTargetTemplate = pTargetTemplate;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
    }

    /**
     * Process module.
     * Execute attribute value and decide if template should be rendered.
     */
    public onProcess(): ModuleManipulatorResult {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mAttribute.value, this.mValueHandler);

        // Add compare handler with depth 0. No need to check for inner values on boolean compare.
        this.mValueCompare = new CompareHandler(lExecutionResult, 0);
        this.mBooleanExpression = this.mAttribute.value;

        // If in any way the execution result is true, add template to result.
        const lModuleResult: ModuleManipulatorResult = new ModuleManipulatorResult();
        if (lExecutionResult) {
            lModuleResult.addElement(this.mTargetTemplate.clone(), new ComponentValues(this.mValueHandler));
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