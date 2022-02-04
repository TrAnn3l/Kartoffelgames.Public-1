"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlComponentEvent = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const global_key_1 = require("../global-key");
/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
function HtmlComponentEvent(pEventName) {
    return (pTarget, pPropertyKey, pDescriptor) => {
        // Usually Class Prototype. Globaly.
        const lPrototype = pTarget;
        const lUserClassConstructor = lPrototype.constructor;
        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new core_data_1.Exception('Event target is not for an instanced property.', HtmlComponentEvent);
        }
        // Get property list from constructor metadata.
        const lEventProperties = core_dependency_injection_1.Metadata.get(lUserClassConstructor).getMetadata(global_key_1.MetadataKey.METADATA_USER_EVENT_PROPERIES) ?? new core_data_1.Dictionary();
        lEventProperties.add(pEventName, pPropertyKey);
        // Set metadata.
        core_dependency_injection_1.Metadata.get(lUserClassConstructor).setMetadata(global_key_1.MetadataKey.METADATA_USER_EVENT_PROPERIES, lEventProperties);
    };
}
exports.HtmlComponentEvent = HtmlComponentEvent;
//# sourceMappingURL=html-component-event.js.map