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
exports.IdChildAttributeModule = void 0;
const core_xml_1 = require("@kartoffelgames/core.xml");
const component_manager_1 = require("../../../component/component-manager");
const component_values_1 = require("../../../component/component-values");
const static_attribute_module_1 = require("../../../decorator/static-attribute-module");
const attribute_module_access_type_1 = require("../../../enum/attribute-module-access-type");
/**
 * Used with "#IdChildName" like => #PasswordInput.
 */
let IdChildAttributeModule = class IdChildAttributeModule {
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
     * Process module and add current html to id childs.
     */
    onProcess() {
        const lRegistedElement = this.mComponentHandler.changeDetection.registerObject(this.mTargetElement);
        // Add current html element to temporary root values. Delete starting #.
        this.mValueHandler.setTemporaryValue(this.mAttribute.qualifiedName.substr(1), lRegistedElement, true);
    }
};
IdChildAttributeModule = __decorate([
    (0, static_attribute_module_1.StaticAttributeModule)({
        accessType: attribute_module_access_type_1.AttributeModuleAccessType.Write,
        forbiddenInManipulatorScopes: true,
        manipulatesAttributes: false,
        attributeSelector: /^#[[\w$]+$/
    }),
    __metadata("design:paramtypes", [Element, component_values_1.ComponentValues, core_xml_1.XmlAttribute, component_manager_1.ComponentManager])
], IdChildAttributeModule);
exports.IdChildAttributeModule = IdChildAttributeModule;
//# sourceMappingURL=id-child-attribute-module.js.map