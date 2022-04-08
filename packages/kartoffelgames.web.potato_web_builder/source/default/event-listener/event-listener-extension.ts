import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { Extension } from '../../extension/decorator/extension.decorator';
import { ExtensionType } from '../../extension/enum/extension-type';
import { IPwbExtensionOnDeconstruct } from '../../extension/interface/extension';
import { ComponentManagerReference } from '../../injection_reference/component-manager-reference';
import { ExtensionTargetClassReference } from '../../injection_reference/extension-target-class-reference';
import { ExtensionTargetObjectReference } from '../../injection_reference/extension-target-object-reference';

@Extension({
    type: ExtensionType.Component | ExtensionType.Module
})
export class EventListenerExtension implements IPwbExtensionOnDeconstruct {
    public static readonly METADATA_USER_EVENT_LISTENER_PROPERIES: string = 'pwb:user_event_listener_properties';

    private readonly mEventListenerList: Array<[string, EventListener]>;
    private readonly mTargetElement: HTMLElement;

    /**
     * Constructor.
     * Add each event listener to component events.
     * @param pTargetClassReference - User class reference.
     * @param pTargetObjectReference - User object reference.
     * @param pComponentManagerReference - Component manager.
     */
    public constructor(pTargetClassReference: ExtensionTargetClassReference, pTargetObjectReference: ExtensionTargetObjectReference, pComponentManagerReference: ComponentManagerReference) {
        // Get event metadata.
        const lEventProperties: Dictionary<string, string> = Metadata.get(pTargetClassReference.value).getMetadata(EventListenerExtension.METADATA_USER_EVENT_LISTENER_PROPERIES) ?? new Dictionary<string, string>();

        // Initialize lists.
        this.mEventListenerList = new Array<[string, EventListener]>();

        // Easy access target objects.
        const lTargetObject: object = pTargetObjectReference.value;
        this.mTargetElement = <HTMLElement>pComponentManagerReference.value.elementHandler.htmlElement;

        // Override each property with the corresponding component event emitter.
        for (const lEventName of lEventProperties.keys()) {
            const lPropertyKey: string = lEventProperties.get(lEventName);

            // Check property type.
            if (Metadata.get(pTargetClassReference.value).getProperty(lPropertyKey).type !== Function) {
                throw new Exception(`Event listener property must be of type Function`, this);
            }

            // Get target event listener function.
            const lEventListener: EventListener = Reflect.get(lTargetObject, lPropertyKey);

            // Add listener element and save for deconstruct.
            this.mEventListenerList.push([lEventName, lEventListener]);
            this.mTargetElement.addEventListener(lEventName, lEventListener);
        }
    }

    /**
     * Remove all listener.
     */
    public onDeconstruct(): void {
        for (const lListener of this.mEventListenerList) {
            const [lEventName, lFunction] = lListener;
            this.mTargetElement.removeEventListener(lEventName, lFunction);
        }
    }
}

type EventListener = (...pArgs: Array<any>) => any;