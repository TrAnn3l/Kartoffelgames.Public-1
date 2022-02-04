"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentContent = void 0;
const base_builder_1 = require("../builder/base-builder");
const core_data_1 = require("@kartoffelgames/core.data");
/**
 * Component content handler.
 * Handles relations between element, builders, templates and modules.
 */
class ComponentContent {
    /**
     * Content data of the component.
     * COntains data for field binding.
     * @param pTemplate - XML-Template.
     * @param pAttributeModules - Attribute modules of component.
     */
    constructor(pTemplate) {
        // Initialize defaults
        this.mTemplate = pTemplate;
        // Initialize lists.
        this.mTemplateToContent = new core_data_1.Dictionary();
        this.mParentContentToChildContent = new core_data_1.Dictionary();
        this.mContentBuilder = new core_data_1.List();
        this.mElementsExpressionModules = new core_data_1.Dictionary();
        this.mElementsStaticAttributeModules = new core_data_1.Dictionary();
        this.mContentToTemplate = new core_data_1.Dictionary();
        this.mChildContentToParentContent = new core_data_1.Dictionary();
    }
    /**
     * Get all different content scopes as build handler.
     */
    get contentBuilder() {
        return core_data_1.List.newListWith(...this.mContentBuilder);
    }
    /**
     * Get current used manipulator module.
     */
    get manipulatorModule() {
        return this.mManipulatorModule;
    }
    /**
     * Set current used manipulator module.
     */
    set manipulatorModule(pValue) {
        this.mManipulatorModule = pValue;
    }
    /**
     * Template of content scope.
     */
    get template() {
        return this.mTemplate;
    }
    /**
     * Get all linked static modules of all elements..
     */
    get linkedStaticModules() {
        const lResultArray = new Array();
        // Merge all modules into result array.
        for (const lModuleList of this.mElementsStaticAttributeModules) {
            lResultArray.push(...lModuleList[1]);
        }
        return lResultArray;
    }
    /**
     * Get all linked expression modules of all elements.
     */
    get linkedExpressionModules() {
        const lResultArray = new Array();
        // Merge all modules into result array.
        for (const lModuleList of this.mElementsExpressionModules) {
            lResultArray.push(...lModuleList[1]);
        }
        return lResultArray;
    }
    /**
     * Get root content list.
     */
    get contentList() {
        const lRootChilds = this.mParentContentToChildContent.get(null);
        return core_data_1.List.newListWith(...(lRootChilds ?? new Array()));
    }
    /**
     * Add child to content.
     * @param pParentElement - Parent element of child. If parent is the content scope root, use null.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    appendContent(pParentElement, pChildElement, pChildTemplate) {
        // Create new child list on parent if parent was not already initialized.
        if (!this.mParentContentToChildContent.has(pParentElement)) {
            this.mParentContentToChildContent.add(pParentElement, new core_data_1.List());
        }
        // Bind parent, template and child information.
        this.mChildContentToParentContent.add(pChildElement, pParentElement);
        this.mParentContentToChildContent.get(pParentElement).push(pChildElement);
        this.mTemplateToContent.add(pChildTemplate, pChildElement);
        this.mContentToTemplate.add(pChildElement, pChildTemplate);
        // Always add builder to builder list.
        if (pChildElement instanceof base_builder_1.BaseBuilder) {
            this.mContentBuilder.push(pChildElement);
        }
    }
    /**
     * Add child after refered content.
     * @param pReferenceContent - Refered content. Child gets append after this content.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    appendContentAfter(pReferenceContent, pChildElement, pChildTemplate) {
        const lParentElement = this.mChildContentToParentContent.get(pReferenceContent);
        // Create new child list on parent if parent was not already initialized.
        if (!this.mParentContentToChildContent.has(lParentElement)) {
            this.mParentContentToChildContent.add(lParentElement, new core_data_1.List());
        }
        // Bind parent, template and child information.
        this.mChildContentToParentContent.add(pChildElement, lParentElement);
        this.mTemplateToContent.add(pChildTemplate, pChildElement);
        this.mContentToTemplate.add(pChildElement, pChildTemplate);
        // Find index of referenced content inside parent of referenced content.
        const lParentElementChilds = this.mParentContentToChildContent.get(lParentElement);
        const lReferenceContentIndex = lParentElementChilds.indexOf(pReferenceContent);
        // Add element after reference content.
        lParentElementChilds.splice(lReferenceContentIndex + 1, 0, pChildElement);
        // Always add builder to builder list.
        if (pChildElement instanceof base_builder_1.BaseBuilder) {
            this.mContentBuilder.push(pChildElement);
        }
    }
    /**
     * Get childs of parent.
     * Null for content root.
     * @param pParent - Parent of childs.
     */
    getChildList(pParent) {
        const lChild = this.mParentContentToChildContent.get(pParent);
        if (typeof lChild !== 'undefined') {
            return core_data_1.List.newListWith(...lChild);
        }
        else {
            return new Array();
        }
    }
    /**
     * Get node that was build from specified template.
     * @param pTemplate - Template node.
     */
    getContentByTemplate(pTemplate) {
        return this.mTemplateToContent.get(pTemplate);
    }
    /**
     * Get all static modules the set element has used.
     * @param pElement - Element or TextElement with attached modules.
     */
    getLinkedExpressionModules(pElement) {
        return this.mElementsExpressionModules.getOrDefault(pElement, core_data_1.List.newListWith());
    }
    /**
     * Get all static modules the set element has used.
     * @param pElement - Element with attached modules.
     */
    getLinkedStaticModules(pElement) {
        return this.mElementsStaticAttributeModules.getOrDefault(pElement, core_data_1.List.newListWith());
    }
    getTemplateByContent(pNode) {
        // Can never be someting else.
        return this.mContentToTemplate.get(pNode);
    }
    /**
     * Add executed expression module to html element or text element.
     * @param pElement - Html element or text element.
     * @param pModule - htmle static attribute module.
     */
    linkExpressionModule(pElement, pModule) {
        // Initialize list.
        if (!this.mElementsExpressionModules.has(pElement)) {
            this.mElementsExpressionModules.add(pElement, new core_data_1.List());
        }
        // Get current mapped module list reference.
        const lModuleList = this.mElementsExpressionModules.get(pElement);
        // Check if module does already exists.
        if (!lModuleList.includes(pModule)) {
            lModuleList.push(pModule);
        }
        else {
            throw new core_data_1.Exception('Module is already linked with this Element.', this);
        }
    }
    /**
     * Add executed static module to html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    linkStaticModule(pElement, pModule) {
        // Initialize list.
        if (!this.mElementsStaticAttributeModules.has(pElement)) {
            this.mElementsStaticAttributeModules.add(pElement, new core_data_1.List());
        }
        // Get current mapped module list reference.
        const lModuleList = this.mElementsStaticAttributeModules.get(pElement);
        // Check if module does already exists.
        if (!lModuleList.includes(pModule)) {
            lModuleList.push(pModule);
        }
        else {
            throw new core_data_1.Exception('Module is already linked with this Element.', this);
        }
    }
    /**
     * Add child at start of parent.
     * Prepends child to parent.
     * @param pParentElement - Parent element of child. If parent is the content scope root, use null.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    prependContent(pParentElement, pChildElement, pChildTemplate) {
        // Create new child list on parent if parent was not already initialized.
        if (!this.mParentContentToChildContent.has(pParentElement)) {
            this.mParentContentToChildContent.add(pParentElement, new core_data_1.List());
        }
        // Bind parent, template and child information.
        this.mChildContentToParentContent.add(pChildElement, pParentElement);
        this.mTemplateToContent.add(pChildTemplate, pChildElement);
        this.mContentToTemplate.add(pChildElement, pChildTemplate);
        // Add element at start of parent.
        this.mParentContentToChildContent.get(pParentElement).splice(0, 0, pChildElement);
        // Always add builder to builder list.
        if (pChildElement instanceof base_builder_1.BaseBuilder) {
            this.mContentBuilder.push(pChildElement);
        }
    }
    /**
     * Remove child from content.
     * @param pElement - Element
     */
    removeContent(pElement) {
        const lParentElement = this.mChildContentToParentContent.get(pElement);
        const lTemplate = this.mContentToTemplate.get(pElement);
        // Bind parent, template and child information.
        this.mParentContentToChildContent.get(lParentElement).remove(pElement);
        this.mTemplateToContent.delete(lTemplate);
        this.mContentToTemplate.delete(pElement);
        if (pElement instanceof base_builder_1.BaseBuilder) {
            // Always remove builder from builder list.
            this.mContentBuilder.remove(pElement);
        }
        else if (pElement instanceof Element) {
            // Remove all linked modules.
            this.mElementsStaticAttributeModules.delete(pElement);
            this.mElementsExpressionModules.delete(pElement);
        }
        else if (pElement instanceof Text) {
            this.mElementsExpressionModules.delete(pElement);
        }
    }
    /**
     * Remove module from html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    unlinkExpressionModule(pElement, pModule) {
        // Check if element has modules.
        if (this.mElementsExpressionModules.has(pElement)) {
            const lModuleList = this.mElementsExpressionModules.get(pElement);
            // Remove module from list.
            lModuleList.remove(pModule);
        }
    }
    /**
     * Remove module from html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    unlinkStaticModule(pElement, pModule) {
        // Check if element has modules.
        if (this.mElementsStaticAttributeModules.has(pElement)) {
            const lModuleList = this.mElementsStaticAttributeModules.get(pElement);
            // Remove module from list.
            lModuleList.remove(pModule);
        }
    }
}
exports.ComponentContent = ComponentContent;
//# sourceMappingURL=component-content.js.map