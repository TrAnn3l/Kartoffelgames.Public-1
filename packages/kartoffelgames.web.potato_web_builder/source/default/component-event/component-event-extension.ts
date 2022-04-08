import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { PwbExtension } from '../../extension/decorator/pwb-extension.decorator';
import { ExtensionType } from '../../extension/enum/extension-type';
import { ComponentElementReference } from '../../injection_reference/component-element-reference';
import { ExtensionTargetClassReference } from '../../injection_reference/extension-target-class-reference';
import { ExtensionTargetObjectReference } from '../../injection_reference/extension-target-object-reference';
import { ComponentEventEmitter } from './component-event-emitter';

@PwbExtension({
    type: ExtensionType.Component
})
export class ComponentEventExtension {
    public static readonly METADATA_USER_EVENT_PROPERIES: string = 'pwb:user_event_properties';

    /**
     * Constructor.
     * Override each event emmiter property with a new pre defined event emmiter.
     * @param pTargetClassReference - User class reference.
     * @param pTargetObjectReference - User object reference.
     * @param pElementReference - Component html element reference.
     */
    public constructor(pTargetClassReference: ExtensionTargetClassReference, pTargetObjectReference: ExtensionTargetObjectReference, pElementReference: ComponentElementReference) {
        // Get event metadata.
        const lEventProperties: Dictionary<string, string> = Metadata.get(pTargetClassReference.value).getMetadata(ComponentEventExtension.METADATA_USER_EVENT_PROPERIES);

        if (lEventProperties !== null) {
            // Easy access target objects.
            const lTargetObject: object = pTargetObjectReference.value;
            const lTargetElement: HTMLElement = <HTMLElement>pElementReference.value;

            // Override each property with the corresponding component event emitter.
            for (const lEventName of lEventProperties.keys()) {
                const lPropertyKey: string = lEventProperties.get(lEventName);

                // Check property type.
                if (Metadata.get(pTargetClassReference.value).getProperty(lPropertyKey).type !== ComponentEventEmitter) {
                    throw new Exception(`Event emiter property must be of type ${ComponentEventEmitter.name}`, this);
                }

                // Create component event emitter.
                const lEventEmitter: ComponentEventEmitter<any> = new ComponentEventEmitter(lEventName, lTargetElement);

                // Override property with created component event emmiter getter.
                Object.defineProperty(lTargetObject, lPropertyKey, {
                    get: () => {
                        return lEventEmitter;
                    }
                });
            }
        }
    }
}