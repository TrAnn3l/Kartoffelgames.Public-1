"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAttributeModule = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const core_xml_1 = require("@kartoffelgames/core.xml");
const component_connection_1 = require("../../../component/component-connection");
const layer_values_1 = require("../../../component/values/layer-values");
const static_attribute_module_1 = require("../../../decorator/static-attribute-module");
const attribute_module_access_type_1 = require("../../../enum/attribute-module-access-type");
const component_event_emitter_1 = require("../../../user_class_manager/component-event-emitter");
const component_scope_executor_1 = require("../../execution/component-scope-executor");
let EventAttributeModule = class EventAttributeModule {
    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetElement, pValueHandler, pAttribute) {
        this.mTargetElement = pTargetElement;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
    }
    /**
     * Cleanup event on deconstruction.
     */
    onCleanup() {
        if (typeof this.mEmitter === 'undefined') {
            this.mTargetElement.removeEventListener(this.mEventName, this.mListener);
        }
        else {
            this.mEmitter.removeListener(this.mListener);
        }
    }
    /**
     * Process module.
     * Execute string on elements event.
     */
    onProcess() {
        const lSelf = this;
        this.mEventName = this.mAttribute.name.substr(1, this.mAttribute.name.length - 2);
        // Try to get user class event from target element component manager..
        const lTargetComponentManager = component_connection_1.ComponentConnection.componentManagerOf(this.mTargetElement);
        if (lTargetComponentManager) {
            this.mEmitter = lTargetComponentManager.userEventHandler.getEventEmitter(this.mEventName);
        }
        // Define listener.
        this.mListener = (pEvent) => {
            // Add event to external values.
            const lExternalValues = new core_data_1.Dictionary();
            lExternalValues.add('$event', pEvent);
            // Execute string with external event value.
            component_scope_executor_1.ComponentScopeExecutor.execute(lSelf.mAttribute.value, lSelf.mValueHandler, lExternalValues);
        };
        // Add native element or user class event listener.
        if (this.mEmitter && this.mEmitter instanceof component_event_emitter_1.ComponentEventEmitter) {
            this.mEmitter.addListener(this.mListener);
        }
        else {
            this.mTargetElement.addEventListener(this.mEventName, this.mListener);
        }
    }
};
EventAttributeModule = __decorate([
    (0, static_attribute_module_1.StaticAttributeModule)({
        accessType: attribute_module_access_type_1.AttributeModuleAccessType.Write,
        forbiddenInManipulatorScopes: false,
        manipulatesAttributes: false,
        attributeSelector: /^\([[\w$]+\)$/
    }),
    __metadata("design:paramtypes", [Element, layer_values_1.LayerValues, core_xml_1.XmlAttribute])
], EventAttributeModule);
exports.EventAttributeModule = EventAttributeModule;
//# sourceMappingURL=event-attribute-module.js.map