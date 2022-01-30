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
exports.SlotAttributeModule = void 0;
const core_xml_1 = require("@kartoffelgames/core.xml");
const component_values_1 = require("../../../component_manager/component-values");
const manipulator_attribute_module_1 = require("../../../decorator/manipulator-attribute-module");
const attribute_module_access_type_1 = require("../../../enum/attribute-module-access-type");
const module_manipulator_result_1 = require("../../base/module-manipulator-result");
let SlotAttributeModule = class SlotAttributeModule {
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
     */
    onProcess() {
        // Get name of slot. Remove starting $.
        const lSlotName = this.mAttribute.name.substr(1);
        // Add slot name to valid slot names.
        this.mValueHandler.validSlotNameList.push(lSlotName);
        // Clone currrent template element.
        const lClone = this.mTargetTemplate.clone();
        // Create slot element
        const lSlotElement = new core_xml_1.XmlElement();
        lSlotElement.tagName = 'slot';
        lSlotElement.setAttribute('name', lSlotName);
        // Add slot to element.
        lClone.appendChild(lSlotElement);
        // Create result.
        const lResult = new module_manipulator_result_1.ModuleManipulatorResult();
        lResult.addElement(lClone, new component_values_1.ComponentValues(this.mValueHandler));
        return lResult;
    }
};
SlotAttributeModule = __decorate([
    (0, manipulator_attribute_module_1.ManipulatorAttributeModule)({
        accessType: attribute_module_access_type_1.AttributeModuleAccessType.Write,
        attributeSelector: /^\$[\w]+$/,
        forbiddenInManipulatorScopes: true,
        manipulatesAttributes: false
    }),
    __metadata("design:paramtypes", [core_xml_1.XmlElement, component_values_1.ComponentValues, core_xml_1.XmlAttribute])
], SlotAttributeModule);
exports.SlotAttributeModule = SlotAttributeModule;
//# sourceMappingURL=slot-attribute-module.js.map