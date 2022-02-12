import { LayerValues } from '../values/layer-values';
import { Boundary, ContentManager } from '../content/content-manager';
import { ComponentModules } from '../../module/component-modules';
import { ComponentManager } from '../component-manager';
import { BaseXmlNode, XmlElement } from '@kartoffelgames/core.xml';
import { MultiplicatorBuilder } from './multiplicator-builder';
import { StaticBuilder } from './static-builder';

/**
 * Builder helper that builds and updates content of component.
 */
export abstract class BaseBuilder {
    private readonly mComponentValues: LayerValues;
    private readonly mContentManager: ContentManager;
    private readonly mParentBuilder: BaseBuilder;
    private readonly mShadowParent: BaseXmlNode;
    private readonly mTemplate: BaseXmlNode;

    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    public get anchor(): Comment {
        return this.mContentManager.anchor;
    }

    /**
     * Get boundary of builder. Top and bottom element of builder.
     */
    public get boundary(): Boundary {
        return this.mContentManager.getBoundary();
    }

    /**
     * Content template.
     */
    public get template(): BaseXmlNode {
        return this.mTemplate;
    }

    /**
     * Get component values of builder.
     */
    public get values(): LayerValues {
        return this.mComponentValues;
    }

    /**
     * Shadow parent of all template elements.
     * Not actuall parent for 
     */
    protected get shadowParent(): BaseXmlNode {
        return this.mShadowParent;
    }

    /**
     * If builder is inside an manipulator scope.
     */
    protected get inManipulatorScope(): boolean {
        if (this instanceof MultiplicatorBuilder) {
            return true;
        } else if (!this.mParentBuilder) {
            return false;
        } else {
            return this.mParentBuilder.inManipulatorScope;
        }
    }

    /**
     * Get component content of builder.
     */
    protected get contentManager(): ContentManager {
        return this.mContentManager;
    }

    /**
     * Get component handler.
     */
    protected get componentManager(): ComponentManager {
        return this.mComponentValues.componentManager;
    }

    /**
     * Constructor.
     * Builder helper that builds and updates content of component.
     * @param pComponentContent - Component content.
     * @param pParentLayerValues - New component values.
     * @param pManipulatorScope - If builder is inside an manipulator scope.
     */
    public constructor(pTemplate: BaseXmlNode, pShadowParent: BaseXmlNode, pModules: ComponentModules, pParentLayerValues: LayerValues, pParentBuilder: BaseBuilder) {
        this.mShadowParent = pShadowParent;
        this.mParentBuilder = pParentBuilder;

        // Clone template and connect to shadow parent.
        const lTemplateClone: BaseXmlNode = pTemplate.clone();
        lTemplateClone.parent = this.shadowParent;
        this.mTemplate = pTemplate;

        // Create new layer of values.
        this.mComponentValues = new LayerValues(pParentLayerValues);

        let lPrefix: string = (this instanceof StaticBuilder) ? 'STATIC' : 'MULTIPLICATE;';
        this.mContentManager = new ContentManager(pModules, lPrefix);
    }

    /**
     * Cleanup all modules, content and anchor.
     * Builder is unuseable after this.
     */
    public deconstruct(): void {
        this.contentManager.deconstruct();
    }

    /**
     * Update content based on changed property.
     */
    public update(): boolean {
        // Update this builder.
        let lUpdated: boolean = this.onUpdate();

        // Update all child builder and keep updated true state.
        for (const lBuilder of this.contentManager.childBuilderList) {
            lUpdated = lBuilder.update() || lUpdated;
        }

        return lUpdated;
    }

    /**
     * Update content.
     * Return all build handler that was alread updated or new created.
     * Calls update on all other builder handler that was not updated.
     */
    protected abstract onUpdate(): boolean;
}