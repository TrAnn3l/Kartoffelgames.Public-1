import { XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../../../component/component-manager';
import { LayerValues } from '../../../component/values/layer-values';
import { StaticAttributeModule } from '../../../decorator/static-attribute-module';
import { AttributeModuleAccessType } from '../../../enum/attribute-module-access-type';
import { IPwbStaticAttributeOnProcess } from '../../../interface/module/static-attribute-module';
import { HtmlContent } from '../../../types';

/**
 * Used with "#IdChildName" like => #PasswordInput.
 */
@StaticAttributeModule({
    accessType: AttributeModuleAccessType.Write,
    forbiddenInManipulatorScopes: true,
    manipulatesAttributes: false,
    attributeSelector: /^#[[\w$]+$/
})
export class IdChildAttributeModule implements IPwbStaticAttributeOnProcess {
    private readonly mAttribute: XmlAttribute;
    private readonly mComponentHandler: ComponentManager;
    private readonly mTargetElement: HtmlContent;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetElement: Element, pValueHandler: LayerValues, pAttribute: XmlAttribute, pComponentHandler: ComponentManager) {
        this.mTargetElement = pTargetElement;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
        this.mComponentHandler = pComponentHandler;
    }

    /**
     * Process module and add current html to id childs.
     */
    public onProcess(): void {
        const lRegistedElement: HtmlContent = this.mComponentHandler.updateHandler.registerObject(this.mTargetElement);

        // Add current html element to temporary root values. Delete starting #.
        this.mValueHandler.setRootValue(this.mAttribute.qualifiedName.substr(1), lRegistedElement);
    }
}