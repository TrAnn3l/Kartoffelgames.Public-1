"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserObjectHandler = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
class UserObjectHandler {
    /**
     * Constrcutor.
     * @param pUserClass - User object constructor.
     */
    constructor(pUserClass, pUpdateHandler, pInjectionList) {
        // Create injection mapping. Ignores none objects.
        const lLocalInjections = new core_data_1.Dictionary();
        for (const lInjectionObject of pInjectionList) {
            if (typeof lInjectionObject === 'object' && lInjectionObject !== null) {
                lLocalInjections.add(lInjectionObject.constructor, lInjectionObject);
            }
        }
        // Create user object inside update zone.
        // Constructor needs to be called inside zone.
        let lUntrackedUserObject;
        pUpdateHandler.execute(() => {
            lUntrackedUserObject = core_dependency_injection_1.Injection.createObject(pUserClass, lLocalInjections);
        });
        this.mUserObject = pUpdateHandler.registerObject(lUntrackedUserObject);
    }
    /**
     * Untracked user class instance.
     */
    get untrackedUserObject() {
        return web_change_detection_1.ChangeDetection.getUntrackedObject(this.mUserObject);
    }
    /**
     * User class.
     */
    get userClass() {
        return this.mUserObject.constructor;
    }
    /**
     * User class instance.
     */
    get userObject() {
        return this.mUserObject;
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callAfterPwbInitialize() {
        this.callUserCallback('afterPwbInitialize');
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callAfterPwbUpdate() {
        this.callUserCallback('afterPwbUpdate');
    }
    /**
     * Call onPwbInitialize of user class object.
     * @param pAttributeName - Name of updated attribute.
     */
    callOnPwbAttributeChange(pAttributeName) {
        this.callUserCallback('onPwbAttributeChange', pAttributeName);
    }
    /**
     * Call onPwbDeconstruct of user class object.
     */
    callOnPwbDeconstruct() {
        this.callUserCallback('onPwbDeconstruct');
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callOnPwbInitialize() {
        this.callUserCallback('onPwbInitialize');
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callOnPwbUpdate() {
        this.callUserCallback('onPwbUpdate');
    }
    /**
     * Callback by name.
     * @param pCallbackKey - Callback name.
     */
    callUserCallback(pCallbackKey, ...pArguments) {
        // Callback when it exits
        if (pCallbackKey in this.mUserObject) {
            this.mUserObject[pCallbackKey](...pArguments);
        }
    }
}
exports.UserObjectHandler = UserObjectHandler;
//# sourceMappingURL=user-object-handler.js.map