import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../../../component/component-manager';
import { LayerValues } from '../../../component/values/layer-values';
import { ManipulatorAttributeModule } from '../../../decorator/module/manipulator-attribute-module';
import { ModuleAccessType } from '../../../enum/module-access-type';
import { IPwbManipulatorAttributeOnProcess } from '../../../interface/module/manipulator-attribute-module';
import { MultiplicatorResult } from '../../base/result/multiplicator-result';

@ManipulatorAttributeModule({
    accessType: ModuleAccessType.Write,
    attributeSelector: /^\$[\w]+$/,
    forbiddenInManipulatorScopes: true,
    manipulatesAttributes: false
})
export class SlotAttributeModule implements IPwbManipulatorAttributeOnProcess {
    private readonly mAttribute: XmlAttribute;
    private readonly mComponentManager: ComponentManager;
    private readonly mTargetTemplate: XmlElement;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pComponentManager: ComponentManager, pTargetTemplate: XmlElement, pValueHandler: LayerValues, pAttribute: XmlAttribute) {
        this.mTargetTemplate = pTargetTemplate;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
        this.mComponentManager = pComponentManager;
    }

    /**
     * Process module.
     */
    public onProcess(): MultiplicatorResult {
        // TODO: Anonymous slot. With "$--"" ???

        // Get name of slot. Remove starting $.
        const lSlotName: string = this.mAttribute.name.substr(1);

        // Add slot name to valid slot names.
        this.mComponentManager.elementHandler.addValidSlot(lSlotName);

        // Clone currrent template element.
        const lClone: XmlElement = <XmlElement>this.mTargetTemplate.clone();

        // Create slot element
        const lSlotElement: XmlElement = new XmlElement();
        lSlotElement.tagName = 'slot';
        lSlotElement.setAttribute('name', lSlotName);

        // Add slot to element.
        lClone.appendChild(lSlotElement);

        // Create result.
        const lResult: MultiplicatorResult = new MultiplicatorResult();
        lResult.addElement(lClone, new LayerValues(this.mValueHandler));

        return lResult;
    }
}