import { ComponentValues } from '../../../component_manager/component-values';
import { ModuleManipulatorResult } from '../../base/module-manipulator-result';
import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate } from '../../../interface/manipulator-attribute-module';
/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] in [List] (;[CustomIndexName] = index)?"
 */
export declare class ForOfManipulatorAttributeModule implements IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate {
    private readonly mAttribute;
    private mListExpression;
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
//# sourceMappingURL=for-of-manipulator-attribute-module.d.ts.map