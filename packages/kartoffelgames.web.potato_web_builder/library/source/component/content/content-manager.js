"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentManager = void 0;
const core_xml_1 = require("@kartoffelgames/core.xml");
const module_type_1 = require("../../enum/module-type");
const base_builder_1 = require("../builder/base-builder");
const component_content_1 = require("./component-content");
const element_creator_1 = require("./element-creator");
const component_connection_1 = require("../component-connection");
class ContentManager {
    /**
     * Manages content of component.
     * @param pTemplate - XML-Template.
     * @param pAttributeModules - Attribute modules of component.
     */
    constructor(pTemplate, pAttributeModules) {
        this.mAttributeModules = pAttributeModules;
        this.mComponentContent = new component_content_1.ComponentContent(pTemplate);
        this.mInitialized = false;
        // Generate comment with random hex value as string.
        this.mContentAnchor = element_creator_1.ElementCreator.createComment(Math.random().toString(16).substring(3).toUpperCase());
    }
    /**
     * Get elements content anchor if element renders no nodes.
     */
    get anchor() {
        return this.mContentAnchor;
    }
    /**
     * Get component attribute modules.
     */
    get attributeModules() {
        return this.mAttributeModules;
    }
    /**
     * If manager is initialized.
     */
    get initialized() {
        return this.mInitialized;
    }
    /**
     * Get all linked expressions modules of all elements..
     */
    get linkedExpressionModules() {
        return this.mComponentContent.linkedExpressionModules;
    }
    /**
     * Get all linked static modules of all elements..
     */
    get linkedStaticModules() {
        return this.mComponentContent.linkedStaticModules;
    }
    /**
     * Get current used manipulator module.
     */
    get manipulatorModule() {
        return this.mComponentContent.manipulatorModule;
    }
    /**
     * Set current used manipulator module.
     */
    set manipulatorModule(pValue) {
        this.mComponentContent.manipulatorModule = pValue;
    }
    /**
     * Get contents template
     */
    get template() {
        return this.mComponentContent.template;
    }
    /**
     * Add child to content.
     * Appends child to parent.
     * @param pParentElement - Parent element of child. If parent is the content scope root, use null.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    appendContent(pParentElement, pChildElement, pChildTemplate) {
        // Register content.
        this.mComponentContent.appendContent(pParentElement, pChildElement, pChildTemplate);
        // Do not add the child to any element if the parent is the content scope root.
        if (pParentElement === null && this.initialized) {
            // Find last element in content scope and insert child after.
            const lLastElement = this.getLastElement();
            this.insertAfter(lLastElement, pChildElement, pChildTemplate);
        }
        else if (pParentElement !== null) {
            let lContent = (pChildElement instanceof base_builder_1.BaseBuilder) ? pChildElement.anchor : pChildElement;
            // Parse node to sloted node.
            if ('componentHandler' in pParentElement) {
                lContent = this.parseNodeToSloted(pParentElement, lContent, pChildTemplate);
            }
            pParentElement.appendChild(lContent);
        }
    }
    /**
     * Add child after refered content.
     * @param pReferenceContent - Refered content. Child gets append after this content.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    appendContentAfter(pReferenceContent, pChildElement, pChildTemplate) {
        // Register content.
        this.mComponentContent.appendContentAfter(pReferenceContent, pChildElement, pChildTemplate);
        let lContent = (pChildElement instanceof base_builder_1.BaseBuilder) ? pChildElement.anchor : pChildElement;
        // Parse node to sloted node.
        if (!(pReferenceContent instanceof base_builder_1.BaseBuilder) && 'componentHandler' in pReferenceContent.parentNode) {
            lContent = this.parseNodeToSloted(pReferenceContent.parentNode, lContent, pChildTemplate);
        }
        this.insertAfter(pReferenceContent, lContent, pChildTemplate);
    }
    /**
     * Clear all content of manager.
     */
    clearContent() {
        // Get root childs.
        const lChildList = this.mComponentContent.getChildList(null);
        // Cleanup all elements.
        for (const lChild of lChildList) {
            if (lChild instanceof Element) {
                this.cleanElement(lChild);
            }
            else if (lChild instanceof base_builder_1.BaseBuilder) {
                lChild.deleteBuild();
            }
            this.mComponentContent.removeContent(lChild);
        }
        // Remove last content anchor.
        this.anchor.remove();
    }
    /**
     * Get childs of parent.
     * Null for content root.
     * @param pParent - Parent of childs.
     */
    getChildList(pParentElement) {
        return this.mComponentContent.getChildList(pParentElement);
    }
    /**
     * Get content that was build from specified template.
     * @param pTemplate - Template node.
     */
    getContentByTemplate(pTemplate) {
        return this.mComponentContent.getContentByTemplate(pTemplate);
    }
    /**
     * Get last element of content scope.
     */
    getLastElement() {
        const lContentList = this.mComponentContent.contentList;
        if (lContentList.length === 0) {
            // Return anchor if builder has no content.
            return this.anchor;
        }
        else {
            const lLastContent = lContentList[lContentList.length - 1];
            // Try to get last child of builder.
            if (lLastContent instanceof base_builder_1.BaseBuilder) {
                // Return last content of builder.
                return lLastContent.contentManager.getLastElement();
            }
            else {
                return lLastContent;
            }
        }
    }
    getTemplateByContent(pNode) {
        return this.mComponentContent.getTemplateByContent(pNode);
    }
    /**
     * Initialize all uninitialized content.
     */
    initializeContent() {
        // Do not initialize childs if already append.
        if (!this.mInitialized) {
            // Get all root childs of content scope.
            const lRootChildList = this.mComponentContent.getChildList(null);
            let lLastAppendChild = this.anchor;
            // Add elements after comment.
            for (const lRootChild of lRootChildList) {
                // Get contentAnchor as node if child is component handler.
                const lRootChildNode = (lRootChild instanceof base_builder_1.BaseBuilder) ? lRootChild.anchor : lRootChild;
                const lRootChildTemplate = this.mComponentContent.getTemplateByContent(lRootChild);
                this.insertAfter(lLastAppendChild, lRootChildNode, lRootChildTemplate);
                lLastAppendChild = lRootChildNode;
            }
            this.mInitialized = true;
        }
        // Initialize all build handler.
        for (const lBuildHandler of this.mComponentContent.contentBuilder) {
            // Only initialize uninitialized builder.
            if (!lBuildHandler.initialized) {
                lBuildHandler.initializeBuild();
            }
        }
    }
    linkModule(pElement, pModule) {
        const lModuleConstructor = pModule.constructor;
        if (lModuleConstructor.moduleType === module_type_1.ModuleType.Static) {
            this.mComponentContent.linkStaticModule(pElement, pModule);
        }
        else if (lModuleConstructor.moduleType === module_type_1.ModuleType.Expression) {
            this.mComponentContent.linkExpressionModule(pElement, pModule);
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
        // Register content.
        this.mComponentContent.prependContent(pParentElement, pChildElement, pChildTemplate);
        // Do not add the child to any element if the parent is the content scope root.
        if (pParentElement === null && this.initialized) {
            // Find last element in content scope and insert child after.
            const lLastElement = this.anchor;
            this.insertAfter(lLastElement, pChildElement, pChildTemplate);
        }
        else if (pParentElement !== null) {
            // Prepend child.
            let lContent = (pChildElement instanceof base_builder_1.BaseBuilder) ? pChildElement.anchor : pChildElement;
            // Parse node to sloted node.
            if ('componentHandler' in pParentElement) {
                lContent = this.parseNodeToSloted(pParentElement, lContent, pChildTemplate);
            }
            pParentElement.prepend(lContent);
        }
    }
    /**
     * Remove child from content.
     * @param pElement - Element
     */
    removeContent(pElement) {
        this.mComponentContent.removeContent(pElement);
        if (pElement instanceof base_builder_1.BaseBuilder) {
            pElement.deleteBuild();
        }
        else {
            pElement.parentElement.removeChild(pElement);
        }
    }
    /**
     * Update all builder.
     */
    updateChildBuilder() {
        let lAnyChildWasUpdated = false;
        // Call update on all build handler that are not updated by this.update(...).
        for (const lBuildHandler of this.mComponentContent.contentBuilder) {
            // Check if any updates where applied.
            if (lBuildHandler.updateBuild()) {
                lAnyChildWasUpdated = true;
            }
        }
        return lAnyChildWasUpdated;
    }
    /**
     * Clean all modules and an child inside html element.
     * @param pElement - Html element.
     */
    cleanElement(pElement) {
        // Get all used modules of element.
        const lMappedModuleList = this.mComponentContent.getLinkedStaticModules(pElement);
        // Clean up all static modules.
        for (const lAttributeModule of lMappedModuleList) {
            lAttributeModule.cleanup();
            this.mComponentContent.unlinkStaticModule(pElement, lAttributeModule);
        }
        // If element is custom element deconstruct it.
        if (component_connection_1.ComponentConnection.componentManagerOf(pElement)) {
            component_connection_1.ComponentConnection.componentManagerOf(pElement).deconstruct();
        }
        // Remove actual element.
        pElement.remove();
        // Get childs.
        const lChildList = this.mComponentContent.getChildList(pElement);
        // Cleanup all elements.
        for (const lChild of lChildList) {
            if (lChild instanceof Element) {
                this.cleanElement(lChild);
            }
            else if (lChild instanceof base_builder_1.BaseBuilder) {
                lChild.deleteBuild();
            }
        }
    }
    /**
     * Append an node after another.
     * @param pReferencedNode - The node that will be before the new node.
     * @param pContent - Content that will be inserted after the referenced node.
     * @param pTemplate - Template of node.
     */
    insertAfter(pReferencedNode, pContent, pTemplate) {
        let lContent = (pContent instanceof base_builder_1.BaseBuilder) ? pContent.anchor : pContent;
        // If the refernced node is the last node. nextSibling will return null.
        // If the referenced node is null, the insert before behaves like an normal appendChild.
        if (pReferencedNode instanceof base_builder_1.BaseBuilder) {
            const lAnchor = pReferencedNode.anchor;
            const lLastElement = pReferencedNode.contentManager.getLastElement();
            // Prevent errors on rapid updates.
            // Elements that should be added are added to already deleted elements.
            if (lAnchor.parentNode !== null) {
                lAnchor.parentNode.insertBefore(lContent, lLastElement.nextSibling);
            }
        }
        else {
            // Prevent errors on rapid updates.
            // Elements that should be added are added to already deleted elements.
            if (pReferencedNode.parentNode !== null) {
                // Parse node to sloted node.
                if ('componentHandler' in pReferencedNode.parentNode) {
                    lContent = this.parseNodeToSloted(pReferencedNode.parentNode, lContent, pTemplate);
                }
                pReferencedNode.parentNode.insertBefore(lContent, pReferencedNode.nextSibling);
            }
        }
    }
    /**
     * Parse an node so it contains the slot attribute with the correct slot name.
     * @param pParentElement - parent element.
     * @param pNode - Node that should be added.
     * @param pTemplate - Template of node.
     * @returns parsed element that has the slot attribute.
     */
    parseNodeToSloted(pParentElement, pNode, pTemplate) {
        let lNode = pNode;
        const lSlotName = component_connection_1.ComponentConnection.componentManagerOf(pParentElement).elementHandler.getElementsSlotname(pTemplate);
        // Wrap text nodes into span element.
        if (pTemplate instanceof core_xml_1.TextNode) {
            // Wrap text node.
            const lSpanWrapper = element_creator_1.ElementCreator.createElement('span');
            lSpanWrapper.appendChild(pNode);
            lNode = lSpanWrapper;
        }
        if (lNode instanceof Element) {
            lNode.setAttribute('slot', lSlotName);
        }
        return lNode;
    }
}
exports.ContentManager = ContentManager;
//# sourceMappingURL=content-manager.js.map