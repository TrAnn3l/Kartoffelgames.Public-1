"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManipulatorBuilder = void 0;
const base_builder_1 = require("./base-builder");
const static_builder_1 = require("./static-builder");
const core_data_1 = require("@kartoffelgames/core.data");
const layer_values_1 = require("../values/layer-values");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
/**
 * Manipulator builder for building single template element with an manipulator module.
 */
class ManipulatorBuilder extends base_builder_1.BaseBuilder {
    /**
     * Build handler that handles initialisation and update of template.
     * Always inside an manipulator scope.
     * @param pTemplate - Templates that the component builder needs to build.
     * @param pAttributeModules - All attributes of component.
     * @param pParentComponentValues - Parents component values.
     */
    constructor(pTemplate, pAttributeModules, pParentComponentValues, pComponentHandler) {
        // Build component data container.
        const lComponentValues = new layer_values_1.LayerValues(pParentComponentValues);
        super(core_data_1.List.newListWith(pTemplate), pAttributeModules, lComponentValues, pComponentHandler, true);
    }
    /**
     * Initializes manipulator content.
     * Executes manipulator module on single template element and
     * create new ComponentHandler for each generated template node.
     */
    initialize() {
        // Template node is always an single template element.
        const lSingleTemplate = this.contentManager.template[0];
        const lTemplateCopy = lSingleTemplate.clone();
        // Executes manipulator module and link module as used one.
        const lManipulatorModule = this.contentManager.attributeModules.getManipulatorModule(lTemplateCopy, this.values, this.componentHandler);
        this.contentManager.manipulatorModule = lManipulatorModule;
        // Execute manipulator module on copied template.
        const lModuleResult = lManipulatorModule.process();
        // Add each created element as static builder.
        for (const lNewElement of lModuleResult.elementList) {
            // Build static builder.
            const lStaticBuilder = new static_builder_1.StaticBuilder(core_data_1.List.newListWith(lNewElement.template), this.contentManager.attributeModules, lNewElement.componentValues ?? this.values, this.componentHandler, true);
            // Add static builder to content.
            this.contentManager.appendContent(null, lStaticBuilder, lNewElement.template);
        }
    }
    /**
     * Update content dependent on temporar value.
     */
    update() {
        let lAnyUpdateWasMade = false;
        // Only proceed if changes exists.
        if (this.contentManager.manipulatorModule.update()) {
            // Template node is always an single template element.
            const lSingleTemplate = this.contentManager.template[0];
            const lTemplateCopy = lSingleTemplate.clone();
            // Get manipulator module.
            const lManipulatorModule = this.contentManager.attributeModules.getManipulatorModule(lTemplateCopy, this.values, this.componentHandler);
            this.contentManager.manipulatorModule = lManipulatorModule;
            // Execute manipulator module on copied template.
            const lModuleResult = lManipulatorModule.process();
            // Get current StaticBuilder. Only content are static builder.
            const lOldStaticBuilderList = this.contentManager.getChildList(null);
            // Update content and save new added builder.
            const lNewAddedBuilder = this.updateStaticBuilder(lOldStaticBuilderList, lModuleResult.elementList);
            // Initialize new added builder.
            for (const lNewBuilder of lNewAddedBuilder) {
                lNewBuilder.initializeBuild();
                // Current update cycle should be ignored.
                // Update have no effect on new created builder. 
                lNewBuilder.ignoreCurrentUpdateCycle = true;
            }
            // An update was made, only when a new builder was added.
            lAnyUpdateWasMade = lNewAddedBuilder.length > 0;
        }
        return lAnyUpdateWasMade;
    }
    /**
     * Insert new content after last found content.
     * @param pNewContent - New content.
     * @param pLastContent - Last content that comes before new content.
     */
    insertNewContent(pNewContent, pLastContent) {
        // Create new static builder.
        const lStaticBuilder = new static_builder_1.StaticBuilder(core_data_1.List.newListWith(pNewContent.template), this.contentManager.attributeModules, pNewContent.componentValues, this.componentHandler, true);
        // Prepend content if no content is before the new content. 
        if (pLastContent === null) {
            this.contentManager.prependContent(null, lStaticBuilder, pNewContent.template);
        }
        else {
            // Append after content that is before the new content. Obviously -,-
            this.contentManager.appendContentAfter(pLastContent, lStaticBuilder, pNewContent.template);
        }
        return lStaticBuilder;
    }
    /**
     * Update content of manipulator builder.
     * @param pNewContentList - New content list.
     * @param pOldContentList - Old content list.
     */
    updateStaticBuilder(pOldContentList, pNewContentList) {
        // Define difference search.
        const lDifferenceSearch = new web_change_detection_1.DifferenceSearch((pA, pB) => {
            return pB.componentValues.equal(pA.values) && pB.template.equals(pA.contentManager.template[0]);
        });
        // Get differences of old an new content.
        const lDifferenceList = lDifferenceSearch.differencesOf(pOldContentList, pNewContentList);
        const lNewAddedBuilder = new Array();
        let lLastContent = null;
        for (const lHistoryItem of lDifferenceList) {
            // Update, Remove or do nothing with static builder depended on change state.
            if (lHistoryItem.changeState === web_change_detection_1.ChangeState.Keep) {
                lLastContent = lHistoryItem.item;
            }
            if (lHistoryItem.changeState === web_change_detection_1.ChangeState.Remove) {
                this.contentManager.removeContent(lHistoryItem.item);
            }
            else if (lHistoryItem.changeState === web_change_detection_1.ChangeState.Insert) {
                // Create new static builder, insert after last content.
                lLastContent = this.insertNewContent(lHistoryItem.item, lLastContent);
                // Save new created builder as new added.
                lNewAddedBuilder.push(lLastContent);
            }
        }
        return lNewAddedBuilder;
    }
}
exports.ManipulatorBuilder = ManipulatorBuilder;
//# sourceMappingURL=manipulator-builder.js.map