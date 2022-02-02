import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../../../component/component-manager';
import { ComponentValues } from '../../../component/component-values';
import { ManipulatorAttributeModule } from '../../../decorator/manipulator-attribute-module';
import { AttributeModuleAccessType } from '../../../enum/attribute-module-access-type';
import { IPwbManipulatorAttributeOnProcess } from '../../../interface/manipulator-attribute-module';
import { ModuleManipulatorResult } from '../../base/module-manipulator-result';

@ManipulatorAttributeModule({
    accessType: AttributeModuleAccessType.Write,
    attributeSelector: /^\$[\w]+$/,
    forbiddenInManipulatorScopes: true,
    manipulatesAttributes: false
})
export class SlotAttributeModule implements IPwbManipulatorAttributeOnProcess {
    private readonly mAttribute: XmlAttribute;
    private readonly mComponentManager: ComponentManager;
    private readonly mTargetTemplate: XmlElement;
    private readonly mValueHandler: ComponentValues;

    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pComponentManager: ComponentManager, pTargetTemplate: XmlElement, pValueHandler: ComponentValues, pAttribute: XmlAttribute) {
        this.mTargetTemplate = pTargetTemplate;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
        this.mComponentManager = pComponentManager;
    }

    /**
     * Process module.
     */
    public onProcess(): ModuleManipulatorResult {
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
        const lResult: ModuleManipulatorResult = new ModuleManipulatorResult();
        lResult.addElement(lClone, new ComponentValues(this.mValueHandler));

        return lResult;
    }
}