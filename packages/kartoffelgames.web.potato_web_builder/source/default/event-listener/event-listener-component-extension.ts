import { Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { PwbExtension } from '../../extension/decorator/pwb-extension.decorator';
import { ExtensionMode } from '../../extension/enum/extension-mode';
import { ExtensionType } from '../../extension/enum/extension-type';
import { IPwbExtensionOnDeconstruct } from '../../extension/interface/extension';
import { ComponentElementReference } from '../../injection_reference/component-element-reference';
import { ExtensionTargetClassReference } from '../../injection_reference/extension-target-class-reference';
import { ExtensionTargetObjectReference } from '../../injection_reference/extension-target-object-reference';

@PwbExtension({
    type: ExtensionType.Component,
    mode: ExtensionMode.Patch
})
export class EventListenerComponentExtension implements IPwbExtensionOnDeconstruct {
    public static readonly METADATA_USER_EVENT_LISTENER_PROPERIES: string = 'pwb:user_event_listener_properties';

    private readonly mEventListenerList: Array<[string, EventListener]>;
    private readonly mTargetElement: HTMLElement | null;

    /**
     * Constructor.
     * Add each event listener to component events.
     * @param pTargetClassReference - User class reference.
     * @param pTargetObjectReference - User object reference.
     * @param pElementReference - Component manager.
     */
    public constructor(pTargetClassReference: ExtensionTargetClassReference, pTargetObjectReference: ExtensionTargetObjectReference, pElementReference: ComponentElementReference) {
        // Get event metadata.
        const lEventPropertyList: Array<[string, string]> = Metadata.get(pTargetClassReference.value).getMetadata(EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES);

        // Initialize lists.
        this.mEventListenerList = new Array<[string, EventListener]>();

        // Only if any event listener is defined.
        if (lEventPropertyList !== null) {
            // Easy access target objects.
            const lTargetObject: object = pTargetObjectReference.value;
            this.mTargetElement = <HTMLElement>pElementReference.value;

            // Override each property with the corresponding component event emitter.
            for (const lEventProperty of lEventPropertyList) {
                const [lPropertyKey, lEventName] = lEventProperty;

                // Check property type.
                if (Metadata.get(pTargetClassReference.value).getProperty(lPropertyKey).type !== Function) {
                    throw new Exception(`Event listener property must be of type Function`, this);
                }

                // Get target event listener function.
                let lEventListener: EventListener = Reflect.get(lTargetObject, lPropertyKey);
                lEventListener = ChangeDetection.getUntrackedObject(lEventListener);

                // Add listener element and save for deconstruct.
                this.mEventListenerList.push([lEventName, lEventListener]);
                this.mTargetElement.addEventListener(lEventName, lEventListener);
            }
        } else {
            this.mTargetElement = null;
        }
    }

    /**
     * Remove all listener.
     */
    public onDeconstruct(): void {
        // Exit if no events where set.
        if (this.mTargetElement === null) {
            return;
        }

        // Remove all events from target element.
        for (const lListener of this.mEventListenerList) {
            const [lEventName, lFunction] = lListener;
            this.mTargetElement.removeEventListener(lEventName, lFunction);
        }
    }
}

type EventListener = (...pArgs: Array<any>) => any;