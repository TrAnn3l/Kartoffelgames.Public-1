import { Exception } from '@kartoffelgames/core.data';
import { UserClassConstructor } from '../interface/user-class';
import { StaticUserClassData } from '../user_class_manager/static-user-class-data';

/**
 * AtScript.
 * Export value to component element.
 */
export function Export(pTarget: object, pPropertyKey: string): void {
    // Usually Class Prototype. Globaly.
    const lPrototype: object = pTarget;
    const lUserClassConstructor: UserClassConstructor = <any>lPrototype.constructor;

    // Check if real decorator on static property.
    if (typeof pTarget === 'function') {
        throw new Exception('Event target is not for an instanced property.', Export);
    }

    // Set event to property mapping.
    StaticUserClassData.get(lUserClassConstructor).exportProperty.add(pPropertyKey, true);
}
