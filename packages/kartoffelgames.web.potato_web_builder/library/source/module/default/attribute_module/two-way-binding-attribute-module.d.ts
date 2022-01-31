import { IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate } from '../../../interface/static-attribute-module';
import { XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentValues } from '../../../component/component-values';
import { ComponentManager } from '../../../component/component-manager';
export declare class TwoWayBindingAttributeModule implements IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate {
    private readonly mAttribute;
    private readonly mComponentHandler;
    private readonly mTargetElement;
    private mTargetViewCompareHandler;
    private mTargetViewProperty;
    private mThisCompareHandler;
    private mThisValueExpression;
    private readonly mValueHandler;
    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetElement: Element, pValueHandler: ComponentValues, pAttribute: XmlAttribute, pComponentHandler: ComponentManager);
    /**
     * Process module.
     * Initialize watcher and set view value with user class object value on startup.
     */
    onProcess(): void;
    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    onUpdate(): boolean;
}
//# sourceMappingURL=two-way-binding-attribute-module.d.ts.map