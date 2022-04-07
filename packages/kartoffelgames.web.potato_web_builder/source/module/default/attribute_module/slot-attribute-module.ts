import { XmlElement } from '@kartoffelgames/core.xml';
import { LayerValues } from '../../../component/values/layer-values';
import { MultiplicatorAttributeModule } from '../../base/decorator/multiplicator-attribute-module';
import { IPwbMultiplicatorModuleOnUpdate } from '../../base/interface/module';
import { AttributeReference } from '../../base/injection/attribute-reference';
import { LayerValuesReference } from '../../base/injection/layer-values-reference';
import { TemplateReference } from '../../base/injection/template-reference';
import { MultiplicatorResult } from '../../base/result/multiplicator-result';

@MultiplicatorAttributeModule({
    selector: /^\$[\w]+$/
})
export class SlotAttributeModule implements IPwbMultiplicatorModuleOnUpdate {
    private readonly mAttributeReference: AttributeReference;
    private mCalled: boolean;
    private readonly mTemplateReference: TemplateReference;
    private readonly mValueHandler: LayerValues;
    
    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pValueReference: LayerValuesReference, pAttributeReference: AttributeReference, pTemplateReference: TemplateReference) {
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueReference.value;
        this.mAttributeReference = pAttributeReference;
    }

    /**
     * Process module.
     */
    public onUpdate(): MultiplicatorResult {
        // Skip update if slot is already set.
        if(!this.mCalled){
            this.mCalled = true;
            return null;
        }

        // Get name of slot. Remove starting $.
        const lSlotName: string = this.mAttributeReference.value.name.substr(1);

        // Clone currrent template element.
        const lClone: XmlElement = <XmlElement>this.mTemplateReference.value.clone();

        // Create slot element
        const lSlotElement: XmlElement = new XmlElement();
        lSlotElement.tagName = 'slot';

        // Set slot as default of name is $DEFAUKLT
        if (lSlotName !== 'DEFAULT') {
            lSlotElement.setAttribute('name', lSlotName);
        }

        // Add slot to element.
        lClone.appendChild(lSlotElement);

        // Create result.
        const lResult: MultiplicatorResult = new MultiplicatorResult();
        lResult.addElement(lClone, new LayerValues(this.mValueHandler));

        return lResult;
    }
}