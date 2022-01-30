"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlComponent = void 0;
const component_modules_1 = require("../component_manager/component-modules");
const component_handler_1 = require("../component_manager/component-handler");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const core_xml_1 = require("@kartoffelgames/core.xml");
const template_parser_1 = require("../parser/template-parser");
const update_mode_1 = require("../enum/update-mode");
/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
function HtmlComponent(pParameter) {
    // XMl parser with custom attribute names.
    const lParser = new template_parser_1.TemplateParser();
    const lParsedTemplate = pParameter.template ? lParser.parse(pParameter.template) : new core_xml_1.XmlDocument(''); // Ignore default-namespace.
    // Update mode
    const lUpdateMode = pParameter.updateMode ?? update_mode_1.UpdateMode.Global;
    // Needs constructor without argument.
    return (pUserClassConstructor) => {
        // Attribute module mapping.
        const lAttributeModules = new component_modules_1.ComponentModules(pParameter.expressionmodule);
        // Extend base user class with needed component methods.
        pUserClassConstructor.createComponent = () => {
            // Create 
            return new lPwbComponentConstructor();
        };
        pUserClassConstructor.componentSelector = pParameter.selector;
        // Set user class to be injectable
        core_dependency_injection_1.Injector.Injectable(pUserClassConstructor);
        // Create custom html element of parent type.
        const lPwbComponentConstructor = class extends HTMLElement {
            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            constructor() {
                super();
                this.initializeComponent();
            }
            /**
             * Get data for accessing component handler.
             */
            get componentHandler() {
                return this.mComponentHandler;
            }
            /**
             * Initialize component.
             * Add all content to component body and start automatic updates.
             */
            initializeComponent() {
                // Create component handler.
                const lComponentHandler = new component_handler_1.ComponentHandler(pUserClassConstructor, lParsedTemplate.body, lAttributeModules, this, lUpdateMode);
                // Append extended data to this comonent and user class object.
                this.mComponentHandler = lComponentHandler;
                // Append style if specified. Styles are scoped on components shadow root.
                if (typeof pParameter.style !== 'undefined') {
                    lComponentHandler.addStyle(pParameter.style);
                }
                // Initialize component handler
                lComponentHandler.initialize();
            }
        };
        // Define current element as new custom html element.
        window.customElements.define(pParameter.selector, lPwbComponentConstructor);
    };
}
exports.HtmlComponent = HtmlComponent;
//# sourceMappingURL=html-component.js.map