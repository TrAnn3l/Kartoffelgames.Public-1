import { Dictionary, List } from '@kartoffelgames/core.data';
import { BaseBuilder } from '../builder/base-builder';
import { ComponentConnection } from '../component-connection';
import { ComponentManager } from '../component-manager';
import { ComponentModules } from '../component-modules';
import { ElementCreator } from './element-creator';
import { BaseModule } from '../../module/base/base-module';
import { MultiplicatorModule } from '../../module/base/multiplicator-module';
import { StaticModule } from '../../module/base/static-module';
import { ExpressionModule } from '../../module/base/expression-module';
import { XmlElement } from '@kartoffelgames/core.xml';

// TODO: Access Builder parent element without Node.parentElement
// TODO: Better base append-method.

export class ContentManager {
    private readonly mChildBuilderList: List<BaseBuilder>;
    private readonly mChildComponentList: List<Element>;
    private readonly mRootChildList: List<Content>;
    private readonly mContentAnchor: Comment;
    private readonly mModules: ComponentModules;
    private readonly mLinkedModules: Dictionary<Node, Array<BaseModule<boolean, any>>>;
    private mMultiplicatorModule: MultiplicatorModule;
    private readonly mBoundaryDescription: BoundaryDescription;

    /**
     * Get content anchor.
     * All content of this content manager gets append to this anchor.
     */
    public get anchor(): Comment {
        return this.mContentAnchor;
    }

    /**
     * Get all child builder.
     */
    public get childBuilderList(): Array<BaseBuilder> {
        return this.mChildBuilderList;
    }

    /**
     * Get all child builder.
     */
    public get modules(): ComponentModules {
        return this.mModules;
    }

    /**
     * Get multiplicator module of layer.
     */
    public get multiplicatorModule(): MultiplicatorModule {
        return this.mMultiplicatorModule;
    }

    /**
     * Set multiplicator module of layer.
     */
    public set multiplicatorModule(pModule: MultiplicatorModule) {
        this.mMultiplicatorModule = pModule;
    }

    /**
     * Get all linked module lists.
     */
    public get linkedModuleList(): Array<BaseModule<boolean, any>> {
        const lAllModuleList: Array<BaseModule<boolean, any>> = new Array<BaseModule<boolean, any>>();
        for (const lNodeModuleList of this.mLinkedModules.values()) {
            lAllModuleList.push(...lNodeModuleList);
        }
        return lAllModuleList;
    }

    /**
     * Get root elements.
     * Elements are returned in order.
     */
    public get rootElementList(): Array<Content> {
        return this.mRootChildList;
    }

    /**
     * Constructor.
     */
    public constructor(pModules: ComponentModules, pAnchorPrefix: string = '') {
        this.mModules = pModules;
        this.mRootChildList = new List<Content>();
        this.mChildBuilderList = new List<BaseBuilder>();
        this.mChildComponentList = new List<Element>();
        this.mLinkedModules = new Dictionary<Node, Array<BaseModule<boolean, any>>>();
        this.mContentAnchor = ElementCreator.createComment(pAnchorPrefix + ' ' + Math.random().toString(16).substring(3).toUpperCase());
        this.mBoundaryDescription = {
            start: this.mContentAnchor,
            end: this.mContentAnchor
        };
    }

    /**
     * Append child element after target.
     * @param pChild - Child node.
     * @param pTarget - Target where child gets append after. 
     */
    public after(pChild: Content, pTarget: Content): void {
        let lParent: Element;
        if (this.mRootChildList.includes(pTarget)) {
            lParent = null;
        } else {
            if (pTarget instanceof BaseBuilder) {
                lParent = pTarget.boundary.start.parentElement;
            } else {
                lParent = pTarget.parentElement;
            }

        }

        this.insertContentAfter(pChild, lParent, pTarget);
    };

    /**
     * Append child element to parent.
     * Appends to root if no parent is specified. 
     * @param pChild - Child node.
     * @param pParentElement - Parent element of child.
     */
    public append(pChild: Content): void;
    public append(pChild: Content, pParentElement: Element): void;
    public append(pChild: Content, pParentElement: Element = null): void {
        let lTarget: Content;
        if (pParentElement) {
            // Last Child element of parent.
            lTarget = pParentElement.childNodes[pParentElement.childNodes.length - 1];
        } else {
            // Boundary end.
            lTarget = this.mBoundaryDescription.end;
        }

        this.insertContentAfter(pChild, pParentElement, lTarget);
    };

    /**
     * Prepend child element to parent.
     * Prepends to root if no parent is specified. 
     * @param pChild - Child node.
     * @param pParentElement - Parent element of child.
     */
    public prepend(pChild: Content): void;
    public prepend(pChild: Content, pParentElement: Element): void;
    public prepend(pChild: Content, pParentElement: Element = null): void {
        this.insertContentAfter(pChild, pParentElement, null);
    };

    /**
     * Append child after target.
     * @param pChild - Child node.
     * @param pParentElement - Parent element of child.
     * @param pTarget - Target where child gets append after. 
     */
    private insertContentAfter(pChild: Content, pParentElement: Element, pTarget: Content): void {
        // Find real parent.
        const lParent: Element = pParentElement ?? this.mContentAnchor.parentElement;

        const lSlotableNode: Node = this.toSlotable(lParent, pChild);
        if (!pTarget) {
            // No target means prepend.
            lParent.prepend(lSlotableNode);
        } else {
            let lTargetNode: Node;
            if (pTarget instanceof BaseBuilder) {
                lTargetNode = pTarget.boundary.end;
            } else {
                lTargetNode = pTarget;
            }

            // Insert before targets next sibling. If nextSibling is null, lSlotableNode is append to target nodes parent.
            lParent.insertBefore(lSlotableNode, lTargetNode.nextSibling);
        }

        // Register element.
        if (pChild instanceof Text && pChild !== lSlotableNode) {
            // Register span wrapped text.
            this.registerContent(lSlotableNode, !pParentElement, pTarget);
        } else {
            this.registerContent(pChild, !pParentElement, pTarget);
        }
    }

    /**
     * Remove and deconstruct content.
     * @param pChild - Child element of layer.
     */
    public remove(pChild: Content): void {
        if (pChild instanceof BaseBuilder) {
            pChild.deconstruct();
        } else {
            // Check if element is a component. If so deconstruct.
            const lComponentManager: ComponentManager = ComponentConnection.componentManagerOf(pChild);
            lComponentManager?.deconstruct();

            // Remove from parent.
            pChild.parentElement?.removeChild(pChild);

            // Unlink modules.
            const lModuleList: Array<BaseModule<boolean, any>> = this.mLinkedModules.get(pChild);
            if (lModuleList) {
                // Deconstruct all linked modules.
                for (const lModule of lModuleList) {
                    lModule.deconstruct();
                }

                // Delete element from linked module.
                this.mLinkedModules.delete(pChild);
            }
        }

        // Remove from storages.
        this.unregisterContent(pChild);
    }

    /**
     * Deconstructs all builder and elements.
     */
    public deconstruct() {
        // Deconstruct builder.
        for (const lBuilder of this.mChildBuilderList) {
            lBuilder.deconstruct();
        }

        // Deconstruct components.
        for (const lComponent of this.mChildComponentList) {
            const lComponentManager: ComponentManager = ComponentConnection.componentManagerOf(lComponent);
            lComponentManager.deconstruct();
        }

        // Deconstruct modules.
        this.mMultiplicatorModule?.deconstruct();
        for (const lModule of this.linkedModuleList) {
            lModule.deconstruct();
        }

        // Remove all content. Only remove root elements. GC makes the rest.
        this.anchor.remove();
        for (const lRootChild of this.mRootChildList) {
            // Only remove elements. Builder are already deconstructed.
            if (!(lRootChild instanceof BaseBuilder)) {
                this.remove(lRootChild);
            }
        }
    }

    /**
     * Get content boundry. Start and end content.
     */
    public getBoundary(): Boundary {
        // Top is always the anchor.
        const lTop: Node = <Node>this.mBoundaryDescription.start;

        // Get last element of builder if bottom element is a builder 
        // or use node as bottom element.  
        let lBottom: Node;
        if (this.mBoundaryDescription.end instanceof BaseBuilder) {
            lBottom = this.mBoundaryDescription.end.boundary.end;
        } else {
            lBottom = this.mBoundaryDescription.end;
        }

        return {
            start: lTop,
            end: lBottom
        };
    }

    /**
     * Link module to node.
     * @param pModule - Module.
     * @param pNode - Build node.
     */
    public linkModule(pModule: StaticModule | ExpressionModule, pNode: Node): void {
        // Get module list of node. Create if it not exists.
        let lModuleList: Array<BaseModule<boolean, any>> = this.mLinkedModules.get(pNode);
        if (!lModuleList) {
            lModuleList = new Array<BaseModule<boolean, any>>();
            this.mLinkedModules.set(pNode, lModuleList);
        }

        // Add module as linked module to node module list.
        lModuleList.push(pModule);
    }

    /**
     * Saves element into child storage or root storage.
     * Extends boundary.
     * @param pChild - Child element.
     * @param pRoot - If child is an root element.
     */
    private registerContent(pChild: Content, pRoot: boolean): void;
    private registerContent(pChild: Content, pRoot: boolean, pPreviousSibling: Content): void;
    private registerContent(pChild: Content, pRoot: boolean, pPreviousSibling?: Content): void {
        // Add to builder or component storage.
        if (pChild instanceof BaseBuilder) {
            this.mChildBuilderList.push(pChild);
        } else if (ComponentConnection.componentManagerOf(pChild)) {
            this.mChildComponentList.push(<Element>pChild);
        }

        // Add element in order if element is on root level.
        if (pRoot) {
            // Set index to -1 of no previous sibling exists.
            const lSiblingIndex: number = this.mRootChildList.indexOf(pPreviousSibling);

            // Extend boundary if child is new last element.
            if ((lSiblingIndex + 1) === this.mRootChildList.length) {
                this.mBoundaryDescription.end = pChild;
            }

            // Add root child after previous sibling.
            this.mRootChildList.splice(lSiblingIndex + 1, 0, pChild);
        }
    }

    /**
     * Removes child from all storages and shrink boundary.
     * @param pChild - Child element.
     */
    private unregisterContent(pChild: Content) {
        // Remove from builder or component storage.
        if (pChild instanceof BaseBuilder) {
            this.mChildBuilderList.remove(pChild);
        } else if (ComponentConnection.componentManagerOf(pChild)) {
            this.mChildComponentList.remove(<Element>pChild);
        }

        // Remove from root childs and shrink boundary.
        const lChildRootIndex: number = this.mRootChildList.indexOf(pChild);
        if (lChildRootIndex > -1) {
            // Check for boundary shrink.
            if ((lChildRootIndex + 1) === this.mRootChildList.length) {
                // Check if one root child remains otherwise use anchor as end boundary.
                if (this.mRootChildList.length > 1) {
                    this.mBoundaryDescription.end = this.mRootChildList[lChildRootIndex - 1];
                } else {
                    this.mBoundaryDescription.end = this.mContentAnchor;
                }
            }

            this.mRootChildList.remove(pChild);
        }
    }

    /**
     * Parse an node so it contains the slot attribute with the correct slot name.
     * @param pParentElement - parent element.
     * @param pContent - Node that should be added.
     * @param pTemplate - Template of node.
     * @returns parsed element that has the slot attribute.
     */
    private toSlotable(pParentElement: Element, pContent: Content): Node {
        let lNode: Node;

        if (pContent instanceof BaseBuilder) {
            lNode = pContent.anchor;
        } else {
            // Check if parent is a component.
            if (ComponentConnection.componentManagerOf(pParentElement)) {
                // Wrap text nodes into span element.
                let lSlotedElement: Element;
                if (pContent instanceof Text) {
                    const lSpanTemplate: XmlElement = new XmlElement();
                    lSpanTemplate.tagName = 'span';

                    // Wrap text node.
                    const lSpanWrapper: HTMLSpanElement = <HTMLSpanElement>ElementCreator.createElement(lSpanTemplate);
                    lSpanWrapper.appendChild(<Text>pContent);

                    lSlotedElement = lSpanWrapper;
                } else {
                    // Content can only be element. No Text and no comment.
                    lSlotedElement = <Element>pContent;
                }

                lNode = lSlotedElement;
            } else {
                lNode = pContent;
            }
        }

        return lNode;
    }
}

export type Boundary = {
    start: Node;
    end: Node;
};

export type BoundaryDescription = {
    start: Node | BaseBuilder;
    end: Node | BaseBuilder;
};

export type Content = Node | BaseBuilder;