import { XmlAttribute } from '@kartoffelgames/core.xml';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { ComponentValues } from '../../../component_manager/component-values';
import { StaticAttributeModule } from '../../../decorator/static-attribute-module';
import { AttributeModuleAccessType } from '../../../enum/attribute-module-access-type';
import { IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate } from '../../../interface/static-attribute-module';
import { HtmlContent } from '../../../types';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
@StaticAttributeModule({
    accessType: AttributeModuleAccessType.Read,
    attributeSelector: /^\[[\w$]+\]$/,
    forbiddenInManipulatorScopes: false,
    manipulatesAttributes: false
})
export class OneWayBindingAttributeModule implements IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate {
    private readonly mAttribute: XmlAttribute;
    private mExecutionString: string;
    private readonly mTargetElement: HtmlContent;
    private mTargetProperty: string;
    private mValueCompare: CompareHandler<any>;
    private readonly mValueHandler: ComponentValues;

    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetElement: Element, pValueHandler: ComponentValues, pAttribute: XmlAttribute) {
        this.mTargetElement = pTargetElement;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
    }

    /**
     * Process module.
     * Initialize watcher and set view value with user class object value on startup.
     */
    public onProcess(): void {
        // Get execution string.
        this.mExecutionString = this.mAttribute.value;

        // Get view object information. Remove starting [ and end ].
        this.mTargetProperty = this.mAttribute.qualifiedName.substr(1, this.mAttribute.qualifiedName.length - 2);

        // Get result of string execution and save as comparison object.
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);
        this.mValueCompare = new CompareHandler(lExecutionResult, 4);

        // Set view object property.
        this.setValueToTarget(lExecutionResult);
    }

    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    public onUpdate(): boolean {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);
        if (!this.mValueCompare.compare(lExecutionResult)) {
            // Set view object property.
            this.setValueToTarget(lExecutionResult);

            return true;
        }

        return false;
    }

    /**
     * Set value to target element.
     * @param pValue - Value.
     */
    private setValueToTarget(pValue: any) {
        (<any>this.mTargetElement)[this.mTargetProperty] = pValue;
    }
}