import { BaseContent, HtmlContent } from '../../types';
import { BaseBuilder } from '../builder/base-builder';
import { Dictionary, Exception, List } from '@kartoffelgames/core.data';
import { TextNode } from '@kartoffelgames/core.xml';
import { BaseXmlNode, XmlElement } from '@kartoffelgames/core.xml';
import { IPwbExpressionModule } from '../../interface/expression-module';
import { IPwbManipulatorAttributeModule } from '../../interface/manipulator-attribute-module';
import { IPwbStaticAttributeModule } from '../../interface/static-attribute-module';

/**
 * Component content handler.
 * Handles relations between element, builders, templates and modules.
 */
export class ComponentContent {
    private readonly mChildContentToParentContent: Dictionary<BaseContent, HtmlContent>;
    private readonly mContentBuilder: List<BaseBuilder>;
    private readonly mContentToTemplate: Dictionary<BaseContent, BaseXmlNode>;
    private readonly mElementsExpressionModules: Dictionary<HtmlContent | Text, List<IPwbExpressionModule>>;
    private readonly mElementsStaticAttributeModules: Dictionary<HtmlContent, List<IPwbStaticAttributeModule>>;
    private mManipulatorModule: IPwbManipulatorAttributeModule;
    private readonly mParentContentToChildContent: Dictionary<HtmlContent, List<BaseContent>>;
    private readonly mTemplate: Array<BaseXmlNode>;
    private readonly mTemplateToContent: Dictionary<BaseXmlNode, BaseContent>;

    /**
     * Get all different content scopes as build handler.
     */
    public get contentBuilder(): Array<BaseBuilder> {
        return List.newListWith(...this.mContentBuilder);
    }

    /**
     * Get current used manipulator module.
     */
    public get manipulatorModule(): IPwbManipulatorAttributeModule {
        return this.mManipulatorModule;
    }

    /**
     * Set current used manipulator module.
     */
    public set manipulatorModule(pValue: IPwbManipulatorAttributeModule) {
        this.mManipulatorModule = pValue;
    }

    /**
     * Template of content scope.
     */
    public get template(): Array<BaseXmlNode> {
        return this.mTemplate;
    }

    /**
     * Get all linked static modules of all elements..
     */
    public get linkedStaticModules(): Array<IPwbStaticAttributeModule> {
        const lResultArray: Array<IPwbStaticAttributeModule> = new Array<IPwbStaticAttributeModule>();

        // Merge all modules into result array.
        for (const lModuleList of this.mElementsStaticAttributeModules) {
            lResultArray.push(...lModuleList[1]);
        }

        return lResultArray;
    }

    /**
     * Get all linked expression modules of all elements.
     */
    public get linkedExpressionModules(): Array<IPwbExpressionModule> {
        const lResultArray: Array<IPwbExpressionModule> = new Array<IPwbExpressionModule>();

        // Merge all modules into result array.
        for (const lModuleList of this.mElementsExpressionModules) {
            lResultArray.push(...lModuleList[1]);
        }

        return lResultArray;
    }

    /**
     * Get root content list.
     */
    public get contentList(): Array<BaseContent> {
        const lRootChilds: List<BaseContent> = this.mParentContentToChildContent.get(null);
        return List.newListWith(...(lRootChilds ?? new Array<BaseContent>()));
    }

    /**
     * Content data of the component.
     * COntains data for field binding.
     * @param pTemplate - XML-Template.
     * @param pAttributeModules - Attribute modules of component.
     */
    public constructor(pTemplate: Array<BaseXmlNode>) {
        // Initialize defaults
        this.mTemplate = pTemplate;

        // Initialize lists.
        this.mTemplateToContent = new Dictionary<BaseXmlNode, BaseContent>();
        this.mParentContentToChildContent = new Dictionary<HtmlContent, List<BaseContent>>();
        this.mContentBuilder = new List<BaseBuilder>();
        this.mElementsExpressionModules = new Dictionary<HtmlContent | Text, List<IPwbExpressionModule>>();
        this.mElementsStaticAttributeModules = new Dictionary<HtmlContent, List<IPwbStaticAttributeModule>>();
        this.mContentToTemplate = new Dictionary<BaseContent, BaseXmlNode>();
        this.mChildContentToParentContent = new Dictionary<BaseContent, HtmlContent>();
    }

    /**
     * Add child to content.
     * @param pParentElement - Parent element of child. If parent is the content scope root, use null.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    public appendContent(pParentElement: HtmlContent | null, pChildElement: BaseContent, pChildTemplate: BaseXmlNode): void {
        // Create new child list on parent if parent was not already initialized.
        if (!this.mParentContentToChildContent.has(pParentElement)) {
            this.mParentContentToChildContent.add(pParentElement, new List<BaseContent>());
        }

        // Bind parent, template and child information.
        this.mChildContentToParentContent.add(pChildElement, pParentElement);
        this.mParentContentToChildContent.get(pParentElement).push(pChildElement);
        this.mTemplateToContent.add(pChildTemplate, pChildElement);
        this.mContentToTemplate.add(pChildElement, pChildTemplate);

        // Always add builder to builder list.
        if (pChildElement instanceof BaseBuilder) {
            this.mContentBuilder.push(<BaseBuilder>pChildElement);
        }
    }

    /**
     * Add child after refered content.
     * @param pReferenceContent - Refered content. Child gets append after this content.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    public appendContentAfter(pReferenceContent: BaseContent, pChildElement: BaseContent, pChildTemplate: BaseXmlNode): void {
        const lParentElement: HtmlContent = this.mChildContentToParentContent.get(pReferenceContent);

        // Create new child list on parent if parent was not already initialized.
        if (!this.mParentContentToChildContent.has(lParentElement)) {
            this.mParentContentToChildContent.add(lParentElement, new List<BaseContent>());
        }

        // Bind parent, template and child information.
        this.mChildContentToParentContent.add(pChildElement, lParentElement);
        this.mTemplateToContent.add(pChildTemplate, pChildElement);
        this.mContentToTemplate.add(pChildElement, pChildTemplate);

        // Find index of referenced content inside parent of referenced content.
        const lParentElementChilds: Array<BaseContent> = this.mParentContentToChildContent.get(lParentElement);
        const lReferenceContentIndex: number = lParentElementChilds.indexOf(pReferenceContent);

        // Add element after reference content.
        lParentElementChilds.splice(lReferenceContentIndex + 1, 0, pChildElement);

        // Always add builder to builder list.
        if (pChildElement instanceof BaseBuilder) {
            this.mContentBuilder.push(<BaseBuilder>pChildElement);
        }
    }

    /**
     * Get childs of parent.
     * Null for content root.
     * @param pParent - Parent of childs.
     */
    public getChildList(pParent: HtmlContent | null): Array<BaseContent> {
        const lChild: Array<BaseContent> = this.mParentContentToChildContent.get(pParent);
        if (typeof lChild !== 'undefined') {
            return List.newListWith(...lChild);
        } else {
            return new Array<BaseContent>();
        }
    }

    /**
     * Get node that was build from specified template.
     * @param pTemplate - Template node.
     */
    public getContentByTemplate(pTemplate: BaseXmlNode): BaseContent {
        return this.mTemplateToContent.get(pTemplate);
    }

    /**
     * Get all static modules the set element has used.
     * @param pElement - Element or TextElement with attached modules.
     */
    public getLinkedExpressionModules(pElement: HtmlContent | Text): Array<IPwbExpressionModule> {
        return this.mElementsExpressionModules.getOrDefault(pElement, List.newListWith());
    }

    /**
     * Get all static modules the set element has used.
     * @param pElement - Element with attached modules.
     */
    public getLinkedStaticModules(pElement: HtmlContent): Array<IPwbStaticAttributeModule> {
        return this.mElementsStaticAttributeModules.getOrDefault(pElement, List.newListWith());
    }

    /**
     * Get template node that was used for building html node.
     * @param pNode - Html element.
     */
    public getTemplateByContent(pNode: Text): TextNode;
    public getTemplateByContent(pElement: HtmlContent | BaseBuilder): XmlElement;
    public getTemplateByContent(pNode: BaseContent): BaseXmlNode;
    public getTemplateByContent(pNode: BaseContent): BaseXmlNode {
        // Can never be someting else.
        return this.mContentToTemplate.get(pNode);
    }

    /**
     * Add executed expression module to html element or text element.
     * @param pElement - Html element or text element.
     * @param pModule - htmle static attribute module.
     */
    public linkExpressionModule(pElement: HtmlContent | Text, pModule: IPwbExpressionModule): void {
        // Initialize list.
        if (!this.mElementsExpressionModules.has(pElement)) {
            this.mElementsExpressionModules.add(pElement, new List<IPwbExpressionModule>());
        }

        // Get current mapped module list reference.
        const lModuleList: Array<IPwbExpressionModule> = this.mElementsExpressionModules.get(pElement);

        // Check if module does already exists.
        if (!lModuleList.includes(pModule)) {
            lModuleList.push(pModule);
        } else {
            throw new Exception('Module is already linked with this Element.', this);
        }
    }

    /**
     * Add executed static module to html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    public linkStaticModule(pElement: HtmlContent, pModule: IPwbStaticAttributeModule): void {
        // Initialize list.
        if (!this.mElementsStaticAttributeModules.has(pElement)) {
            this.mElementsStaticAttributeModules.add(pElement, new List<IPwbStaticAttributeModule>());
        }

        // Get current mapped module list reference.
        const lModuleList: Array<IPwbStaticAttributeModule> = this.mElementsStaticAttributeModules.get(pElement);

        // Check if module does already exists.
        if (!lModuleList.includes(pModule)) {
            lModuleList.push(pModule);
        } else {
            throw new Exception('Module is already linked with this Element.', this);
        }
    }

    /**
     * Add child at start of parent.
     * Prepends child to parent.
     * @param pParentElement - Parent element of child. If parent is the content scope root, use null.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    public prependContent(pParentElement: HtmlContent | null, pChildElement: BaseContent, pChildTemplate: BaseXmlNode): void {
        // Create new child list on parent if parent was not already initialized.
        if (!this.mParentContentToChildContent.has(pParentElement)) {
            this.mParentContentToChildContent.add(pParentElement, new List<BaseContent>());
        }

        // Bind parent, template and child information.
        this.mChildContentToParentContent.add(pChildElement, pParentElement);
        this.mTemplateToContent.add(pChildTemplate, pChildElement);
        this.mContentToTemplate.add(pChildElement, pChildTemplate);

        // Add element at start of parent.
        this.mParentContentToChildContent.get(pParentElement).splice(0, 0, pChildElement);

        // Always add builder to builder list.
        if (pChildElement instanceof BaseBuilder) {
            this.mContentBuilder.push(<BaseBuilder>pChildElement);
        }
    }

    /**
     * Remove child from content.
     * @param pElement - Element
     */
    public removeContent(pElement: BaseContent): void {
        const lParentElement: HtmlContent = this.mChildContentToParentContent.get(pElement);
        const lTemplate: BaseXmlNode = this.mContentToTemplate.get(pElement);

        // Bind parent, template and child information.
        this.mParentContentToChildContent.get(lParentElement).remove(pElement);
        this.mTemplateToContent.delete(lTemplate);
        this.mContentToTemplate.delete(pElement);

        if (pElement instanceof BaseBuilder) {
            // Always remove builder from builder list.
            this.mContentBuilder.remove(<BaseBuilder>pElement);
        } else if (pElement instanceof Element) {
            // Remove all linked modules.
            this.mElementsStaticAttributeModules.delete(pElement);
            this.mElementsExpressionModules.delete(pElement);
        } else if (pElement instanceof Text) {
            this.mElementsExpressionModules.delete(pElement);
        }
    }

    /**
     * Remove module from html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    public unlinkExpressionModule(pElement: HtmlContent | Text, pModule: IPwbExpressionModule): void {
        // Check if element has modules.
        if (this.mElementsExpressionModules.has(pElement)) {
            const lModuleList: List<IPwbExpressionModule> = this.mElementsExpressionModules.get(pElement);

            // Remove module from list.
            lModuleList.remove(pModule);
        }
    }

    /**
     * Remove module from html element.
     * @param pElement - Html element.
     * @param pModule - htmle static attribute module.
     */
    public unlinkStaticModule(pElement: HtmlContent, pModule: IPwbStaticAttributeModule): void {
        // Check if element has modules.
        if (this.mElementsStaticAttributeModules.has(pElement)) {
            const lModuleList: List<IPwbStaticAttributeModule> = this.mElementsStaticAttributeModules.get(pElement);

            // Remove module from list.
            lModuleList.remove(pModule);
        }
    }
}