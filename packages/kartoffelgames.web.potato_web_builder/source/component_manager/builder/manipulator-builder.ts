import { ManipulatorElement, ModuleManipulatorResult } from '../../module/base/module-manipulator-result';
import { BaseBuilder } from './base-builder';
import { StaticBuilder } from './static-builder';
import { List } from '@kartoffelgames/core.data';
import { ComponentValues } from '../component-values';
import { ComponentModules } from '../component-modules';
import { ComponentHandler } from '../component-handler';
import { XmlElement } from '@kartoffelgames/core.xml';
import { IPwbManipulatorAttributeModule } from '../../interface/manipulator-attribute-module';
import { ChangeState, DifferenceSearch, HistoryItem } from '@kartoffelgames/web.change-detection';

/**
 * Manipulator builder for building single template element with an manipulator module.
 */
export class ManipulatorBuilder extends BaseBuilder {
    /**
     * Build handler that handles initialisation and update of template.
     * Always inside an manipulator scope.
     * @param pTemplate - Templates that the component builder needs to build.
     * @param pAttributeModules - All attributes of component.
     * @param pParentComponentValues - Parents component values.
     */
    public constructor(pTemplate: XmlElement, pAttributeModules: ComponentModules, pParentComponentValues: ComponentValues, pComponentHandler: ComponentHandler) {
        // Build component data container.
        const lComponentValues: ComponentValues = new ComponentValues(pParentComponentValues);

        super(List.newListWith(pTemplate), pAttributeModules, lComponentValues, pComponentHandler, true);
    }

    /**
     * Initializes manipulator content.
     * Executes manipulator module on single template element and
     * create new ComponentHandler for each generated template node.
     */
    protected initialize(): void {
        // Template node is always an single template element.
        const lSingleTemplate: XmlElement = <XmlElement>this.contentManager.template[0];
        const lTemplateCopy: XmlElement = <XmlElement>lSingleTemplate.clone();

        // Executes manipulator module and link module as used one.
        const lManipulatorModule: IPwbManipulatorAttributeModule = this.contentManager.attributeModules.getManipulatorModule(lTemplateCopy, this.values, this.componentHandler);
        this.contentManager.manipulatorModule = lManipulatorModule;

        // Execute manipulator module on copied template.
        const lModuleResult: ModuleManipulatorResult = lManipulatorModule.process();

        // Add each created element as static builder.
        for (const lNewElement of lModuleResult.elementList) {
            // Build static builder.
            const lStaticBuilder: StaticBuilder = new StaticBuilder(List.newListWith(lNewElement.template), this.contentManager.attributeModules, lNewElement.componentValues ?? this.values, this.componentHandler, true);

            // Add static builder to content.
            this.contentManager.appendContent(null, lStaticBuilder, lNewElement.template);
        }
    }

    /**
     * Update content dependent on temporar value. 
     */
    protected update(): boolean {
        let lAnyUpdateWasMade: boolean = false;

        // Only proceed if changes exists.
        if (this.contentManager.manipulatorModule.update()) {
            // Template node is always an single template element.
            const lSingleTemplate: XmlElement = <XmlElement>this.contentManager.template[0];
            const lTemplateCopy: XmlElement = <XmlElement>lSingleTemplate.clone();

            // Get manipulator module.
            const lManipulatorModule: IPwbManipulatorAttributeModule = this.contentManager.attributeModules.getManipulatorModule(lTemplateCopy, this.values, this.componentHandler);
            this.contentManager.manipulatorModule = lManipulatorModule;

            // Execute manipulator module on copied template.
            const lModuleResult: ModuleManipulatorResult = lManipulatorModule.process();

            // Get current StaticBuilder. Only content are static builder.
            const lOldStaticBuilderList: Array<StaticBuilder> = <Array<StaticBuilder>>this.contentManager.getChildList(null);

            // Update content and save new added builder.
            const lNewAddedBuilder: Array<StaticBuilder> = this.updateStaticBuilder(lOldStaticBuilderList, lModuleResult.elementList);

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
    private insertNewContent(pNewContent: ManipulatorElement, pLastContent: StaticBuilder): StaticBuilder {
        // Create new static builder.
        const lStaticBuilder: StaticBuilder = new StaticBuilder(List.newListWith(pNewContent.template), this.contentManager.attributeModules, pNewContent.componentValues, this.componentHandler, true);

        // Prepend content if no content is before the new content. 
        if (pLastContent === null) {
            this.contentManager.prependContent(null, lStaticBuilder, pNewContent.template);
        } else {
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
    private updateStaticBuilder(pOldContentList: Array<StaticBuilder>, pNewContentList: Array<ManipulatorElement>): Array<StaticBuilder> {
        // Define difference search.
        const lDifferenceSearch: DifferenceSearch<StaticBuilder, ManipulatorElement> = new DifferenceSearch<StaticBuilder, ManipulatorElement>((pA, pB) => {
            return pB.componentValues.equal(pA.values) && pB.template.equals(pA.contentManager.template[0]);
        });

        // Get differences of old an new content.
        const lDifferenceList: Array<HistoryItem<StaticBuilder, ManipulatorElement>> = lDifferenceSearch.differencesOf(pOldContentList, pNewContentList);
        const lNewAddedBuilder: Array<StaticBuilder> = new Array<StaticBuilder>();
        
        let lLastContent: StaticBuilder = null;
        for (const lHistoryItem of lDifferenceList) {
            // Update, Remove or do nothing with static builder depended on change state.
            if (lHistoryItem.changeState === ChangeState.Keep) {
                lLastContent = lHistoryItem.item;
            } if (lHistoryItem.changeState === ChangeState.Remove) {
                this.contentManager.removeContent(lHistoryItem.item);
            } else if (lHistoryItem.changeState === ChangeState.Insert) {
                // Create new static builder, insert after last content.
                lLastContent = this.insertNewContent(lHistoryItem.item, lLastContent);

                // Save new created builder as new added.
                lNewAddedBuilder.push(lLastContent);
            }
        }

        return lNewAddedBuilder;
    }
}