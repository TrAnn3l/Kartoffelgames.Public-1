import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentValues } from '../../../component_manager/component-values';
import { IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate } from '../../../interface/manipulator-attribute-module';
import { ModuleManipulatorResult } from '../../base/module-manipulator-result';
/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
export declare class IfManipulatorAttributeModule implements IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate {
    private readonly mAttribute;
    private mBooleanExpression;
    private readonly mTargetTemplate;
    private mValueCompare;
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
     * Execute attribute value and decide if template should be rendered.
     */
    onProcess(): ModuleManipulatorResult;
    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    onUpdate(): boolean;
}
//# sourceMappingURL=if-manipulator-attribute-module.d.ts.map