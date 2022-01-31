import { BaseXmlNode, TextNode, XmlElement } from '@kartoffelgames/core.xml';
import { ModuleType } from '../../enum/module-type';
import { IPwbAttributeModule } from '../../interface/attribute-module';
import { IPwbExpressionModule } from '../../interface/expression-module';
import { PwbComponentElement } from '../../interface/html-component';
import { IPwbManipulatorAttributeModule } from '../../interface/manipulator-attribute-module';
import { IPwbStaticAttributeModule } from '../../interface/static-attribute-module';
import { BaseContent, HtmlContent } from '../../types';
import { BaseBuilder } from '../builder/base-builder';
import { ComponentModules } from '../component-modules';
import { ComponentContent } from './component-content';
import { ElementCreator } from './element-creator';

export class ContentManager {
    private readonly mAttributeModules: ComponentModules;
    private readonly mComponentContent: ComponentContent;
    private readonly mContentAnchor: Comment;
    private mInitialized: boolean;

    /**
     * Get elements content anchor if element renders no nodes.
     */
    public get anchor(): Comment {
        return this.mContentAnchor;
    }

    /**
     * Get component attribute modules.
     */
    public get attributeModules(): ComponentModules {
        return this.mAttributeModules;
    }

    /**
     * If manager is initialized.
     */
    public get initialized(): boolean {
        return this.mInitialized;
    }

    /**
     * Get all linked expressions modules of all elements..
     */
    public get linkedExpressionModules(): Array<IPwbExpressionModule> {
        return this.mComponentContent.linkedExpressionModules;
    }

    /**
     * Get all linked static modules of all elements..
     */
    public get linkedStaticModules(): Array<IPwbStaticAttributeModule> {
        return this.mComponentContent.linkedStaticModules;
    }

    /**
     * Get current used manipulator module.
     */
    public get manipulatorModule(): IPwbManipulatorAttributeModule {
        return this.mComponentContent.manipulatorModule;
    }

    /**
     * Set current used manipulator module.
     */
    public set manipulatorModule(pValue: IPwbManipulatorAttributeModule) {
        this.mComponentContent.manipulatorModule = pValue;
    }

    /**
     * Get contents template
     */
    public get template(): Array<BaseXmlNode> {
        return this.mComponentContent.template;
    }

    /**
     * Manages content of component.
     * @param pTemplate - XML-Template.
     * @param pAttributeModules - Attribute modules of component.
     */
    public constructor(pTemplate: Array<BaseXmlNode>, pAttributeModules: ComponentModules) {
        this.mAttributeModules = pAttributeModules;
        this.mComponentContent = new ComponentContent(pTemplate);
        this.mInitialized = false;

        // Generate comment with random hex value as string.
        this.mContentAnchor = ElementCreator.createComment(Math.random().toString(16).substring(3).toUpperCase());
    }

    /**
     * Add child to content.
     * Appends child to parent.
     * @param pParentElement - Parent element of child. If parent is the content scope root, use null.
     * @param pChildElement - Child element.
     * @param pChildTemplate - Template element of child element.
     */
    public appendContent(pParentElement: HtmlContent | null, pChildElement: BaseContent, pChildTemplate: BaseXmlNode): void {
        // Register content.
        this.mComponentContent.appendContent(pParentElement, pChildElement, pChildTemplate);

        // Do not add the child to any element if the parent is the content scope root.
        if (pParentElement === null && this.initialized) {
            // Find last element in content scope and insert child after.
            const lLastElement: Node = this.getLastElement();
            this.insertAfter(lLastElement, pChildElement, pChildTemplate);
        } else if (pParentElement !== null) {
            let lContent: Node = (pChildElement instanceof BaseBuilder) ? pChildElement.anchor : pChildElement;

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
    public appendContentAfter(pReferenceContent: BaseContent, pChildElement: BaseContent, pChildTemplate: BaseXmlNode): void {
        // Register content.
        this.mComponentContent.appendContentAfter(pReferenceContent, pChildElement, pChildTemplate);

        let lContent: Node = (pChildElement instanceof BaseBuilder) ? pChildElement.anchor : pChildElement;

        // Parse node to sloted node.
        if (!(pReferenceContent instanceof BaseBuilder) && 'componentHandler' in pReferenceContent.parentNode) {
            lContent = this.parseNodeToSloted((<any>pReferenceContent).parentNode, lContent, pChildTemplate);
        }

        this.insertAfter(pReferenceContent, lContent, pChildTemplate);
    }

    /**
     * Clear all content of manager.
     */
    public clearContent(): void {
        // Get root childs.
        const lChildList: Array<BaseContent> = this.mComponentContent.getChildList(null);

        // Cleanup all elements.
        for (const lChild of lChildList) {
            if (lChild instanceof Element) {
                this.cleanElement(lChild);
            } else if (lChild instanceof BaseBuilder) {
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
    public getChildList(pParentElement: HtmlContent | null): Array<BaseContent> {
        return this.mComponentContent.getChildList(pParentElement);
    }

    /**
     * Get content that was build from specified template.
     * @param pTemplate - Template node.
     */
    public getContentByTemplate(pTemplate: BaseXmlNode): BaseContent {
        return this.mComponentContent.getContentByTemplate(pTemplate);
    }

    /**
     * Get last element of content scope.
     */
    public getLastElement(): Node {
        const lContentList: Array<BaseContent> = this.mComponentContent.contentList;

        if (lContentList.length === 0) {
            // Return anchor if builder has no content.
            return this.anchor;
        } else {
            const lLastContent: BaseContent = lContentList[lContentList.length - 1];

            // Try to get last child of builder.
            if (lLastContent instanceof BaseBuilder) {
                // Return last content of builder.
                return lLastContent.contentManager.getLastElement();
            } else {
                return lLastContent;
            }
        }
    }

    /**
     * Get template node that was used for building html node.
     * @param pNode - Html element.
     */
    public getTemplateByContent(pNode: Text): TextNode;
    public getTemplateByContent(pElement: HtmlContent | BaseBuilder): XmlElement;
    public getTemplateByContent(pNode: BaseContent): BaseXmlNode;
    public getTemplateByContent(pNode: BaseContent): BaseXmlNode {
        return this.mComponentContent.getTemplateByContent(<any>pNode);
    }

    /**
     * Initialize all uninitialized content. 
     */
    public initializeContent(): void {
        // Do not initialize childs if already append.
        if (!this.mInitialized) {
            // Get all root childs of content scope.
            const lRootChildList: Array<BaseContent> = this.mComponentContent.getChildList(null);
            let lLastAppendChild: Node = this.anchor;

            // Add elements after comment.
            for (const lRootChild of lRootChildList) {
                // Get contentAnchor as node if child is component handler.
                const lRootChildNode: Node = (lRootChild instanceof BaseBuilder) ? lRootChild.anchor : lRootChild;

                const lRootChildTemplate: BaseXmlNode = this.mComponentContent.getTemplateByContent(lRootChild);

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

    /**
     * Add executed module to html element.
     * @param pElement - Html node.
     * @param pModule - html module.
     */
    public linkModule(pElement: HtmlContent, pModule: IPwbStaticAttributeModule): void;
    public linkModule(pElement: HtmlContent | Text, pModule: IPwbExpressionModule): void;
    public linkModule(pElement: HtmlContent | Text, pModule: IPwbStaticAttributeModule | IPwbExpressionModule): void {
        const lModuleConstructor: IPwbAttributeModule = <IPwbAttributeModule><any>pModule.constructor;

        if (lModuleConstructor.moduleType === ModuleType.Static) {
            this.mComponentContent.linkStaticModule(<HtmlContent>pElement, <IPwbStaticAttributeModule>pModule);
        } else if (lModuleConstructor.moduleType === ModuleType.Expression) {
            this.mComponentContent.linkExpressionModule(pElement, <IPwbExpressionModule>pModule);
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
        // Register content.
        this.mComponentContent.prependContent(pParentElement, pChildElement, pChildTemplate);

        // Do not add the child to any element if the parent is the content scope root.
        if (pParentElement === null && this.initialized) {
            // Find last element in content scope and insert child after.
            const lLastElement: Node = this.anchor;
            this.insertAfter(lLastElement, pChildElement, pChildTemplate);
        } else if (pParentElement !== null) {
            // Prepend child.
            let lContent: Node = (pChildElement instanceof BaseBuilder) ? pChildElement.anchor : pChildElement;

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
    public removeContent(pElement: BaseContent): void {
        this.mComponentContent.removeContent(pElement);

        if (pElement instanceof BaseBuilder) {
            pElement.deleteBuild();
        } else {
            pElement.parentElement.removeChild(pElement);
        }
    }

    /**
     * Update all builder.
     */
    public updateChildBuilder(): boolean {
        let lAnyChildWasUpdated: boolean = false;

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
    private cleanElement(pElement: HtmlContent): void {
        // Get all used modules of element.
        const lMappedModuleList: Array<IPwbStaticAttributeModule> = this.mComponentContent.getLinkedStaticModules(pElement);

        // Clean up all static modules.
        for (const lAttributeModule of lMappedModuleList) {
            lAttributeModule.cleanup();
            this.mComponentContent.unlinkStaticModule(pElement, lAttributeModule);
        }

        // If element is custom element deconstruct it.
        if ('component' in pElement) {
            pElement.component.deconstruct();
        }

        // Remove actual element.
        pElement.remove();

        // Get childs.
        const lChildList: Array<BaseContent> = this.mComponentContent.getChildList(pElement);

        // Cleanup all elements.
        for (const lChild of lChildList) {
            if (lChild instanceof Element) {
                this.cleanElement(lChild);
            } else if (lChild instanceof BaseBuilder) {
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
    private insertAfter(pReferencedNode: BaseContent, pContent: BaseContent, pTemplate: BaseXmlNode): void {
        let lContent: Node = (pContent instanceof BaseBuilder) ? pContent.anchor : pContent;

        // If the refernced node is the last node. nextSibling will return null.
        // If the referenced node is null, the insert before behaves like an normal appendChild.
        if (pReferencedNode instanceof BaseBuilder) {
            const lAnchor: Comment = pReferencedNode.anchor;
            const lLastElement: Node = pReferencedNode.contentManager.getLastElement();

            // Prevent errors on rapid updates.
            // Elements that should be added are added to already deleted elements.
            if (lAnchor.parentNode !== null) {
                lAnchor.parentNode.insertBefore(lContent, lLastElement.nextSibling);
            }
        } else {
            // Prevent errors on rapid updates.
            // Elements that should be added are added to already deleted elements.
            if (pReferencedNode.parentNode !== null) {
                // Parse node to sloted node.
                if ('componentHandler' in pReferencedNode.parentNode) {
                    lContent = this.parseNodeToSloted((<any>pReferencedNode).parentNode, lContent, pTemplate);
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
    private parseNodeToSloted(pParentElement: PwbComponentElement, pNode: Node, pTemplate: BaseXmlNode): Node {
        let lNode: BaseContent = pNode;
        const lSlotName: string = pParentElement.component.getElementsSlotname(pTemplate);

        // Wrap text nodes into span element.
        if (pTemplate instanceof TextNode) {
            // Wrap text node.
            const lSpanWrapper: HTMLSpanElement = <HTMLSpanElement>ElementCreator.createElement('span');
            lSpanWrapper.appendChild(<Text>pNode);

            lNode = lSpanWrapper;
        }

        if (lNode instanceof Element) {
            lNode.setAttribute('slot', lSlotName);
        }

        return lNode;
    }
}