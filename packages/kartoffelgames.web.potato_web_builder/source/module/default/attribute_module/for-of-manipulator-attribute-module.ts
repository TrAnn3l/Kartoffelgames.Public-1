import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { ComponentValues } from '../../../component_manager/component-values';
import { ModuleManipulatorResult } from '../../base/module-manipulator-result';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';
import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ManipulatorAttributeModule } from '../../../decorator/manipulator-attribute-module';
import { IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate } from '../../../interface/manipulator-attribute-module';
import { AttributeModuleAccessType } from '../../../enum/attribute-module-access-type';

/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] in [List] (;[CustomIndexName] = index)?"
 */
@ManipulatorAttributeModule({
    accessType: AttributeModuleAccessType.Write,
    attributeSelector: /^\*pwbFor$/,
    forbiddenInManipulatorScopes: false,
    manipulatesAttributes: false
})
export class ForOfManipulatorAttributeModule implements IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate {
    private readonly mAttribute: XmlAttribute;
    private mListExpression: string;
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
        // [CustomName:1] in [List value:2] (;[CustomIndexName:4]=[Index calculating with "index" as key:5])?
        const lRegexAttributeInformation: RegExp = new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/);

        // Get information from attribute value.
        const lAttributeInformation: RegExpExecArray = lRegexAttributeInformation.exec(this.mAttribute.value);

        // If attribute value does not match regex.
        if (lAttributeInformation) {
            // Create module result that watches for changes in [PropertyName].
            const lModuleResult: ModuleManipulatorResult = new ModuleManipulatorResult();

            // Try to get list object from component values.
            const lListObject: { [key: string]: any; } = ComponentScopeExecutor.executeSilent(lAttributeInformation[2], this.mValueHandler);

            // Save values for later update check.
            this.mValueCompare = new CompareHandler(lListObject, 4);
            this.mListExpression = lAttributeInformation[2];

            // Only proceed if value is added to html element.
            if (typeof lListObject === 'object' && lListObject !== null || Array.isArray(lListObject)) {
                // Add template for element function.
                const lAddTempateForElement = (pObjectValue: any, pObjectKey: number | string) => {
                    const lClonedTemplate: XmlElement = <XmlElement>this.mTargetTemplate.clone();
                    const lComponentValues: ComponentValues = new ComponentValues(this.mValueHandler);
                    lComponentValues.setTemporaryValue(lAttributeInformation[1], pObjectValue);

                    // If custom index is used.
                    if (lAttributeInformation[4]) {
                        // Add index key as extenal value to execution.
                        const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
                        lExternalValues.add('$index', pObjectKey);

                        // Execute index expression
                        const lIndexExpressionResult: any = ComponentScopeExecutor.executeSilent(lAttributeInformation[5], lComponentValues, lExternalValues);

                        // Set custom index name as temporary value.
                        lComponentValues.setTemporaryValue(lAttributeInformation[4], lIndexExpressionResult);
                    }

                    // Add element.
                    lModuleResult.addElement(lClonedTemplate, lComponentValues);

                };

                // For array loop for arrays and for-in for objects.
                if (Array.isArray(lListObject)) {
                    for (let lIndex: number = 0; lIndex < lListObject.length; lIndex++) {
                        lAddTempateForElement(lListObject[lIndex], lIndex);
                    }
                } else {
                    for (const lListObjectKey in lListObject) {
                        lAddTempateForElement(lListObject[lListObjectKey], lListObjectKey);
                    }
                }
            }
            // Else: Just ignore. Can be changed later.

            // Return module result.
            return lModuleResult;
        } else {
            throw new Exception(`pwbFor-Paramater value has wrong format: ${this.mAttribute.value.toString()}`, this);
        }
    }

    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    public onUpdate(): boolean {
        const lListObject: { [key: string]: any; } = ComponentScopeExecutor.executeSilent(this.mListExpression, this.mValueHandler);
        // Update if values are not same.
        return !this.mValueCompare.compare(lListObject);
    }
}