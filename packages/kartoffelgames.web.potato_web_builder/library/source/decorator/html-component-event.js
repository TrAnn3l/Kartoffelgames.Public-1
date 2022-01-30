"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlComponentEvent = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const static_user_class_data_1 = require("../user_class_manager/static-user-class-data");
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
        // Set event to property mapping.
        static_user_class_data_1.StaticUserClassData.get(lUserClassConstructor).eventInformation.add(pEventName, pPropertyKey);
    };
}
exports.HtmlComponentEvent = HtmlComponentEvent;
//# sourceMappingURL=html-component-event.js.map