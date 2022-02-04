"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeModuleAccessType = void 0;
/**
 * Access types of attribute module.
 */
var AttributeModuleAccessType;
(function (AttributeModuleAccessType) {
    /**
     * Module reads information from view.
     */
    AttributeModuleAccessType[AttributeModuleAccessType["Read"] = 1] = "Read";
    /**
     * Module writes into value object.
     */
    AttributeModuleAccessType[AttributeModuleAccessType["Write"] = 2] = "Write";
    /**
     * Module read into view and writes into value object.
     */
    AttributeModuleAccessType[AttributeModuleAccessType["ReadWrite"] = 4] = "ReadWrite";
})(AttributeModuleAccessType = exports.AttributeModuleAccessType || (exports.AttributeModuleAccessType = {}));
//# sourceMappingURL=attribute-module-access-type.js.map