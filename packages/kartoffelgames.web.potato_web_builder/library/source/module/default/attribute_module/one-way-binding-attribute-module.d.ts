import { XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentValues } from '../../../component_manager/component-values';
import { IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate } from '../../../interface/static-attribute-module';
/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
export declare class OneWayBindingAttributeModule implements IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate {
    private readonly mAttribute;
    private mExecutionString;
    private readonly mTargetElement;
    private mTargetProperty;
    private mValueCompare;
    private readonly mValueHandler;
    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetElement: Element, pValueHandler: ComponentValues, pAttribute: XmlAttribute);
    /**
     * Process module.
     * Initialize watcher and set view value with user class object value on startup.
     */
    onProcess(): void;
    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    onUpdate(): boolean;
    /**
     * Set value to target element.
     * @param pValue - Value.
     */
    private setValueToTarget;
}
//# sourceMappingURL=one-way-binding-attribute-module.d.ts.map