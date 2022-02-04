import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../../../component/component-manager';
import { LayerValues } from '../../../component/values/layer-values';
import { IPwbManipulatorAttributeOnProcess } from '../../../interface/module/manipulator-attribute-module';
import { ModuleManipulatorResult } from '../../base/module-manipulator-result';
export declare class SlotAttributeModule implements IPwbManipulatorAttributeOnProcess {
    private readonly mAttribute;
    private readonly mComponentManager;
    private readonly mTargetTemplate;
    private readonly mValueHandler;
    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pComponentManager: ComponentManager, pTargetTemplate: XmlElement, pValueHandler: LayerValues, pAttribute: XmlAttribute);
    /**
     * Process module.
     */
    onProcess(): ModuleManipulatorResult;
}
//# sourceMappingURL=slot-attribute-module.d.ts.map