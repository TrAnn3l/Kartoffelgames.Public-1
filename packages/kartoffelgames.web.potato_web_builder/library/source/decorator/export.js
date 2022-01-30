"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Export = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const static_user_class_data_1 = require("../user_class_manager/static-user-class-data");
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
        throw new core_data_1.Exception('Event target is not for an instanced property.', Export);
    }
    // Set event to property mapping.
    static_user_class_data_1.StaticUserClassData.get(lUserClassConstructor).exportProperty.add(pPropertyKey, true);
}
exports.Export = Export;
//# sourceMappingURL=export.js.map