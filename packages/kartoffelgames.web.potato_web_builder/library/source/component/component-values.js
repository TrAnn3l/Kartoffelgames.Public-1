"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentValues = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const static_user_class_data_1 = require("../user_class_manager/static-user-class-data");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Simple access for all value types: TemporaryValue, IdChild and UserClassValue.
 * has-, get-, set-, remove-.
 */
class ComponentValues {
    /**
     * Constructor.
     * Initialize data lists.
     * @param pValueObject - Parent value object.
     *                       Is the user class object on root level and values handler on any branch level          .
     */
    constructor(pValueObject) {
        this.mValueObject = pValueObject;
        this.mTemporaryValues = new core_data_1.Dictionary();
        // Only needed in root component values.
        this.mValidSlotNameList = (ComponentValues.isUserClassObject(this.mValueObject)) ? new Array() : null;
    }
    /**
     * Check if value object is the root user class object.
     * @param pValueObject - Value object.
     */
    static isUserClassObject(pValueObject) {
        // Check if user class object is a component value instance.
        return !(pValueObject instanceof ComponentValues);
    }
    /**
     * Get the user class object.
     */
    get userClassObject() {
        // Get values from parent if handler is only branch handler.
        if (!ComponentValues.isUserClassObject(this.mValueObject)) {
            return this.mValueObject.userClassObject;
        }
        else {
            // Is always the user class object.
            return this.mValueObject;
        }
    }
    /**
     * Get all keys of temorary values.
     */
    get temporaryValuesList() {
        const lKeyList = this.mTemporaryValues.map((pKey) => pKey);
        // Get key list from parent if parent can have temporary values.
        if (!ComponentValues.isUserClassObject(this.mValueObject)) {
            lKeyList.push(...this.mValueObject.temporaryValuesList);
        }
        return lKeyList;
    }
    /**
     * Get all valid slot names.
     */
    get validSlotNameList() {
        // Get key list from parent if parent can have temporary values.
        if (!ComponentValues.isUserClassObject(this.mValueObject)) {
            return this.mValueObject.validSlotNameList;
        }
        else {
            return this.mValidSlotNameList;
        }
    }
    /**
     * Check for changes into two value handler.
     * @param pHandler - Handler two.
     */
    equal(pHandler) {
        const lTemporaryValuesOne = this.temporaryValuesList;
        const lTemporaryValuesTwo = pHandler.temporaryValuesList;
        // Compare if it has the same user class object.
        if (this.userClassObject !== pHandler.userClassObject) {
            return false;
        }
        // Compare length of temporary values.
        if (lTemporaryValuesOne.length !== lTemporaryValuesTwo.length) {
            return false;
        }
        // Check for temporary values differences from one to two.
        for (const lTemporaryValueOneKey of lTemporaryValuesOne) {
            // Check for difference.
            if (this.getTemporaryValue(lTemporaryValueOneKey) !== pHandler.getTemporaryValue(lTemporaryValueOneKey)) {
                return false;
            }
        }
        // Check for temporary values differences from two to one.
        for (const lTemporaryValueTwoKey of lTemporaryValuesTwo) {
            // Check for difference.
            if (pHandler.getTemporaryValue(lTemporaryValueTwoKey) !== this.getTemporaryValue(lTemporaryValueTwoKey)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Gets the html element specified temporary value.
     * @param pValueName - Name of value.
     */
    getTemporaryValue(pValueName) {
        // If current dictionary has value.
        if (this.mTemporaryValues.has(pValueName)) {
            return this.mTemporaryValues.get(pValueName);
        }
        else if (!ComponentValues.isUserClassObject(this.mValueObject)) {
            // Search inside parents if not in current found.
            return this.mValueObject.getTemporaryValue(pValueName);
        }
        return undefined;
    }
    /**
     * Get event emitter from user class object.
     * @param pEventName - Name of event.
     */
    getUserClassEvent(pEventName) {
        let lUserClassConstructor = this.userClassObject.constructor;
        // Get original constructor
        lUserClassConstructor = web_change_detection_1.ChangeDetection.current.getUntrackedObject(lUserClassConstructor);
        // Check if event exists.
        const lEventProperty = static_user_class_data_1.StaticUserClassData.get(lUserClassConstructor).eventInformation.get(pEventName);
        if (typeof lEventProperty !== 'undefined') {
            // Get property of event emitter.
            return this.userClassObject[lEventProperty];
        }
        else {
            return undefined;
        }
    }
    /**
     * Remove temporary value from current manipulator scope.
     * Can only remove temporary values of current scope.
     * @param pValueName - Name of the value.
     */
    removeTemporaryValue(pValueName) {
        // Remove value from html element.
        this.mTemporaryValues.delete(pValueName);
    }
    /**
     * Add or replaces temporary value in this manipulator scope.
     * @param pValueName - Name of the value.
     * @param pValue - Value.
     * @param pSetToRoot - [Optional] If value should be set to root values and all layers should have access to it.
     */
    setTemporaryValue(pValueName, pValue, pSetToRoot) {
        if (!pSetToRoot || pSetToRoot && ComponentValues.isUserClassObject(this.mValueObject)) {
            // Set value to current layer.
            this.mTemporaryValues.set(pValueName, pValue);
        }
        else {
            // Set value to parent value object.
            this.mValueObject.setTemporaryValue(pValueName, pValue, pSetToRoot);
        }
    }
}
exports.ComponentValues = ComponentValues;
//# sourceMappingURL=component-values.js.map