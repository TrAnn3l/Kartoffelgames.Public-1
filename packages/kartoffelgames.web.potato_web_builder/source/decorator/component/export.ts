import { Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { MetadataKey } from '../../global-key';
import { UserClass } from '../../interface/user-class';

/**
 * AtScript.
 * Export value to component element.
 */
export function Export(pTarget: object, pPropertyKey: string): void {
    // Usually Class Prototype. Globaly.
    const lPrototype: object = pTarget;
    const lUserClassConstructor: UserClass = <any>lPrototype.constructor;

    // Check if real decorator on static property.
    if (typeof pTarget === 'function') {
        throw new Exception('Event target is not for a static property.', Export);
    }

    // Get property list from constructor metadata.
    const lExportedPropertyList: Array<string | symbol> = Metadata.get(lUserClassConstructor).getMetadata(MetadataKey.METADATA_EXPORTED_PROPERTIES) ?? new Array<string | symbol>();
    lExportedPropertyList.push(pPropertyKey);

    // Set metadata.
    Metadata.get(lUserClassConstructor).setMetadata(MetadataKey.METADATA_EXPORTED_PROPERTIES, lExportedPropertyList);
}
