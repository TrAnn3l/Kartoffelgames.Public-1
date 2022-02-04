"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeHandler = void 0;
class AttributeHandler {
    /**
     * Constructor.
     * @param pUserObjectHandler - user object handler.
     * @param pHtmlElement - Components html element.
     */
    constructor(pUserObjectHandler, pHtmlElement) {
        this.mHtmlElement = pHtmlElement;
        this.mUserObjectHandler = pUserObjectHandler;
    }
    /**
     * Connect exported properties to html element attributes with the same name.
     * @param pExportedProperties - Exported user object properties.
     */
    connectExportedProperties(pExportedProperties) {
        this.exportPropertyAsAttribute(pExportedProperties);
        this.patchHtmlAttributes(pExportedProperties);
    }
    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    exportPropertyAsAttribute(pExportedProperties) {
        // Each exported property.
        for (const lExportProperty of pExportedProperties) {
            // Get property descriptor.
            let lDescriptor = Object.getOwnPropertyDescriptor(this.mHtmlElement, lExportProperty);
            if (!lDescriptor) {
                lDescriptor = {};
            }
            lDescriptor.enumerable = true;
            lDescriptor.configurable = true;
            delete lDescriptor.value;
            delete lDescriptor.writable;
            // Setter and getter of this property. Execute changes inside component handlers change detection.
            lDescriptor.set = (pValue) => {
                this.mUserObjectHandler.userObject[lExportProperty] = pValue;
                // Call OnAttributeChange.
                this.mUserObjectHandler.callOnPwbAttributeChange(lExportProperty);
            };
            lDescriptor.get = () => {
                let lValue = this.mUserObjectHandler.userObject[lExportProperty];
                // Bind "this" context to the exported function.
                if (typeof lValue === 'function') {
                    lValue = lValue.bind(this.mUserObjectHandler.userObject);
                }
                return lValue;
            };
            Object.defineProperty(this.mHtmlElement, lExportProperty, lDescriptor);
        }
    }
    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     */
    patchHtmlAttributes(pExportedProperties) {
        // Get original functions.
        const lOriginalSetAttribute = this.mHtmlElement.setAttribute;
        const lOriginalGetAttribute = this.mHtmlElement.getAttribute;
        // Patch set attribute
        this.mHtmlElement.setAttribute = (pQualifiedName, pValue) => {
            // Check if attribute is an exported value and set value to user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                this.mHtmlElement[pQualifiedName] = pValue;
            }
            lOriginalSetAttribute.call(this.mHtmlElement, pQualifiedName, pValue);
        };
        // Patch get attribute
        this.mHtmlElement.getAttribute = (pQualifiedName) => {
            // Check if attribute is an exported value and return value of user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                return this.mHtmlElement[pQualifiedName];
            }
            return lOriginalGetAttribute.call(this.mHtmlElement, pQualifiedName);
        };
    }
}
exports.AttributeHandler = AttributeHandler;
//# sourceMappingURL=attribute-handler.js.map