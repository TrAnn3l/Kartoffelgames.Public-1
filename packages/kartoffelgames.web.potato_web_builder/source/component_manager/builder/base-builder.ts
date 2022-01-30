import { ComponentValues } from '../component-values';
import { ContentManager } from '../content/content-manager';
import { ComponentModules } from '../component-modules';
import { ComponentHandler } from '../component-handler';
import { BaseXmlNode } from '@kartoffelgames/core.xml';

/**
 * Builder helper that builds and updates content of component.
 */
export abstract class BaseBuilder {
    private readonly mComponentHandler: ComponentHandler;
    private readonly mComponentValues: ComponentValues;
    private readonly mContentManager: ContentManager;
    private mIgnoreCurrentUpdateCycle: boolean;
    private readonly mInManipulatorScope: boolean;

    /**
     * Get component content of builder.
     */
    public get contentManager(): ContentManager {
        return this.mContentManager;
    }

    /**
     * Get component handler.
     */
    public get componentHandler(): ComponentHandler {
        return this.mComponentHandler;
    }

    /**
     * If builder is inside an manipulator scope.
     */
    public get inManipulatorScope(): boolean {
        return this.mInManipulatorScope;
    }

    /**
     * Get component values of builder.
     */
    public get values(): ComponentValues {
        return this.mComponentValues;
    }

    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    public get anchor(): Comment {
        return this.mContentManager.anchor;
    }

    /**
     * Initialization state of builder.
     */
    public get initialized(): boolean {
        return this.contentManager.initialized;
    }

    /**
     * Get if current update cycle should be ignored.
     */
    public get ignoreCurrentUpdateCycle(): boolean {
        return this.mIgnoreCurrentUpdateCycle;
    }

    /**
     * Set if current update cycle should be ignored.
     */
    public set ignoreCurrentUpdateCycle(pValue: boolean) {
        this.mIgnoreCurrentUpdateCycle = pValue;
    }

    /**
     * Constructor.
     * Builder helper that builds and updates content of component.
     * @param pComponentContent - Component content.
     * @param pComponentValues - New component values.
     * @param pManipulatorScope - If builder is inside an manipulator scope.
     */
    public constructor(pTemplate: Array<BaseXmlNode>, pAttributeModules: ComponentModules, pComponentValues: ComponentValues, pComponentHandler: ComponentHandler, pManipulatorScope: boolean) {
        this.mContentManager = new ContentManager(pTemplate, pAttributeModules);
        this.mComponentValues = pComponentValues;
        this.mInManipulatorScope = pManipulatorScope;
        this.mComponentHandler = pComponentHandler;
    }

    /**
     * Cleanup all modules, content and anchor.
     * Manager is unuseable after this.
     */
    public deleteBuild(): void {
        this.contentManager.clearContent();
    }

    /**
     * Initialize build.
     */
    public initializeBuild(): void {
        // Initialize builder. Create and append content.
        this.initialize();

        // Initialize uninitialized content.
        this.contentManager.initializeContent();
    }

    /**
     * Update content based on changed property.
     */
    public updateBuild(): boolean {
        let lAnyUpdateWasMade: boolean = false;

        // Update only if update has any effect.
        if (!this.mIgnoreCurrentUpdateCycle) {
            // Update this builder.
            if (this.update()) {
                lAnyUpdateWasMade = true;
            }

            // Initialize new content.
            this.contentManager.initializeContent();

            // Update all child builder
            if (this.contentManager.updateChildBuilder()) {
                lAnyUpdateWasMade = true;
            }
        }

        // Reset after this update cycle. Next cycle may have an effect.
        this.mIgnoreCurrentUpdateCycle = false;

        return lAnyUpdateWasMade;
    }

    /**
     * Initialize and build content.
     * Created and appends content.
     * 
     * Do not initialize content.
     */
    protected abstract initialize(): void;

    /**
     * Update content.
     * Return all build handler that was alread updated or new created.
     * Calls update on all other builder handler that was not updated.
     */
    protected abstract update(): boolean;
}