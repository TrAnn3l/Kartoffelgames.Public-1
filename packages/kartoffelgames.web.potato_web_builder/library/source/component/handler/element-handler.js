"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementHandler = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const global_key_1 = require("../../global-key");
const attribute_handler_1 = require("./attribute-handler");
class ElementHandler {
    /**
     * Constructor.
     * @param pHtmlElement - HTMLElement.
     * @param pUserObjectHandler - User object handler.
     */
    constructor(pHtmlElement, pUserObjectHandler) {
        this.mHtmlElement = pHtmlElement;
        this.mShadowRoot = this.mHtmlElement.attachShadow({ mode: 'open' });
        this.mAttributeHandler = new attribute_handler_1.AttributeHandler(pUserObjectHandler, pHtmlElement);
        this.mUserObjectHandler = pUserObjectHandler;
        this.mSlotNameList = new core_data_1.List();
    }
    /**
     * Get html element.
     */
    get htmlElement() {
        return this.mHtmlElement;
    }
    /**
     * Elements shadow root.
     */
    get shadowRoot() {
        return this.mShadowRoot;
    }
    /**
     * Valid slot names for this element.
     */
    get validSlotNames() {
        return this.mSlotNameList.clone();
    }
    /**
     * Add valid slot name. Slot must be added independently.
     * @param pSlotName - New slot name.
     */
    addValidSlot(pSlotName) {
        this.mSlotNameList.push(pSlotName);
    }
    /**
     * Connect all exported properties with html element.
     */
    connectExportedProperties() {
        const lExportedPropertyList = core_dependency_injection_1.Metadata.get(this.mUserObjectHandler.userClass).getMetadata(global_key_1.MetadataKey.METADATA_EXPORTED_PROPERTIES);
        this.mAttributeHandler.connectExportedProperties(lExportedPropertyList ?? new Array());
    }
    /**
     * Get Slotname for this element.
     * User can decide where the component gets append when any slot name was set.
     * If no slot was set an exception is thrown.
     * @param pTemplate - Template of node.
     */
    getElementsSlotname(pTemplate) {
        const lSlotNameList = this.validSlotNames;
        let lSlotName;
        if (lSlotNameList.length === 0) {
            throw new core_data_1.Exception(`${this.mHtmlElement.tagName} does not support child elements.`, this);
        }
        else if (lSlotNameList.length === 1) {
            // Append content on single slot.
            lSlotName = lSlotNameList[0];
        }
        else {
            // Check if user class implements correct interface.
            if (typeof this.mUserObjectHandler.userObject.assignSlotContent !== 'function') {
                throw new core_data_1.Exception('UserClass must implement PwbSlotAssign to use more than one content root.', this);
            }
            // Let the user decide in which content root the new content gets append.
            lSlotName = this.mUserObjectHandler.userObject.assignSlotContent(pTemplate);
            // Check user selected slot name.
            if (!lSlotNameList.includes(lSlotName)) {
                throw new core_data_1.Exception(`No slot with slotname "${lSlotName}" found.`, this);
            }
        }
        return lSlotName;
    }
}
exports.ElementHandler = ElementHandler;
//# sourceMappingURL=element-handler.js.map