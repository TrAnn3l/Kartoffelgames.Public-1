import { Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { Extension } from '../../extension/decorator/extension.decorator';
import { ExtensionType } from '../../extension/enum/extension-type';
import { IPwbExtensionOnDeconstruct } from '../../extension/interface/extension';
import { ComponentManagerReference } from '../../injection_reference/component-manager-reference';
import { ExtensionTargetClassReference } from '../../injection_reference/extension-target-class-reference';
import { ExtensionTargetObjectReference } from '../../injection_reference/extension-target-object-reference';
import { ModuleTargetReference } from '../../injection_reference/module-target-reference';
import { EventListenerComponentExtension } from './event-listener-component-extension';

@Extension({
    type: ExtensionType.Module
})
export class EventListenerModuleExtension implements IPwbExtensionOnDeconstruct {
    private readonly mEventListenerList: Array<[string, EventListener]>;
    private readonly mTargetElement: HTMLElement;

    /**
     * Constructor.
     * Add each event listener to component events.
     * @param pTargetClassReference - User class reference.
     * @param pTargetObjectReference - User object reference.
     * @param pElementReference - Component manager.
     */
    public constructor(pTargetClassReference: ExtensionTargetClassReference, pTargetObjectReference: ExtensionTargetObjectReference, pElementReference: ModuleTargetReference, pComponentManager: ComponentManagerReference) {
        // Get event metadata.
        const lEventPropertyList: Array<[string, string]> = Metadata.get(pTargetClassReference.value).getMetadata(EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES);

        // Initialize lists.
        this.mEventListenerList = new Array<[string, EventListener]>();

        // Only if any event listener is defined.
        if (lEventPropertyList !== null) {
            // Easy access target objects.
            const lTargetObject: object = pTargetObjectReference.value;
            this.mTargetElement = <HTMLElement>pElementReference.value ?? pComponentManager.value.elementHandler.htmlElement;

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