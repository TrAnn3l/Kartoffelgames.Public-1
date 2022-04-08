import { Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { UserClass } from '../../component/interface/user-class';
import { EventListenerComponentExtension } from './event-listener-component-extension';

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
            throw new Exception('Event listener is only valid on instanced property', PwbEventListener);
        }

        // Get property list from constructor metadata.
        const lEventPropertyList: Array<[string, string]> = Metadata.get(lUserClassConstructor).getMetadata(EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES) ?? new Array<[string, string]>();
        lEventPropertyList.push([pPropertyKey, pEventName]);

        // Set metadata.
        Metadata.get(lUserClassConstructor).setMetadata(EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES, lEventPropertyList);
    };
}
