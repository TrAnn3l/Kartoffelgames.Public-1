import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { UserClass } from '../../component/interface/user-class';
import { EventListenerExtension } from './event-listener-extension';

/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
export function PwbEventListener(pEventName: string): any {
    return (pTarget: object, pPropertyKey: string, _pDescriptor: PropertyDescriptor): void => {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lUserClassConstructor: UserClass = <any>lPrototype.constructor;

        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for an instanced property.', PwbEventListener);
        }

        // Get property list from constructor metadata.
        const lEventProperties: Dictionary<string, string> = Metadata.get(lUserClassConstructor).getMetadata(EventListenerExtension.METADATA_USER_EVENT_LISTENER_PROPERIES) ?? new Dictionary<string, string>();
        lEventProperties.add(pEventName, pPropertyKey);

        // Set metadata.
        Metadata.get(lUserClassConstructor).setMetadata(EventListenerExtension.METADATA_USER_EVENT_LISTENER_PROPERIES, lEventProperties);
    };
}
