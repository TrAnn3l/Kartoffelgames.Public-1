"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlComponent = void 0;
const component_manager_1 = require("../component/component-manager");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const global_key_1 = require("../global-key");
/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
function HtmlComponent(pParameter) {
    // Needs constructor without argument.
    return (pUserClassConstructor) => {
        // Set user class to be injectable.
        core_dependency_injection_1.Injector.Injectable(pUserClassConstructor);
        // Set element metadata.
        core_dependency_injection_1.Metadata.get(pUserClassConstructor).setMetadata(global_key_1.MetadataKey.METADATA_SELECTOR, pParameter.selector);
        // Create custom html element of parent type.
        const lPwbComponentConstructor = class extends HTMLElement {
            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            constructor() {
                super();
                // Create component handler.
                this.mComponentManager = new component_manager_1.ComponentManager(pUserClassConstructor, pParameter.template, pParameter.expressionmodule, this, pParameter.updateScope);
                // Append style if specified. Styles are scoped on components shadow root.
                if (pParameter.style) {
                    this.mComponentManager.addStyle(pParameter.style);
                }
            }
            /**
             * Lifecycle callback.
             * Callback when element get attached to dom.
             */
            connectedCallback() {
                this.mComponentManager.connected();
            }
            /**
             * Lifecycle callback.
             * Callback when element get detached from dom.
             */
            disconnectedCallback() {
                this.mComponentManager.disconnected();
            }
        };
        // Define current element as new custom html element.
        window.customElements.define(pParameter.selector, lPwbComponentConstructor);
    };
}
exports.HtmlComponent = HtmlComponent;
//# sourceMappingURL=html-component.js.map