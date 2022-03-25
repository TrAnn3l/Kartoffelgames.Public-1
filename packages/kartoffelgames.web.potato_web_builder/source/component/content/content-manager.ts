import { Dictionary, List } from '@kartoffelgames/core.data';
import { BaseModule } from '../../module/base/base-module';
import { ExpressionModule } from '../../module/base/expression-module';
import { MultiplicatorModule } from '../../module/base/multiplicator-module';
import { StaticModule } from '../../module/base/static-module';
import { BaseBuilder } from '../builder/base-builder';
import { ComponentConnection } from '../component-connection';
import { ComponentManager } from '../component-manager';
import { ComponentModules } from '../component-modules';
import { ElementCreator } from './element-creator';

export class ContentManager {
    private readonly mBoundaryDescription: BoundaryDescription;
    private readonly mChildBuilderList: List<BaseBuilder>;
    private readonly mChildComponentList: List<Element>;
    private readonly mContentAnchor: Comment;
    private readonly mLinkedModules: Dictionary<Node, Array<BaseModule<boolean, any>>>;
    private readonly mModules: ComponentModules;
    private mMultiplicatorModule: MultiplicatorModule;
    private readonly mRootChildList: List<Content>;


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
        this.insertContent(pChild, pTarget, 'After');
    }

    /**
     * Append child element to parent.
     * Appends to root if no parent is specified. 
     * @param pChild - Child node.
     * @param pParentElement - Parent element of child.
     */
    public append(pChild: Content): void;
    public append(pChild: Content, pParentElement: Element): void;
    public append(pChild: Content, pParentElement: Element = null): void {
        this.insertContent(pChild, pParentElement, 'Append');
    }

    /**
     * Deconstructs all builder and elements.
     */
    public deconstruct(): void {
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
     * Prepend child element to parent.
     * Prepends to root if no parent is specified. 
     * @param pChild - Child node.
     * @param pParentElement - Parent element of child.
     */
    public prepend(pChild: Content): void;
    public prepend(pChild: Content, pParentElement: Element): void;
    public prepend(pChild: Content, pParentElement: Element = null): void {
        this.insertContent(pChild, pParentElement, 'Prepend');
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
            if (pChild.parentElement) {
                pChild.parentElement.removeChild(pChild);
            } else {
                pChild.getRootNode().removeChild(pChild);
            }

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
     * Add element to content.
     * @param pChild - The element that should be added.
     * @param pTarget - Parent element or target node.
     * @param pMode - Add mode for child.
     */
    private insertContent(pChild: Content, pTarget: Content, pMode: 'After'): void;
    private insertContent(pChild: Content, pParent: Element, pMode: 'Append' | 'Prepend'): void;
    private insertContent(pChild: Content, pTarget: Content, pMode: 'Append' | 'After' | 'Prepend'): void {
        // Get anchor of child if child is a builder.
        const lRealChildNode: Node = (pChild instanceof BaseBuilder) ? pChild.anchor : pChild;

        // Get real parent element. 
        let lRealParent: Element | ShadowRoot;
        if (pMode === 'Append' || pMode === 'Prepend') {
            lRealParent = <Element>pTarget;
            if (!lRealParent) {
                // Parent is null, because element should be append to builder root.
                // Builder parent is builder anchor parent. If anchor parent is null, builder parent is the component shadow root.
                lRealParent = this.mContentAnchor.parentElement ?? <ShadowRoot>this.mContentAnchor.getRootNode();
            }
        } else { // pMode === 'After'
            lRealParent = (pTarget instanceof BaseBuilder) ? pTarget.anchor.parentElement : pTarget.parentElement;

            // Parent is null, because direct parent is the component shadow root.
            // When parent element is null "this.mContentAnchor.parentElement" is also null. So this check would be unnessessary. 
            lRealParent = lRealParent ?? <ShadowRoot>this.mContentAnchor.getRootNode();
        }

        // If child gets append to builder root. Is is root if real parent is this builders parent element or component shadow root.
        const lIsRoot: boolean = (lRealParent === this.mContentAnchor.parentElement || lRealParent === this.mContentAnchor.getRootNode());

        // Get node the child gets insert AFTER.
        let lRealTarget: Node | null;
        if (pMode === 'Append') {
            const lParent: Element = <Element>pTarget;
            // Last element of parent.
            if (lParent) {
                // Parent is element. Get last child of element.
                const lParentChildNodes: NodeListOf<ChildNode> = lParent.childNodes;
                lRealTarget = lParentChildNodes[lParentChildNodes.length - 1];
            } else {
                // "Parent" is this builder. Get last element boundary.
                lRealTarget = this.getBoundary().end;
            }
        } else if (pMode === 'Prepend') {
            // When parent is set, parent is an element, therefore there is no target before the first element.
            if (pTarget) {
                lRealTarget = null;
            } else {
                // "Parent" is this builder. Get first element, that is always this builders anchor.
                lRealTarget = this.getBoundary().start;
            }
        } else { // pMode === "After"
            lRealTarget = (pTarget instanceof BaseBuilder) ? pTarget.boundary.end : pTarget;
        }

        // Get previous sibling content onyl if added on root.
        let lTargetContent: Content;
        if (lIsRoot) {
            if (pMode === 'Prepend') {
                // Sibling before first element => null.
                lTargetContent = null;
            } else if (pMode === 'Append') {
                // Last content of builder.
                lTargetContent = this.mRootChildList[this.mRootChildList.length - 1];
            } else { // pMode === "After"
                lTargetContent = pTarget;
            }
        }

        // Insert element.
        if (lRealTarget) {
            // When there is a target. Get next sibling and append element after that sibling.
            // Like: parent.insertAfter(child, target);
            // If nextSibling is null, insertBefore is called as appendChild(child).
            lRealParent.insertBefore(lRealChildNode, lRealTarget.nextSibling);
        } else {
            // No target means prepend to parent. Parent is allways an element and never a builder.
            lRealParent.prepend(lRealChildNode);
        }

        // Register content.
        if (lIsRoot) {
            this.registerContent(pChild, lIsRoot, lTargetContent);
        } else {
            this.registerContent(pChild, lIsRoot);
        }
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