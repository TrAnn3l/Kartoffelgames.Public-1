"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Export = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const global_key_1 = require("../global-key");
/**
 * AtScript.
 * Export value to component element.
 */
function Export(pTarget, pPropertyKey) {
    // Usually Class Prototype. Globaly.
    const lPrototype = pTarget;
    const lUserClassConstructor = lPrototype.constructor;
    // Check if real decorator on static property.
    if (typeof pTarget === 'function') {
        throw new core_data_1.Exception('Event target is not for a static property.', Export);
    }
    // Get property list from constructor metadata.
    const lExportedPropertyList = core_dependency_injection_1.Metadata.get(lUserClassConstructor).getMetadata(global_key_1.MetadataKey.METADATA_EXPORTED_PROPERTIES) ?? new Array();
    lExportedPropertyList.push(pPropertyKey);
    // Set metadata.
    core_dependency_injection_1.Metadata.get(lUserClassConstructor).setMetadata(global_key_1.MetadataKey.METADATA_EXPORTED_PROPERTIES, lExportedPropertyList);
}
exports.Export = Export;
//# sourceMappingURL=export.js.map