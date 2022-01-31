"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuilder = void 0;
const content_manager_1 = require("../content/content-manager");
/**
 * Builder helper that builds and updates content of component.
 */
class BaseBuilder {
    /**
     * Constructor.
     * Builder helper that builds and updates content of component.
     * @param pComponentContent - Component content.
     * @param pComponentValues - New component values.
     * @param pManipulatorScope - If builder is inside an manipulator scope.
     */
    constructor(pTemplate, pAttributeModules, pComponentValues, pComponentHandler, pManipulatorScope) {
        this.mContentManager = new content_manager_1.ContentManager(pTemplate, pAttributeModules);
        this.mComponentValues = pComponentValues;
        this.mInManipulatorScope = pManipulatorScope;
        this.mComponentHandler = pComponentHandler;
    }
    /**
     * Get component content of builder.
     */
    get contentManager() {
        return this.mContentManager;
    }
    /**
     * Get component handler.
     */
    get componentHandler() {
        return this.mComponentHandler;
    }
    /**
     * If builder is inside an manipulator scope.
     */
    get inManipulatorScope() {
        return this.mInManipulatorScope;
    }
    /**
     * Get component values of builder.
     */
    get values() {
        return this.mComponentValues;
    }
    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    get anchor() {
        return this.mContentManager.anchor;
    }
    /**
     * Initialization state of builder.
     */
    get initialized() {
        return this.contentManager.initialized;
    }
    /**
     * Get if current update cycle should be ignored.
     */
    get ignoreCurrentUpdateCycle() {
        return this.mIgnoreCurrentUpdateCycle;
    }
    /**
     * Set if current update cycle should be ignored.
     */
    set ignoreCurrentUpdateCycle(pValue) {
        this.mIgnoreCurrentUpdateCycle = pValue;
    }
    /**
     * Cleanup all modules, content and anchor.
     * Manager is unuseable after this.
     */
    deleteBuild() {
        this.contentManager.clearContent();
    }
    /**
     * Initialize build.
     */
    initializeBuild() {
        // Initialize builder. Create and append content.
        this.initialize();
        // Initialize uninitialized content.
        this.contentManager.initializeContent();
    }
    /**
     * Update content based on changed property.
     */
    updateBuild() {
        let lAnyUpdateWasMade = false;
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
}
exports.BaseBuilder = BaseBuilder;
//# sourceMappingURL=base-builder.js.map