import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { UserClass } from '../../component/interface/user-class';
import { ComponentEventExtension } from './component-event-extension';

/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
export function PwbComponentEvent(pEventName: string): any {
    return (pTarget: object, pPropertyKey: string, pDescriptor: PropertyDescriptor): void => {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lUserClassConstructor: UserClass = <any>lPrototype.constructor;

        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for an instanced property.', PwbComponentEvent);
        }

        // Get property list from constructor metadata.
        const lEventProperties: Dictionary<string, string> = Metadata.get(lUserClassConstructor).getMetadata(ComponentEventExtension.METADATA_USER_EVENT_PROPERIES) ?? new Dictionary<string, string>();
        lEventProperties.add(pEventName, pPropertyKey);

        // Set metadata.
        Metadata.get(lUserClassConstructor).setMetadata(ComponentEventExtension.METADATA_USER_EVENT_PROPERIES, lEventProperties);
    };
}
