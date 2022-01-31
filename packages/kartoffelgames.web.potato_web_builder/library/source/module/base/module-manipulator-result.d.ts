import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { ComponentValues } from '../../component/component-values';
/**
 * Results for html manipulator attribute module.
 */
export declare class ModuleManipulatorResult {
    private readonly mElementList;
    /**
     * Get list of created elements.
     */
    get elementList(): Array<ManipulatorElement>;
    /**
     * Constructor.
     * Initialize new html manipulator attribute module result.
     */
    constructor();
    /**
     * Add new element to result.
     * @param pTemplateElement - New template element. Can't use same template for multiple elements.
     * @param pValues - New Value handler of element with current value handler as parent.
     */
    addElement(pTemplateElement: BaseXmlNode, pValues: ComponentValues): void;
}
/**
 * Result element of manipulator module.
 */
export declare type ManipulatorElement = {
    template: BaseXmlNode;
    componentValues: ComponentValues;
};
//# sourceMappingURL=module-manipulator-result.d.ts.map