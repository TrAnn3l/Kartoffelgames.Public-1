import { TextNode, XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { IPwbExpressionModuleClass, IPwbExpressionModuleObject, ModuleDefinition } from './interface/module';
import { BaseModule } from './base-module';

export class ExpressionModule extends BaseModule<boolean, string> {
    private mLastResult: string | null;
    private readonly mProcessList: Array<string | IPwbExpressionModuleObject>;
    private mValueWasSet: boolean = false;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: ExpressionModuleConstructorParameterAttribute | ExpressionModuleConstructorParameterTextNode) {
        super({
            ...pParameter,
            targetAttribute: ('targetAttribute' in pParameter) ? pParameter.targetAttribute : null
        });
        this.mProcessList = new Array<string | IPwbExpressionModuleObject>();
        this.mLastResult = null;
        this.mValueWasSet = false;

        // Get value from attribute or use target textnode.
        let lTargetValue: string;
        if ('targetAttribute' in pParameter) {
            lTargetValue = pParameter.targetAttribute.value;
        } else {
            lTargetValue = pParameter.targetTemplate.text;
        }

        // Create module object for every expression inside value.
        const lModuleList: Array<IPwbExpressionModuleObject> = new Array<IPwbExpressionModuleObject>();
        for (const lExpressionMatch of lTargetValue.matchAll(new RegExp(pParameter.moduleDefinition.selector, 'g'))) {
            lModuleList.push(this.createModuleObject(lExpressionMatch[0]));
        }

        // Split list by every expression.
        const lEmptyValueList = lTargetValue.split(new RegExp(pParameter.moduleDefinition.selector, 'g'));

        // Zip empty expressions with module object list.
        let lModuleIndex: number = 0;
        for (const lEmptyValue of lEmptyValueList) {
            this.mProcessList.push(lEmptyValue);

            if (lModuleIndex < lModuleList.length) {
                this.mProcessList.push(lModuleList[lModuleIndex]);
            }
            lModuleIndex++;
        }
    }

    /**
     * Update expressions.
     */
    public update(): boolean {
        // Reduce process list to single string.
        const lNewValue: string = this.mProcessList.reduce<string>((pReducedValue: string, pNextValue: string | IPwbExpressionModuleObject) => {
            let lProcessedValue: string;
            if (typeof pNextValue === 'string') {
                lProcessedValue = pNextValue;
            } else {
                lProcessedValue = pNextValue.onUpdate();
            }

            return pReducedValue + lProcessedValue;
        }, '');

        // Update value if new value was processed.
        if (!this.mValueWasSet || this.mLastResult !== lNewValue) {
            this.mValueWasSet = true;

            // Node for expressions is allways set.
            const lNode: Node = <Node>this.node;

            // Add result text to TextNode or as attribute.
            if (lNode instanceof Element) {
                const lAttribute: XmlAttribute = <XmlAttribute>this.attribute;
                lNode.setAttribute(lAttribute.qualifiedName, lNewValue);
            } else { // Text
                lNode.nodeValue = lNewValue;
            }

            // Save last value.
            this.mLastResult = lNewValue;

            return true;
        } else {
            return false;
        }
    }
}

export type ExpressionModuleConstructorParameterTextNode = {
    moduleDefinition: ModuleDefinition,
    moduleClass: IPwbExpressionModuleClass,
    targetTemplate: TextNode,
    values: LayerValues,
    componentManager: ComponentManager,
    targetNode: Text;
};

export type ExpressionModuleConstructorParameterAttribute = {
    moduleDefinition: ModuleDefinition,
    moduleClass: IPwbExpressionModuleClass,
    targetTemplate: XmlElement,
    targetAttribute: XmlAttribute,
    values: LayerValues,
    componentManager: ComponentManager,
    targetNode: Element;
};