"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentManager = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const static_builder_1 = require("./builder/static-builder");
const component_modules_1 = require("./component-modules");
const layer_values_1 = require("./values/layer-values");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const pwb_app_1 = require("../pwb-app");
const element_creator_1 = require("./content/element-creator");
const pwb_component_1 = require("../handler/pwb-component");
const update_scope_1 = require("../enum/update-scope");
const template_parser_1 = require("../parser/template-parser");
const update_handler_1 = require("./handler/update-handler");
const user_object_handler_1 = require("./handler/user-object-handler");
const element_handler_1 = require("./handler/element-handler");
const component_connection_1 = require("./component-connection");
const user_event_handler_1 = require("./handler/user-event-handler");
/**
 * Base component handler. Handles initialisation and update of components.
 */
class ComponentManager {
    /**
     * Constructor.
     * Initialized build parameter.
     * @param pUserClassObject - User class object.
     * @param pTemplate - Template content of component.
     * @param pAttributeModules - Attribute modules of component.
     */
    constructor(pUserClass, pTemplate, pExpressionModule, pHtmlComponent, pUpdateScope) {
        // Load cached or create new module handler and template.
        let [lModules, lTemplate] = ComponentManager.mComponentCache.get(pUserClass);
        if (!lModules || !lTemplate) {
            lTemplate = ComponentManager.mXmlParser.parse(pTemplate);
            lModules = new component_modules_1.ComponentModules(pExpressionModule);
            ComponentManager.mComponentCache.set(pUserClass, [lModules, lTemplate]);
        }
        // Create update handler.
        const lUpdateScope = pUpdateScope ?? update_scope_1.UpdateScope.Global;
        this.mUpdateHandler = new update_handler_1.UpdateHandler(this.mUserObjectHandler, lUpdateScope);
        this.mUpdateHandler.addUpdateListener(() => { return this.mRootBuilder.updateBuild(); });
        // Create user object handler.
        const lLocalInjections = new Array();
        lLocalInjections.push(new pwb_component_1.PwbComponent(this));
        lLocalInjections.push(web_change_detection_1.ChangeDetection.current?.getZoneData(pwb_app_1.PwbApp.PUBLIC_APP_KEY));
        this.mUserObjectHandler = new user_object_handler_1.UserObjectHandler(pUserClass, this.updateHandler, lLocalInjections);
        // After build, before initialization.
        this.mUserObjectHandler.callOnPwbInitialize();
        // Create element handler and export properties.
        this.mElementHandler = new element_handler_1.ElementHandler(pHtmlComponent, this.mUserObjectHandler);
        this.mElementHandler.connectExportedProperties();
        // Connect with this component manager.
        component_connection_1.ComponentConnection.connectComponentManagerWith(this.elementHandler.htmlElement, this);
        component_connection_1.ComponentConnection.connectComponentManagerWith(this.userObjectHandler.userObject, this);
        component_connection_1.ComponentConnection.connectComponentManagerWith(this.userObjectHandler.untrackedUserObject, this);
        // Create user event handler.
        this.mUserEventHandler = new user_event_handler_1.UserEventHandler(this.userObjectHandler);
        // Create component values handler with watched user class object.
        const lComponentValues = new layer_values_1.LayerValues(this);
        // Create component builder.
        this.mRootBuilder = new static_builder_1.StaticBuilder(lTemplate.body, lModules, lComponentValues, this, false);
        this.elementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);
        // Initialize lists and default values.
        this.mFirstAttachment = true;
        this.mUserObjectHandler.callAfterPwbInitialize();
    }
    /**
     * Get element handler.
     */
    get elementHandler() {
        return this.mElementHandler;
    }
    /**
     * Get user event handler.
     */
    get userEventHandler() {
        return this.mUserEventHandler;
    }
    /**
     * Get user class object.
     */
    get userObjectHandler() {
        return this.mUserObjectHandler;
    }
    /**
     * Get component values of the root builder.
     */
    get rootValues() {
        return this.mRootBuilder.values;
    }
    /**
     * Update handler.
     */
    get updateHandler() {
        return this.mUpdateHandler;
    }
    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    addStyle(pStyle) {
        const lStyleElement = element_creator_1.ElementCreator.createElement('style');
        lStyleElement.innerHTML = pStyle;
        this.elementHandler.shadowRoot.prepend(lStyleElement);
    }
    /**
     * Called when component get attached to DOM.
     */
    connected() {
        if (!this.mFirstAttachment) {
            this.mFirstAttachment = true;
            // Start initialize build.
            this.mRootBuilder.initializeBuild();
        }
        this.updateHandler.enabled = true;
        // Trigger light update.
        this.updateHandler.requestUpdate({
            source: this.userObjectHandler.userObject,
            property: Symbol('any'),
            stacktrace: Error().stack
        });
    }
    /**
     * Deconstruct element.
     */
    deconstruct() {
        // Disable updates.
        this.updateHandler.enabled = false;
        // User callback.
        this.userObjectHandler.callOnPwbDeconstruct();
        // Remove change listener from app.
        this.updateHandler.deconstruct();
        // Deconstruct all child element.s
        this.mRootBuilder.deleteBuild();
    }
    /**
     * Called when component gets detached from DOM.
     */
    disconnected() {
        this.updateHandler.enabled = false;
    }
}
exports.ComponentManager = ComponentManager;
ComponentManager.mComponentCache = new core_data_1.Dictionary();
ComponentManager.mXmlParser = new template_parser_1.TemplateParser();
//# sourceMappingURL=component-manager.js.map