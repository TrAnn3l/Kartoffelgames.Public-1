"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleStorage = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const core_xml_1 = require("@kartoffelgames/core.xml");
const component_handler_1 = require("../component_manager/component-handler");
const component_values_1 = require("../component_manager/component-values");
const module_type_1 = require("../enum/module-type");
class ModuleStorage {
    /**
     * Add all attribute modules to inner mapping.
     * @param pAttributeModuleList - List of attribute modules.
     */
    static addModule(pAttributeModule) {
        if (pAttributeModule.moduleType === module_type_1.ModuleType.Static) {
            ModuleStorage.mStaticModuleList.push(pAttributeModule);
        }
        else if (pAttributeModule.moduleType === module_type_1.ModuleType.Manipulator) {
            ModuleStorage.mManipulatorModuleList.push(pAttributeModule);
        }
        else if (pAttributeModule.moduleType === module_type_1.ModuleType.Expression) {
            ModuleStorage.mExpressionModuleList.push(pAttributeModule);
        }
    }
    /**
     * Check if template has a manipluator module.
     * @param pTemplate - Template element.
     */
    static checkTemplateIsManipulator(pTemplate) {
        // Get manipulator module from template and check if it exists.
        return typeof ModuleStorage.getManipulatorModuleConstructor(pTemplate) !== 'undefined';
    }
    /**
     * Get expression module for expression.
     * @param pTargetNode - Target. Element or text element.
     * @param pAttributeName - Attribute name. Null if on text element.
     * @param pValue - Expression.
     * @param pValueHandler - Value handler of current scope.
     * @param pComponentHandler - Component handler.
     * @returns build expression module.
     */
    static getExpressionModule(pExpressionModule, pTargetNode, pAttributeName, pValue, pValueHandler, pComponentHandler) {
        // Local injections for object creation.
        const lLocalInjections = new core_data_1.Dictionary();
        lLocalInjections.add(component_values_1.ComponentValues, pValueHandler);
        lLocalInjections.add(component_handler_1.ComponentHandler, pComponentHandler);
        // Create object.
        const lModule = core_dependency_injection_1.Injection.createObject(pExpressionModule, lLocalInjections);
        lModule.key = pAttributeName;
        lModule.value = pValue;
        lModule.targetNode = pTargetNode;
        return lModule;
    }
    /**
     * Get manipulator module from template element.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pComponentHandler - Component handler.
     */
    static getManipulatorModule(pTargetTemplate, pValues, pComponentHandler) {
        // Get module constructor.
        const lModuleConstructor = this.getManipulatorModuleConstructor(pTargetTemplate);
        // Return undefined if no constructor was found.
        if (typeof lModuleConstructor === 'undefined') {
            return undefined;
        }
        else {
            // Find attribute
            const lFoundAttribute = pTargetTemplate.attributeList.find(pAttribute => {
                return lModuleConstructor.attributeSelector.test(pAttribute.name);
            });
            // Check if attribute was found.
            if (typeof lFoundAttribute === 'undefined') {
                throw new core_data_1.Exception('No Attribute for processing found.', this);
            }
            // Check manipulation restriction.
            if (lModuleConstructor.isWriting && lModuleConstructor.manipulatesAttributes) {
                throw new core_data_1.Exception('Writing attibute modules can not manipulate the templates attributes.', this);
            }
            // Remove attribute from template. So no second process with this attribute is started.
            pTargetTemplate.removeAttribute(lFoundAttribute.name);
            // Local injections for object creation.
            const lLocalInjections = new core_data_1.Dictionary();
            lLocalInjections.add(core_xml_1.XmlElement, pTargetTemplate);
            lLocalInjections.add(component_values_1.ComponentValues, pValues);
            lLocalInjections.add(component_handler_1.ComponentHandler, pComponentHandler);
            lLocalInjections.add(core_xml_1.XmlAttribute, lFoundAttribute);
            // Create object.
            return core_dependency_injection_1.Injection.createObject(lModuleConstructor, lLocalInjections);
        }
    }
    /**
     * Get static module from template element.
     * @param pTargetElement - Html element the module should work with.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pAttribute - attribute wich module should be searched.
     * @param pComponentHandler - Component handler.
     * @param pAccessFilter - [OPTIONAL] Filter for access type.
     */
    static getStaticModule(pTargetElement, pTargetTemplate, pValues, pAttribute, pComponentHandler, pAccessFilter) {
        // Find modules that matches attribute.
        const lFindFn = (pModuleConstructor) => {
            // Check attribute and check if attribute matches module selector.
            const lModuleMatches = pModuleConstructor.attributeSelector.test(pAttribute.name);
            // Check for optional access filter.
            if (lModuleMatches && typeof pAccessFilter !== 'undefined') {
                return pModuleConstructor.accessType === pAccessFilter;
            }
            else {
                return lModuleMatches;
            }
        };
        // Find static module.
        const lModuleConstructor = ModuleStorage.mStaticModuleList.find(lFindFn);
        // Return undefined if no constructor was found.
        if (typeof lModuleConstructor === 'undefined') {
            return undefined;
        }
        else {
            // Remove attribute from template. So no second process with this attribute is started.
            pTargetTemplate.removeAttribute(pAttribute.name);
            // Check manipulation restriction.
            if (lModuleConstructor.isWriting && lModuleConstructor.manipulatesAttributes) {
                throw new core_data_1.Exception('Writing attibute modules can not manipulate the templates attributes.', this);
            }
            // Local injections for object creation.
            const lLocalInjections = new core_data_1.Dictionary();
            lLocalInjections.add(core_xml_1.XmlElement, pTargetTemplate);
            lLocalInjections.add(component_values_1.ComponentValues, pValues);
            lLocalInjections.add(component_handler_1.ComponentHandler, pComponentHandler);
            lLocalInjections.add(Element, pTargetElement);
            lLocalInjections.add(core_xml_1.XmlAttribute, pAttribute);
            // Create module.
            return core_dependency_injection_1.Injection.createObject(lModuleConstructor, lLocalInjections);
        }
    }
    /**
     * Get manipulator module constructor from template element.
     * @param pTemplate - Template element.
     */
    static getManipulatorModuleConstructor(pTemplate) {
        // Find modules that matches attribute.
        const lFindFn = (pModuleConstructor) => {
            // Check all attributes and check if attribute matches module selector.
            for (const lAttribute of pTemplate.attributeList) {
                if (pModuleConstructor.attributeSelector.test(lAttribute.name)) {
                    return true;
                }
            }
            return false;
        };
        // Find manipulator module.
        return ModuleStorage.mManipulatorModuleList.find(lFindFn);
    }
}
exports.ModuleStorage = ModuleStorage;
ModuleStorage.mExpressionModuleList = new Array();
ModuleStorage.mManipulatorModuleList = new Array();
ModuleStorage.mStaticModuleList = new Array();
//# sourceMappingURL=module-storage.js.map