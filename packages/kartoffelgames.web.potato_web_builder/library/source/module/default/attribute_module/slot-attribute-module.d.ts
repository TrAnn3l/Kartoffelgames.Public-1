import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentValues } from '../../../component/component-values';
import { IPwbManipulatorAttributeOnProcess } from '../../../interface/manipulator-attribute-module';
import { ModuleManipulatorResult } from '../../base/module-manipulator-result';
export declare class SlotAttributeModule implements IPwbManipulatorAttributeOnProcess {
    private readonly mAttribute;
    private readonly mTargetTemplate;
    private readonly mValueHandler;
    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetTemplate: XmlElement, pValueHandler: ComponentValues, pAttribute: XmlAttribute);
    /**
     * Process module.
     */
    onProcess(): ModuleManipulatorResult;
}
//# sourceMappingURL=slot-attribute-module.d.ts.map