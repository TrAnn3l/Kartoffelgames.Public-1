import { XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../../../component/component-manager';
import { ComponentValues } from '../../../component/component-values';
import { IPwbStaticAttributeOnProcess } from '../../../interface/static-attribute-module';
/**
 * Used with "#IdChildName" like => #PasswordInput.
 */
export declare class IdChildAttributeModule implements IPwbStaticAttributeOnProcess {
    private readonly mAttribute;
    private readonly mComponentHandler;
    private readonly mTargetElement;
    private readonly mValueHandler;
    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetElement: Element, pValueHandler: ComponentValues, pAttribute: XmlAttribute, pComponentHandler: ComponentManager);
    /**
     * Process module and add current html to id childs.
     */
    onProcess(): void;
}
//# sourceMappingURL=id-child-attribute-module.d.ts.map