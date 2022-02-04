"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEventHandler = void 0;
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const global_key_1 = require("../../global-key");
const component_event_emitter_1 = require("../../user_class_manager/component-event-emitter");
class UserEventHandler {
    /**
     * Constructor.
     * @param pUserObjectHandler - User object handler.
     */
    constructor(pUserObjectHandler) {
        this.mUserObjectHandler = pUserObjectHandler;
    }
    /**
     * Get event emitter from user class object.
     * @param pEventName - Name of event.
     */
    getEventEmitter(pEventName) {
        // Get event properties from metadata.
        const lEventPropertyList = core_dependency_injection_1.Metadata.get(this.mUserObjectHandler.userClass).getMetadata(global_key_1.MetadataKey.METADATA_USER_EVENT_PROPERIES);
        if (lEventPropertyList) {
            // When event was set. 
            const lEventProperty = lEventPropertyList.get(pEventName);
            if (typeof lEventProperty === 'string') {
                const lEventEmitter = this.mUserObjectHandler.userObject[lEventProperty];
                // When event is event emitter.
                if (lEventEmitter instanceof component_event_emitter_1.ComponentEventEmitter) {
                    return lEventEmitter;
                }
            }
        }
        // Fallback to undefined.
        return undefined;
    }
}
exports.UserEventHandler = UserEventHandler;
//# sourceMappingURL=user-event-handler.js.map