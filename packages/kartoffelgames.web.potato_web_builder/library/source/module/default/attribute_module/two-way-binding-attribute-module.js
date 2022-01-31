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
exports.TwoWayBindingAttributeModule = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const component_scope_executor_1 = require("../../execution/component-scope-executor");
const static_attribute_module_1 = require("../../../decorator/static-attribute-module");
const core_xml_1 = require("@kartoffelgames/core.xml");
const component_values_1 = require("../../../component/component-values");
const component_manager_1 = require("../../../component/component-manager");
const attribute_module_access_type_1 = require("../../../enum/attribute-module-access-type");
let TwoWayBindingAttributeModule = class TwoWayBindingAttributeModule {
    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetElement, pValueHandler, pAttribute, pComponentHandler) {
        this.mTargetElement = pTargetElement;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
        this.mComponentHandler = pComponentHandler;
    }
    /**
     * Process module.
     * Initialize watcher and set view value with user class object value on startup.
     */
    onProcess() {
        // Get property name.
        this.mTargetViewProperty = this.mAttribute.qualifiedName.substr(2, this.mAttribute.qualifiedName.length - 4);
        this.mThisValueExpression = this.mAttribute.value;
        // Try to update view only on module initialize.
        const lThisValue = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mThisValueExpression, this.mValueHandler);
        // Register all events.
        this.mComponentHandler.changeDetection.registerObject(this.mTargetElement);
        // Only update if not undefined
        if (typeof lThisValue !== 'undefined') {
            this.mTargetElement[this.mTargetViewProperty] = lThisValue;
        }
        // Add comparison handler for this and for the target view value.
        this.mThisCompareHandler = new web_change_detection_1.CompareHandler(lThisValue, 4);
        this.mTargetViewCompareHandler = new web_change_detection_1.CompareHandler(this.mTargetElement[this.mTargetViewProperty], 4);
    }
    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    onUpdate() {
        let lValueChanged = false;
        // Try to update view only on module initialize.
        const lThisValue = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mThisValueExpression, this.mValueHandler);
        // Check for changes in this value.
        if (!this.mThisCompareHandler.compare(lThisValue)) {
            // Update target view
            this.mTargetElement[this.mTargetViewProperty] = lThisValue;
            // Update compare 
            this.mTargetViewCompareHandler.compare(lThisValue);
            // Set flag that value was updated.
            lValueChanged = true;
        }
        else {
            const lTargetViewValue = this.mTargetElement[this.mTargetViewProperty];
            // Check for changes in view.
            if (!this.mTargetViewCompareHandler.compare(lTargetViewValue)) {
                const lExtendedValues = new core_data_1.Dictionary();
                lExtendedValues.set('$DATA', lTargetViewValue);
                // Update value.
                component_scope_executor_1.ComponentScopeExecutor.execute(`${this.mThisValueExpression} = $DATA;`, this.mValueHandler, lExtendedValues);
                // Update compare.
                this.mThisCompareHandler.compare(lTargetViewValue);
                // Set flag that value was updated.
                lValueChanged = true;
            }
        }
        return lValueChanged;
    }
};
TwoWayBindingAttributeModule = __decorate([
    (0, static_attribute_module_1.StaticAttributeModule)({
        accessType: attribute_module_access_type_1.AttributeModuleAccessType.ReadWrite,
        attributeSelector: /^\[\([[\w$]+\)\]$/,
        forbiddenInManipulatorScopes: false,
        manipulatesAttributes: false
    }),
    __metadata("design:paramtypes", [Element, component_values_1.ComponentValues, core_xml_1.XmlAttribute, component_manager_1.ComponentManager])
], TwoWayBindingAttributeModule);
exports.TwoWayBindingAttributeModule = TwoWayBindingAttributeModule;
//# sourceMappingURL=two-way-binding-attribute-module.js.map