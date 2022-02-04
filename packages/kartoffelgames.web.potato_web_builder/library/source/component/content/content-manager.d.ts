import { BaseXmlNode, TextNode, XmlElement } from '@kartoffelgames/core.xml';
import { IPwbExpressionModule } from '../../interface/module/expression-module';
import { IPwbManipulatorAttributeModule } from '../../interface/module/manipulator-attribute-module';
import { IPwbStaticAttributeModule } from '../../interface/module/static-attribute-module';
import { BaseContent, HtmlContent } from '../../types';
import { BaseBuilder } from '../builder/base-builder';
import { ComponentModules } from '../component-modules';
export declare class ContentManager {
    private readonly mAttributeModules;
    private readonly mComponentContent;
    private readonly mContentAnchor;
    private mInitialized;
    /**
     * Get elements content anchor if element renders no nodes.
     */
    get anchor(): Comment;
    /**
     * Get component attribute modules.
     */
    get attributeModules(): ComponentModules;
    /**
     * If manager is initialized.
     */
    get initialized(): boolean;
    /**
     * Get all linked expressions modules of all elements..
     */
    get linkedExpressionModules(): Array<IPwbExpressionModule>;
    /**
     * Get all linked static modules of all elements..
     */
    get linkedStaticModules(): Array<IPwbStaticAttributeModule>;
    /**
     * Get current used manipulator module.
     */
    get manipulatorModule(): IPwbManipulatorAttributeModule;
    /**
     * Set current used manipulator module.
     */
    set manipulatorModule(pValue: IPwbManipulatorAttributeModule);
    /**
     * Get contents template
     */
    get template(): Array<BaseXmlNode>;
    /**
     * Manages content of component.
     * @param pTemplate - XML-Template.
     * @param pAttributeModules - Attribute modules of component.
     */
    constructor(pTemplate: Array<BaseXmlNode>, pAttributeModules: ComponentModules);
    /**
     * Add child to content.
     * Appends child to parent.
     * @param pParentElement - Parent element of child. If parent is the content scope root, use null.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    appendContent(pParentElement: HtmlContent | null, pChildElement: BaseContent, pChildTemplate: BaseXmlNode): void;
    /**
     * Add child after refered content.
     * @param pReferenceContent - Refered content. Child gets append after this content.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    appendContentAfter(pReferenceContent: BaseContent, pChildElement: BaseContent, pChildTemplate: BaseXmlNode): void;
    /**
     * Clear all content of manager.
     */
    clearContent(): void;
    /**
     * Get childs of parent.
     * Null for content root.
     * @param pParent - Parent of childs.
     */
    getChildList(pParentElement: HtmlContent | null): Array<BaseContent>;
    /**
     * Get content that was build from specified template.
     * @param pTemplate - Template node.
     */
    getContentByTemplate(pTemplate: BaseXmlNode): BaseContent;
    /**
     * Get last element of content scope.
     */
    getLastElement(): Node;
    /**
     * Get template node that was used for building html node.
     * @param pNode - Html element.
     */
    getTemplateByContent(pNode: Text): TextNode;
    getTemplateByContent(pElement: HtmlContent | BaseBuilder): XmlElement;
    getTemplateByContent(pNode: BaseContent): BaseXmlNode;
    /**
     * Initialize all uninitialized content.
     */
    initializeContent(): void;
    /**
     * Add executed module to html element.
     * @param pElement - Html node.
     * @param pModule - html module.
     */
    linkModule(pElement: HtmlContent, pModule: IPwbStaticAttributeModule): void;
    linkModule(pElement: HtmlContent | Text, pModule: IPwbExpressionModule): void;
    /**
     * Add child at start of parent.
     * Prepends child to parent.
     * @param pParentElement - Parent element of child. If parent is the content scope root, use null.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    prependContent(pParentElement: HtmlContent | null, pChildElement: BaseContent, pChildTemplate: BaseXmlNode): void;
    /**
     * Remove child from content.
     * @param pElement - Element
     */
    removeContent(pElement: BaseContent): void;
    /**
     * Update all builder.
     */
    updateChildBuilder(): boolean;
    /**
     * Clean all modules and an child inside html element.
     * @param pElement - Html element.
     */
    private cleanElement;
    /**
     * Append an node after another.
     * @param pReferencedNode - The node that will be before the new node.
     * @param pContent - Content that will be inserted after the referenced node.
     * @param pTemplate - Template of node.
     */
    private insertAfter;
    /**
     * Parse an node so it contains the slot attribute with the correct slot name.
     * @param pParentElement - parent element.
     * @param pNode - Node that should be added.
     * @param pTemplate - Template of node.
     * @returns parsed element that has the slot attribute.
     */
    private parseNodeToSloted;
}
//# sourceMappingURL=content-manager.d.ts.map