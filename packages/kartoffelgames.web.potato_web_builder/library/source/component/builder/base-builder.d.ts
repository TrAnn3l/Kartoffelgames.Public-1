import { LayerValues } from '../values/layer-values';
import { ContentManager } from '../content/content-manager';
import { ComponentModules } from '../component-modules';
import { ComponentManager } from '../component-manager';
import { BaseXmlNode } from '@kartoffelgames/core.xml';
/**
 * Builder helper that builds and updates content of component.
 */
export declare abstract class BaseBuilder {
    private readonly mComponentHandler;
    private readonly mComponentValues;
    private readonly mContentManager;
    private mIgnoreCurrentUpdateCycle;
    private readonly mInManipulatorScope;
    /**
     * Get component content of builder.
     */
    get contentManager(): ContentManager;
    /**
     * Get component handler.
     */
    get componentHandler(): ComponentManager;
    /**
     * If builder is inside an manipulator scope.
     */
    get inManipulatorScope(): boolean;
    /**
     * Get component values of builder.
     */
    get values(): LayerValues;
    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    get anchor(): Comment;
    /**
     * Initialization state of builder.
     */
    get initialized(): boolean;
    /**
     * Get if current update cycle should be ignored.
     */
    get ignoreCurrentUpdateCycle(): boolean;
    /**
     * Set if current update cycle should be ignored.
     */
    set ignoreCurrentUpdateCycle(pValue: boolean);
    /**
     * Constructor.
     * Builder helper that builds and updates content of component.
     * @param pComponentContent - Component content.
     * @param pComponentValues - New component values.
     * @param pManipulatorScope - If builder is inside an manipulator scope.
     */
    constructor(pTemplate: Array<BaseXmlNode>, pAttributeModules: ComponentModules, pComponentValues: LayerValues, pComponentHandler: ComponentManager, pManipulatorScope: boolean);
    /**
     * Cleanup all modules, content and anchor.
     * Manager is unuseable after this.
     */
    deleteBuild(): void;
    /**
     * Initialize build.
     */
    initializeBuild(): void;
    /**
     * Update content based on changed property.
     */
    updateBuild(): boolean;
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
//# sourceMappingURL=base-builder.d.ts.map