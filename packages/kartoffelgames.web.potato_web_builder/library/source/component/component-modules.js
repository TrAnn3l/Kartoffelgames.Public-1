"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentModules = void 0;
const mustache_expression_module_1 = require("../module/default/mustache-expression-module");
const module_storage_1 = require("../module/module-storage");
// Import default modules
require("../module/default/attribute_module/event-attribute-module");
require("../module/default/attribute_module/for-of-manipulator-attribute-module");
require("../module/default/attribute_module/id-child-attribute-module");
require("../module/default/attribute_module/if-manipulator-attribute-module");
require("../module/default/attribute_module/one-way-binding-attribute-module");
require("../module/default/attribute_module/slot-attribute-module");
require("../module/default/attribute_module/two-way-binding-attribute-module");
/**
 * Map attributes modules for finding modules for attributes.
 */
class ComponentModules {
    /**
     * Constructor.
     * Build attribute module for mapping and finding module for attributes.
     */
    constructor(pExpressionModule) {
        this.mExpressionModule = pExpressionModule ?? mustache_expression_module_1.MustacheExpressionModule;
    }
    /**
     * Check if template has a manipluator module.
     * @param pTemplate - Template element.
     */
    checkTemplateIsManipulator(pTemplate) {
        return module_storage_1.ModuleStorage.checkTemplateIsManipulator(pTemplate);
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
    getExpressionModule(pTargetNode, pAttributeName, pValue, pValueHandler, pComponentHandler) {
        return module_storage_1.ModuleStorage.getExpressionModule(this.mExpressionModule, pTargetNode, pAttributeName, pValue, pValueHandler, pComponentHandler);
    }
    /**
     * Get manipulator module from template element.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pComponentHandler - Component handler.
     */
    getManipulatorModule(pTargetTemplate, pValues, pComponentHandler) {
        return module_storage_1.ModuleStorage.getManipulatorModule(pTargetTemplate, pValues, pComponentHandler);
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
    getStaticModule(pTargetElement, pTargetTemplate, pValues, pAttribute, pComponentHandler, pAccessFilter) {
        return module_storage_1.ModuleStorage.getStaticModule(pTargetElement, pTargetTemplate, pValues, pAttribute, pComponentHandler, pAccessFilter);
    }
}
exports.ComponentModules = ComponentModules;
//# sourceMappingURL=component-modules.js.map