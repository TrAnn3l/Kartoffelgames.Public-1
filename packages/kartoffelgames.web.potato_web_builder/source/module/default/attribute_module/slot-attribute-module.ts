import { XmlElement } from '@kartoffelgames/core.xml';
import { LayerValues } from '../../../component/values/layer-values';
import { MultiplicatorAttributeModule } from '../../base/decorator/multiplicator-attribute-module';
import { IPwbMultiplicatorModuleOnUpdate } from '../../base/interface/module';
import { ModuleAttributeReference } from '../../../injection/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../../injection/module-layer-values-reference';
import { ModuleTemplateReference } from '../../../injection/module-template-reference';
import { MultiplicatorResult } from '../../base/result/multiplicator-result';

@MultiplicatorAttributeModule({
    selector: /^\$[\w]+$/
})
export class SlotAttributeModule implements IPwbMultiplicatorModuleOnUpdate {
    private readonly mAttributeReference: ModuleAttributeReference;
    private mCalled: boolean;
    private readonly mTemplateReference: ModuleTemplateReference;
    private readonly mValueHandler: LayerValues;
    
    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference, pTemplateReference: ModuleTemplateReference) {
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