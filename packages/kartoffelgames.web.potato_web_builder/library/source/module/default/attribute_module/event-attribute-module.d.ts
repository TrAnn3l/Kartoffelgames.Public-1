import { XmlAttribute } from '@kartoffelgames/core.xml';
import { LayerValues } from '../../../component/values/layer-values';
import { IPwbStaticAttributeOnCleanup, IPwbStaticAttributeOnProcess } from '../../../interface/module/static-attribute-module';
export declare class EventAttributeModule implements IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnCleanup {
    private readonly mAttribute;
    private mEmitter;
    private mEventName;
    private mListener;
    private readonly mTargetElement;
    private readonly mValueHandler;
    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetElement: Element, pValueHandler: LayerValues, pAttribute: XmlAttribute);
    /**
     * Cleanup event on deconstruction.
     */
    onCleanup(): void;
    /**
     * Process module.
     * Execute string on elements event.
     */
    onProcess(): void;
}
//# sourceMappingURL=event-attribute-module.d.ts.map