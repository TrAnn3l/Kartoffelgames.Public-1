import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { UserClass } from '../../interface/user-class';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { MetadataKey } from '../../metadata-key';

/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
export function HtmlComponentEvent(pEventName: string): any {
    return (pTarget: object, pPropertyKey: string, pDescriptor: PropertyDescriptor): void => {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lUserClassConstructor: UserClass = <any>lPrototype.constructor;

        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for an instanced property.', HtmlComponentEvent);
        }

        // Get property list from constructor metadata.
        const lEventProperties: Dictionary<string, string> = Metadata.get(lUserClassConstructor).getMetadata(MetadataKey.METADATA_USER_EVENT_PROPERIES) ?? new Dictionary<string, string>();
        lEventProperties.add(pEventName, pPropertyKey);

        // Set metadata.
        Metadata.get(lUserClassConstructor).setMetadata(MetadataKey.METADATA_USER_EVENT_PROPERIES, lEventProperties);
    };
}
