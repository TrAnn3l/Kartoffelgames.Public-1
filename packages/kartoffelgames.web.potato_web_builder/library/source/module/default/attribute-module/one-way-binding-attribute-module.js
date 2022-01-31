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
exports.OneWayBindingAttributeModule = void 0;
const core_xml_1 = require("@kartoffelgames/core.xml");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const component_values_1 = require("../../../component/component-values");
const static_attribute_module_1 = require("../../../decorator/static-attribute-module");
const attribute_module_access_type_1 = require("../../../enum/attribute-module-access-type");
const component_scope_executor_1 = require("../../execution/component-scope-executor");
/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
let OneWayBindingAttributeModule = class OneWayBindingAttributeModule {
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
     * Process module.
     * Initialize watcher and set view value with user class object value on startup.
     */
    onProcess() {
        // Get execution string.
        this.mExecutionString = this.mAttribute.value;
        // Get view object information. Remove starting [ and end ].
        this.mTargetProperty = this.mAttribute.qualifiedName.substr(1, this.mAttribute.qualifiedName.length - 2);
        // Get result of string execution and save as comparison object.
        const lExecutionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);
        this.mValueCompare = new web_change_detection_1.CompareHandler(lExecutionResult, 4);
        // Set view object property.
        this.setValueToTarget(lExecutionResult);
    }
    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    onUpdate() {
        const lExecutionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);
        if (!this.mValueCompare.compare(lExecutionResult)) {
            // Set view object property.
            this.setValueToTarget(lExecutionResult);
            return true;
        }
        return false;
    }
    /**
     * Set value to target element.
     * @param pValue - Value.
     */
    setValueToTarget(pValue) {
        this.mTargetElement[this.mTargetProperty] = pValue;
    }
};
OneWayBindingAttributeModule = __decorate([
    (0, static_attribute_module_1.StaticAttributeModule)({
        accessType: attribute_module_access_type_1.AttributeModuleAccessType.Read,
        attributeSelector: /^\[[\w$]+\]$/,
        forbiddenInManipulatorScopes: false,
        manipulatesAttributes: false
    }),
    __metadata("design:paramtypes", [Element, component_values_1.ComponentValues, core_xml_1.XmlAttribute])
], OneWayBindingAttributeModule);
exports.OneWayBindingAttributeModule = OneWayBindingAttributeModule;
//# sourceMappingURL=one-way-binding-attribute-module.js.map