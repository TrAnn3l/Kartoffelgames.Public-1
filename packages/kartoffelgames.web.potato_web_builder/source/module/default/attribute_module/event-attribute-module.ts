import { Dictionary } from '@kartoffelgames/core.data';
import { XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentValues } from '../../../component_manager/component-values';
import { StaticAttributeModule } from '../../../decorator/static-attribute-module';
import { AttributeModuleAccessType } from '../../../enum/attribute-module-access-type';
import { IPwbStaticAttributeOnCleanup, IPwbStaticAttributeOnProcess } from '../../../interface/static-attribute-module';
import { HtmlContent } from '../../../types';
import { ComponentEventEmitter } from '../../../user_class_manager/component-event-emitter';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

@StaticAttributeModule({
    accessType: AttributeModuleAccessType.Write,
    forbiddenInManipulatorScopes: false,
    manipulatesAttributes: false,
    attributeSelector: /^\([[\w$]+\)$/
})
export class EventAttributeModule implements IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnCleanup {
    private readonly mAttribute: XmlAttribute;
    private mEmitter: ComponentEventEmitter<any>;
    private mEventName: string;
    private mListener: (this: null, pEvent: any) => void;
    private readonly mTargetElement: HtmlContent;
    private readonly mValueHandler: ComponentValues;

    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetElement: Element, pValueHandler: ComponentValues, pAttribute: XmlAttribute) {
        this.mTargetElement = pTargetElement;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
    }

    /**
     * Cleanup event on deconstruction.
     */
    public onCleanup(): void {
        if (typeof this.mEmitter === 'undefined') {
            this.mTargetElement.removeEventListener(this.mEventName, this.mListener);
        } else {
            this.mEmitter.removeListener(this.mListener);
        }
    }

    /**
     * Process module.
     * Execute string on elements event.
     */
    public onProcess(): void {
        const lSelf: this = this;

        this.mEventName = this.mAttribute.name.substr(1, this.mAttribute.name.length - 2);

        // Get user class event from PwbComponent.
        if ('componentHandler' in this.mTargetElement) {
            this.mEmitter = this.mTargetElement.componentHandler.rootValues.getUserClassEvent(this.mEventName);
        }

        // Define listener.
        this.mListener = (pEvent: any): void => {
            // Add event to external values.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$event', pEvent);

            // Execute string with external event value.
            ComponentScopeExecutor.execute(lSelf.mAttribute.value, lSelf.mValueHandler, lExternalValues);
        };

        // Add native element or user class event listener.
        if (typeof this.mEmitter !== 'undefined' && this.mEmitter instanceof ComponentEventEmitter) {
            this.mEmitter.addListener(this.mListener);
        } else {
            this.mTargetElement.addEventListener(this.mEventName, this.mListener);
        }
    }
}
