import { Exception } from '@kartoffelgames/core.data';
import { StaticUserClassData } from '../user_class_manager/static-user-class-data';
import { UserClassConstructor } from '../interface/user-class';

/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
export function HtmlComponentEvent(pEventName: string): any {
    return (pTarget: object, pPropertyKey: string, pDescriptor: PropertyDescriptor): void => {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lUserClassConstructor: UserClassConstructor = <any>lPrototype.constructor;

        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for an instanced property.', HtmlComponentEvent);
        }

        // Set event to property mapping.
        StaticUserClassData.get(lUserClassConstructor).eventInformation.add(pEventName, pPropertyKey);
    };
}
