"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticBuilder = void 0;
const base_builder_1 = require("./base-builder");
const manipulator_builder_1 = require("./manipulator-builder");
const core_data_1 = require("@kartoffelgames/core.data");
const core_xml_1 = require("@kartoffelgames/core.xml");
const component_values_1 = require("../component-values");
const element_creator_1 = require("../content/element-creator");
const attribute_module_access_type_1 = require("../../enum/attribute-module-access-type");
class StaticBuilder extends base_builder_1.BaseBuilder {
    /**
     * Build handler that handles initialisation and update of template.
     * @param pTemplates - Templates that the component builder needs to build.
     * @param pAttributeModules - All attributes of component.
     * @param pParentComponentValues - Parents component values.
     * @param pManipulatorScope - If builder is inside an manipulator scope.
     */
    constructor(pTemplates, pAttributeModules, pParentComponentValues, pComponentHandler, pManipulatorScope) {
        super(pTemplates, pAttributeModules, new component_values_1.ComponentValues(pParentComponentValues), pComponentHandler, pManipulatorScope);
    }
    /**
     * Initialize build.
     * Initializes builder in content after this function.
     */
    initialize() {
        this.buildContentFrame(null, this.contentManager.template);
        // Create temporary templates for execution.
        const lBufferTemplates = new core_data_1.Dictionary();
        // Execute all none manipulative modules.
        let lAttributeChanged = true;
        let lIterations = 0;
        while (lAttributeChanged) {
            if (++lIterations > 20) {
                throw new core_data_1.Exception('To many module iteration. Check for attribute manipulation loops or to many attributes.', this);
            }
            // Execute all read modules and restart execution chain if any module has manipulated templates attributes.
            if (this.deepExecuteTemplateModules(null, lBufferTemplates, attribute_module_access_type_1.AttributeModuleAccessType.Write)) {
                continue;
            }
            // Execute all read/write modules and restart execution chain if any module has manipulated templates attributes.
            if (this.deepExecuteTemplateModules(null, lBufferTemplates, attribute_module_access_type_1.AttributeModuleAccessType.ReadWrite)) {
                continue;
            }
            // Execute all writing modules.  No restart needed. Writing modules can not manipulate attributes.
            this.deepExecuteTemplateModules(null, lBufferTemplates, attribute_module_access_type_1.AttributeModuleAccessType.Read);
            lAttributeChanged = false;
        }
        // Add all none module attributes and texts
        this.deepAddNativeData(null, lBufferTemplates);
    }
    /**
     * Update all template elements that are affected by the property change.
     */
    update() {
        // Get all modules that are currently used. Sort by module write , read/write, read.
        let lStaticModule = this.contentManager.linkedStaticModules;
        lStaticModule = lStaticModule.sort((pA, pB) => {
            const lConstructorA = pA.constructor;
            const lConstructorB = pB.constructor;
            if (lConstructorA.isWriting && lConstructorB.isReading) {
                return -1;
            }
            return 0;
        });
        let lAnyUpdateWasMade = false;
        // Update all modules. Result doesn't matter should allways be false.
        for (const lModule of lStaticModule) {
            if (lModule.update()) {
                lAnyUpdateWasMade = true;
            }
        }
        // Get all used expression modules. Those have always low priority. No need to sort.
        const lExpressionModules = this.contentManager.linkedExpressionModules;
        for (const lModule of lExpressionModules) {
            if (lModule.update()) {
                lAnyUpdateWasMade = true;
            }
        }
        return lAnyUpdateWasMade;
    }
    addNativeData(pNode, pTemplate) {
        if (pNode instanceof Element) {
            // For each xml attribute.
            for (const lAttribute of pTemplate.attributeList) {
                // Get expression module and process.
                const lExpressionModule = this.contentManager.attributeModules.getExpressionModule(pNode, lAttribute.name, lAttribute.value, this.values, this.componentHandler);
                const lHadExpression = lExpressionModule.process();
                // Link module and element if attribute had any expression.
                if (lHadExpression) {
                    this.contentManager.linkModule(pNode, lExpressionModule);
                }
            }
        }
        else if (pNode instanceof Text) {
            // Use original because it does not get altered.
            const lOriginalTemplate = this.contentManager.getTemplateByContent(pNode);
            // Get expression module and process.
            const lExpressionModule = this.contentManager.attributeModules.getExpressionModule(pNode, null, lOriginalTemplate.text, this.values, this.componentHandler);
            const lHadExpression = lExpressionModule.process();
            // Link module and element if text had any expression.
            if (lHadExpression) {
                this.contentManager.linkModule(pNode, lExpressionModule);
            }
        }
    }
    /**
     * Recursion.
     * Build content frames. HTMLElements without parameter.
     * Custom elements will be created as correct elements.
     * @param pParentHtmlElement - Parent element of template.
     * @param pTemplate - Template element that should be build.
     */
    buildContentFrame(pParentHtmlElement, pTemplate) {
        // For each template node inside template.
        for (const lTemplateNode of pTemplate) {
            // Check template type.
            if (lTemplateNode instanceof core_xml_1.TextNode) {
                // Create and add empt text node mustache expression is executed later.
                const lTextNode = element_creator_1.ElementCreator.createText('');
                this.contentManager.appendContent(pParentHtmlElement, lTextNode, lTemplateNode);
            }
            else if (lTemplateNode instanceof core_xml_1.XmlElement) {
                // Check if template element is manipulator or not.
                if (this.contentManager.attributeModules.checkTemplateIsManipulator(lTemplateNode)) {
                    // Create new component builder and add to content.
                    const lManipulatorBuilder = new manipulator_builder_1.ManipulatorBuilder(lTemplateNode, this.contentManager.attributeModules, this.values, this.componentHandler);
                    this.contentManager.appendContent(pParentHtmlElement, lManipulatorBuilder, lTemplateNode);
                }
                else {
                    // Try to get potential parent if no real parent is specified.
                    const lFutureparent = pParentHtmlElement ?? this.contentManager.getLastElement().parentElement;
                    // Create HTMLElement or custom element.
                    const lCreatedHtmlElement = element_creator_1.ElementCreator.createElement(lTemplateNode, lFutureparent);
                    // Append element to component content.
                    this.contentManager.appendContent(pParentHtmlElement, lCreatedHtmlElement, lTemplateNode);
                    // Add all childs to this element
                    this.buildContentFrame(lCreatedHtmlElement, lTemplateNode.childList);
                }
            }
        }
    }
    /**
     * Add all Attributes and TextNodes and execute all expressions that are inside texts.
     * @param pParentElement - Parent element which child are checked expressions and executes.
     * @param pBufferTemplates - Buffer with current executed modules.
     */
    deepAddNativeData(pParentElement, pBufferTemplates) {
        const lChildList = this.contentManager.getChildList(pParentElement);
        // For each child.
        for (const lChild of lChildList) {
            if (lChild instanceof Element) {
                // All buffer templates should be initalised. So no check for undefined.
                const lBufferTemplate = pBufferTemplates.get(lChild);
                // Add all native data to child.
                this.addNativeData(lChild, lBufferTemplate);
                // Add attributes and texts for all childs.
                this.deepAddNativeData(lChild, pBufferTemplates);
            }
            else if (lChild instanceof Text) {
                this.addNativeData(lChild);
            }
        }
    }
    /**
     * Executes all modules of parents childs.
     * Updates buffer templates.
     * Returns if any module manipulates the templates attributes.
     * @param pParentElement - Parent element which child are checked for modules and executes.
     * @param pBufferTemplates - Buffer with current executed modules.
     * @param pAccessFilter - [OPTIONAL] Execute only modules which has the specified accessor type.
     */
    deepExecuteTemplateModules(pParentElement, pBufferTemplates, pAccessFilter) {
        const lChildList = this.contentManager.getChildList(pParentElement);
        let lModuleWasExecuted = false;
        // For each child.
        for (const lChild of lChildList) {
            // Only html elements.
            if (lChild instanceof Element) {
                // Try to get current buffer template.
                let lBufferTemplate = pBufferTemplates.get(lChild);
                if (typeof lBufferTemplate === 'undefined') {
                    // Get clone of template element.
                    lBufferTemplate = this.contentManager.getTemplateByContent(lChild).clone();
                    pBufferTemplates.add(lChild, lBufferTemplate);
                }
                // Execute all modules of child with set access type.
                if (this.executeTemplateModules(lChild, lBufferTemplate, pAccessFilter)) {
                    lModuleWasExecuted = true;
                }
                // Execute all modules for child childs
                if (this.deepExecuteTemplateModules(lChild, pBufferTemplates, pAccessFilter)) {
                    lModuleWasExecuted = true;
                }
            }
        }
        return lModuleWasExecuted;
    }
    /**
     * Executes module, add rebuild trigger and link module with element.
     * @param pModule - Static module.
     * @param pElement -Element of module.
     */
    executeModule(pModule, pTargetElement) {
        const lModuleConstructor = pModule.constructor;
        // Check if module is allowd in current scope.
        if (this.inManipulatorScope && lModuleConstructor.forbiddenInManipulatorScopes) {
            throw new core_data_1.Exception(`Module ${lModuleConstructor.attributeSelector.source} is forbidden inside manipulator scopes.`, this);
        }
        // Execute module. No useable result. 
        pModule.process();
        // Map module with build child.
        this.contentManager.linkModule(pTargetElement, pModule);
        // Check if module manipulates templates attributes.
        return lModuleConstructor.manipulatesAttributes;
    }
    /**
     * Execute all modules of template for element of specified access type.
     * @param pElement - Element for which all modules should be executed.
     * @param pTemplate - Template element of element.
     * @param pModuleFilter - Filter for modules access types.
     */
    executeTemplateModules(pElement, pTemplate, pModuleFilter) {
        let lManipulatedAttributes = false;
        // For each xml attribute.
        for (const lAttribute of pTemplate.attributeList) {
            // Find attribute module for attribute.
            const lAttributeModule = this.contentManager.attributeModules.getStaticModule(pElement, pTemplate, this.values, lAttribute, this.componentHandler, pModuleFilter);
            // Check if module exists for attribute.
            if (typeof lAttributeModule !== 'undefined') {
                // Check if module manipulates templates attributes.
                if (this.executeModule(lAttributeModule, pElement)) {
                    lManipulatedAttributes = true;
                }
            }
        }
        return lManipulatedAttributes;
    }
}
exports.StaticBuilder = StaticBuilder;
//# sourceMappingURL=static-builder.js.map