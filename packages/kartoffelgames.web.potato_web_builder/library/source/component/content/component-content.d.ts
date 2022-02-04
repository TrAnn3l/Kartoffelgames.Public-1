import { BaseContent, HtmlContent } from '../../types';
import { BaseBuilder } from '../builder/base-builder';
import { TextNode } from '@kartoffelgames/core.xml';
import { BaseXmlNode, XmlElement } from '@kartoffelgames/core.xml';
import { IPwbExpressionModule } from '../../interface/module/expression-module';
import { IPwbManipulatorAttributeModule } from '../../interface/module/manipulator-attribute-module';
import { IPwbStaticAttributeModule } from '../../interface/module/static-attribute-module';
/**
 * Component content handler.
 * Handles relations between element, builders, templates and modules.
 */
export declare class ComponentContent {
    private readonly mChildContentToParentContent;
    private readonly mContentBuilder;
    private readonly mContentToTemplate;
    private readonly mElementsExpressionModules;
    private readonly mElementsStaticAttributeModules;
    private mManipulatorModule;
    private readonly mParentContentToChildContent;
    private readonly mTemplate;
    private readonly mTemplateToContent;
    /**
     * Get all different content scopes as build handler.
     */
    get contentBuilder(): Array<BaseBuilder>;
    /**
     * Get current used manipulator module.
     */
    get manipulatorModule(): IPwbManipulatorAttributeModule;
    /**
     * Set current used manipulator module.
     */
    set manipulatorModule(pValue: IPwbManipulatorAttributeModule);
    /**
     * Template of content scope.
     */
    get template(): Array<BaseXmlNode>;
    /**
     * Get all linked static modules of all elements..
     */
    get linkedStaticModules(): Array<IPwbStaticAttributeModule>;
    /**
     * Get all linked expression modules of all elements.
     */
    get linkedExpressionModules(): Array<IPwbExpressionModule>;
    /**
     * Get root content list.
     */
    get contentList(): Array<BaseContent>;
    /**
     * Content data of the component.
     * COntains data for field binding.
     * @param pTemplate - XML-Template.
     * @param pAttributeModules - Attribute modules of component.
     */
    constructor(pTemplate: Array<BaseXmlNode>);
    /**
     * Add child to content.
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
     * Get childs of parent.
     * Null for content root.
     * @param pParent - Parent of childs.
     */
    getChildList(pParent: HtmlContent | null): Array<BaseContent>;
    /**
     * Get node that was build from specified template.
     * @param pTemplate - Template node.
     */
    getContentByTemplate(pTemplate: BaseXmlNode): BaseContent;
    /**
     * Get all static modules the set element has used.
     * @param pElement - Element or TextElement with attached modules.
     */
    getLinkedExpressionModules(pElement: HtmlContent | Text): Array<IPwbExpressionModule>;
    /**
     * Get all static modules the set element has used.
     * @param pElement - Element with attached modules.
     */
    getLinkedStaticModules(pElement: HtmlContent): Array<IPwbStaticAttributeModule>;
    /**
     * Get template node that was used for building html node.
     * @param pNode - Html element.
     */
    getTemplateByContent(pNode: Text): TextNode;
    getTemplateByContent(pElement: HtmlContent | BaseBuilder): XmlElement;
    getTemplateByContent(pNode: BaseContent): BaseXmlNode;
    /**
     * Add executed expression module to html element or text element.
     * @param pElement - Html element or text element.
     * @param pModule - htmle static attribute module.
     */
    linkExpressionModule(pElement: HtmlContent | Text, pModule: IPwbExpressionModule): void;
    /**
     * Add executed static module to html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    linkStaticModule(pElement: HtmlContent, pModule: IPwbStaticAttributeModule): void;
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
     * Remove module from html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    unlinkExpressionModule(pElement: HtmlContent | Text, pModule: IPwbExpressionModule): void;
    /**
     * Remove module from html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    unlinkStaticModule(pElement: HtmlContent, pModule: IPwbStaticAttributeModule): void;
}
//# sourceMappingURL=component-content.d.ts.map