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
exports.ForOfManipulatorAttributeModule = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const component_values_1 = require("../../../component/component-values");
const module_manipulator_result_1 = require("../../base/module-manipulator-result");
const component_scope_executor_1 = require("../../execution/component-scope-executor");
const core_xml_1 = require("@kartoffelgames/core.xml");
const manipulator_attribute_module_1 = require("../../../decorator/manipulator-attribute-module");
const attribute_module_access_type_1 = require("../../../enum/attribute-module-access-type");
/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] in [List] (;[CustomIndexName] = index)?"
 */
let ForOfManipulatorAttributeModule = class ForOfManipulatorAttributeModule {
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
        // [CustomName:1] in [List value:2] (;[CustomIndexName:4]=[Index calculating with "index" as key:5])?
        const lRegexAttributeInformation = new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/);
        // Get information from attribute value.
        const lAttributeInformation = lRegexAttributeInformation.exec(this.mAttribute.value);
        // If attribute value does not match regex.
        if (lAttributeInformation) {
            // Create module result that watches for changes in [PropertyName].
            const lModuleResult = new module_manipulator_result_1.ModuleManipulatorResult();
            // Try to get list object from component values.
            const lListObject = component_scope_executor_1.ComponentScopeExecutor.executeSilent(lAttributeInformation[2], this.mValueHandler);
            // Save values for later update check.
            this.mValueCompare = new web_change_detection_1.CompareHandler(lListObject, 4);
            this.mListExpression = lAttributeInformation[2];
            // Only proceed if value is added to html element.
            if (typeof lListObject === 'object' && lListObject !== null || Array.isArray(lListObject)) {
                // Add template for element function.
                const lAddTempateForElement = (pObjectValue, pObjectKey) => {
                    const lClonedTemplate = this.mTargetTemplate.clone();
                    const lComponentValues = new component_values_1.ComponentValues(this.mValueHandler);
                    lComponentValues.setTemporaryValue(lAttributeInformation[1], pObjectValue);
                    // If custom index is used.
                    if (lAttributeInformation[4]) {
                        // Add index key as extenal value to execution.
                        const lExternalValues = new core_data_1.Dictionary();
                        lExternalValues.add('$index', pObjectKey);
                        // Execute index expression
                        const lIndexExpressionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(lAttributeInformation[5], lComponentValues, lExternalValues);
                        // Set custom index name as temporary value.
                        lComponentValues.setTemporaryValue(lAttributeInformation[4], lIndexExpressionResult);
                    }
                    // Add element.
                    lModuleResult.addElement(lClonedTemplate, lComponentValues);
                };
                // For array loop for arrays and for-in for objects.
                if (Array.isArray(lListObject)) {
                    for (let lIndex = 0; lIndex < lListObject.length; lIndex++) {
                        lAddTempateForElement(lListObject[lIndex], lIndex);
                    }
                }
                else {
                    for (const lListObjectKey in lListObject) {
                        lAddTempateForElement(lListObject[lListObjectKey], lListObjectKey);
                    }
                }
            }
            // Else: Just ignore. Can be changed later.
            // Return module result.
            return lModuleResult;
        }
        else {
            throw new core_data_1.Exception(`pwbFor-Paramater value has wrong format: ${this.mAttribute.value.toString()}`, this);
        }
    }
    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    onUpdate() {
        const lListObject = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mListExpression, this.mValueHandler);
        // Update if values are not same.
        return !this.mValueCompare.compare(lListObject);
    }
};
ForOfManipulatorAttributeModule = __decorate([
    (0, manipulator_attribute_module_1.ManipulatorAttributeModule)({
        accessType: attribute_module_access_type_1.AttributeModuleAccessType.Write,
        attributeSelector: /^\*pwbFor$/,
        forbiddenInManipulatorScopes: false,
        manipulatesAttributes: false
    }),
    __metadata("design:paramtypes", [core_xml_1.XmlElement, component_values_1.ComponentValues, core_xml_1.XmlAttribute])
], ForOfManipulatorAttributeModule);
exports.ForOfManipulatorAttributeModule = ForOfManipulatorAttributeModule;
//# sourceMappingURL=for-of-manipulator-attribute-module.js.map