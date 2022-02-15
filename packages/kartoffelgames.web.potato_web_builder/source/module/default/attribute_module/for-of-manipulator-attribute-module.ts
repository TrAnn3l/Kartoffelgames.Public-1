import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { XmlElement } from '@kartoffelgames/core.xml';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../../component/values/layer-values';
import { MultiplicatorAttributeModule } from '../../../decorator/module/multiplicator-attribute-module';
import { IPwbMultiplicatorModuleOnUpdate } from '../../../interface/module';
import { AttributeReference } from '../../base/injection/attribute-reference';
import { TemplateReference } from '../../base/injection/template-reference';
import { MultiplicatorResult } from '../../base/result/multiplicator-result';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] of [List] (;[CustomIndexName] = index)?"
 */
@MultiplicatorAttributeModule({
    selector: /^\*pwbFor$/
})
export class ForOfManipulatorAttributeModule implements IPwbMultiplicatorModuleOnUpdate {
    private readonly mAttributeReference: AttributeReference;
    private readonly mTemplateReference: TemplateReference;
    private readonly mValueHandler: LayerValues;
    private readonly mCompareHandler: CompareHandler<any>;

    /**
     * Constructor.
     * @param pTemplateReference - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTemplateReference: TemplateReference, pValueHandler: LayerValues, pAttributeReference: AttributeReference) {
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueHandler;
        this.mAttributeReference = pAttributeReference;
        this.mCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
    }

    /**
     * Process module.
     * Execute attribute value and decide if template should be rendered.
     */
    public onUpdate(): MultiplicatorResult {
        // [CustomName:1] of [List value:2] (;[CustomIndexName:4]=[Index calculating with "index" as key:5])?
        const lRegexAttributeInformation: RegExp = new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/);

        // If attribute value does match regex.
        const lAttributeInformation: RegExpExecArray = lRegexAttributeInformation.exec(this.mAttributeReference.value.value);
        if (lAttributeInformation) {

            // Split match into useable parts.
            const lExpression: ForOfExpression = {
                variable: lAttributeInformation[1],
                value: lAttributeInformation[2],
                indexName: lAttributeInformation[4],
                indexExpression: lAttributeInformation[5]
            };

            // Create module result that watches for changes in [PropertyName].
            const lModuleResult: MultiplicatorResult = new MultiplicatorResult();

            // Try to get list object from component values.
            const lListObject: { [key: string]: any; } = ComponentScopeExecutor.executeSilent(lExpression.value, this.mValueHandler);

            // Skip if values are the same.
            if (this.mCompareHandler.compareAndUpdate(lListObject)) {
                return null;
            }

            // Only proceed if value is added to html element.
            if (typeof lListObject === 'object' && lListObject !== null || Array.isArray(lListObject)) {
                // For array loop for arrays and for-in for objects.
                if (Array.isArray(lListObject)) {
                    for (let lIndex: number = 0; lIndex < lListObject.length; lIndex++) {
                        this.addTempateForElement(lModuleResult, lExpression, lListObject[lIndex], lIndex);
                    }
                } else {
                    for (const lListObjectKey in lListObject) {
                        this.addTempateForElement(lModuleResult, lExpression, lListObject[lListObjectKey], lListObjectKey);
                    }
                }

                return lModuleResult;
            } else {
                // Just ignore. Can be changed later.
                return null;
            }
        } else {
            throw new Exception(`pwbFor-Paramater value has wrong format: ${this.mAttributeReference.value.toString()}`, this);
        }
    }

    /**
     * Add template for element function.
     * @param pModuleResult - module result.
     * @param pExpression - for of expression.
     * @param pObjectValue - value.
     * @param pObjectKey - value key.
     */
    private addTempateForElement = (pModuleResult: MultiplicatorResult, pExpression: ForOfExpression, pObjectValue: any, pObjectKey: number | string) => {
        const lClonedTemplate: XmlElement = <XmlElement>this.mTemplateReference.value.clone();
        const lComponentValues: LayerValues = new LayerValues(this.mValueHandler);
        lComponentValues.setLayerValue(pExpression.variable, pObjectValue);

        // If custom index is used.
        if (pExpression.indexName) {
            // Add index key as extenal value to execution.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$index', pObjectKey);

            // Execute index expression
            const lIndexExpressionResult: any = ComponentScopeExecutor.executeSilent(pExpression.indexExpression, lComponentValues, lExternalValues);

            // Set custom index name as temporary value.
            lComponentValues.setLayerValue(pExpression.indexName, lIndexExpressionResult);
        }

        // Add element.
        pModuleResult.addElement(lClonedTemplate, lComponentValues);
    };
}

type ForOfExpression = {
    variable: string,
    value: string,
    indexName?: string,
    indexExpression?: string;
};