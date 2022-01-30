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
exports.IfManipulatorAttributeModule = void 0;
const core_xml_1 = require("@kartoffelgames/core.xml");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const component_values_1 = require("../../../component_manager/component-values");
const manipulator_attribute_module_1 = require("../../../decorator/manipulator-attribute-module");
const attribute_module_access_type_1 = require("../../../enum/attribute-module-access-type");
const module_manipulator_result_1 = require("../../base/module-manipulator-result");
const component_scope_executor_1 = require("../../execution/component-scope-executor");
/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
let IfManipulatorAttributeModule = class IfManipulatorAttributeModule {
    /**
     * Constructor.
     * @param pTargetTemplate - Target templat.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetTemplate, pValueHandler, pAttribute) {
        this.mTargetTemplate = pTargetTemplate;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
    }
    /**
     * Process module.
     * Execute attribute value and decide if template should be rendered.
     */
    onProcess() {
        const lExecutionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mAttribute.value, this.mValueHandler);
        // Add compare handler with depth 0. No need to check for inner values on boolean compare.
        this.mValueCompare = new web_change_detection_1.CompareHandler(lExecutionResult, 0);
        this.mBooleanExpression = this.mAttribute.value;
        // If in any way the execution result is true, add template to result.
        const lModuleResult = new module_manipulator_result_1.ModuleManipulatorResult();
        if (lExecutionResult) {
            lModuleResult.addElement(this.mTargetTemplate.clone(), new component_values_1.ComponentValues(this.mValueHandler));
        }
        return lModuleResult;
    }
    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    onUpdate() {
        const lListObject = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mBooleanExpression, this.mValueHandler);
        // Update if values are not same.
        return !this.mValueCompare.compare(lListObject);
    }
};
IfManipulatorAttributeModule = __decorate([
    (0, manipulator_attribute_module_1.ManipulatorAttributeModule)({
        accessType: attribute_module_access_type_1.AttributeModuleAccessType.Write,
        attributeSelector: /^\*pwbIf$/,
        forbiddenInManipulatorScopes: false,
        manipulatesAttributes: false
    }),
    __metadata("design:paramtypes", [core_xml_1.XmlElement, component_values_1.ComponentValues, core_xml_1.XmlAttribute])
], IfManipulatorAttributeModule);
exports.IfManipulatorAttributeModule = IfManipulatorAttributeModule;
//# sourceMappingURL=if-manipulator-attribute-module.js.map