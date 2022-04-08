import { Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { UserClass } from '../../component/interface/user-class';
import { ExportExtension } from './export-extension';

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
    const lExportedPropertyList: Array<string | symbol> = Metadata.get(lUserClassConstructor).getMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES) ?? new Array<string | symbol>();
    lExportedPropertyList.push(pPropertyKey);

    // Set metadata.
    Metadata.get(lUserClassConstructor).setMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES, lExportedPropertyList);
}
