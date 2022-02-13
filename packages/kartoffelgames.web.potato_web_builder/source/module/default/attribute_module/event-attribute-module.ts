import { Dictionary } from '@kartoffelgames/core.data';
import { XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentConnection } from '../../../component/component-connection';
import { ComponentManager } from '../../../component/component-manager';
import { LayerValues } from '../../../component/values/layer-values';
import { StaticAttributeModule } from '../../../decorator/module/static-attribute-module';
import { ModuleAccessType } from '../../../enum/module-access-type';
import { IPwbModuleOnDeconstruct, IPwbStaticAttributeOnProcess } from '../../../interface/module';
import { HtmlContent } from '../../../types';
import { ComponentEventEmitter } from '../../../user_class_manager/component-event-emitter';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

@StaticAttributeModule({
    accessType: ModuleAccessType.Write,
    forbiddenInManipulatorScopes: false,
    manipulatesAttributes: false,
    attributeSelector: /^\([[\w$]+\)$/
})
export class EventAttributeModule implements IPwbStaticAttributeOnProcess, IPwbModuleOnDeconstruct {
    private readonly mAttribute: XmlAttribute;
    private mEmitter: ComponentEventEmitter<any>;
    private mEventName: string;
    private mListener: (this: null, pEvent: any) => void;
    private readonly mTargetElement: HtmlContent;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetElement: Element, pValueHandler: LayerValues, pAttribute: XmlAttribute) {
        this.mTargetElement = pTargetElement;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
    }

    /**
     * Cleanup event on deconstruction.
     */
    public onDeconstruct(): void {
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

        // Try to get user class event from target element component manager..
        const lTargetComponentManager: ComponentManager = ComponentConnection.componentManagerOf(this.mTargetElement);
        if (lTargetComponentManager) {
            this.mEmitter = lTargetComponentManager.userEventHandler.getEventEmitter(this.mEventName);
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
        if (this.mEmitter && this.mEmitter instanceof ComponentEventEmitter) {
            this.mEmitter.addListener(this.mListener);
        } else {
            this.mTargetElement.addEventListener(this.mEventName, this.mListener);
        }
    }
}
