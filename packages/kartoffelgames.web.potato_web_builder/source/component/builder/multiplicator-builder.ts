import { BaseXmlNode, XmlElement } from '@kartoffelgames/core.xml';
import { ChangeState, DifferenceSearch, HistoryItem } from '@kartoffelgames/web.change-detection';
import { MultiplicatorModule } from '../../module/base/multiplicator-module';
import { ManipulatorElement, MultiplicatorResult } from '../../module/base/result/multiplicator-result';
import { ComponentModules } from '../component-modules';
import { LayerValues } from '../values/layer-values';
import { BaseBuilder } from './base-builder';
import { StaticBuilder } from './static-builder';

export class MultiplicatorBuilder extends BaseBuilder {

    /**
     * Constructor.
     * @param pTemplate - Template.
     * @param pShadowParent - Shadow parent html element.
     * @param pModules - Attribute modules.
     * @param pParentLayerValues - 
     * @param pParentBuilder 
     */
    public constructor(pTemplate: BaseXmlNode, pShadowParent: BaseXmlNode, pModules: ComponentModules, pParentLayerValues: LayerValues, pParentBuilder: BaseBuilder) {
        super(pTemplate, pShadowParent, pModules, pParentLayerValues, pParentBuilder);
    }

    /**
     * If builder is multiplicator.
     */
    protected isMultiplicator(): boolean {
        return true;
    }

    /**
     * Update content dependent on temporar value. 
     */
    protected onUpdate(): boolean {
        // Create multiplicator module if is does not exist.
        if (!this.contentManager.multiplicatorModule) {
            // Clone template.
            const lTemplateCopy: XmlElement = <XmlElement>this.template.clone();
            lTemplateCopy.parent = this.shadowParent;

            // Create module and save inside
            const lManipulatorModule: MultiplicatorModule = this.contentManager.modules.getElementMultiplicatorModule(lTemplateCopy, this.values);
            this.contentManager.multiplicatorModule = lManipulatorModule;
        }

        // Call module update.
        const lModuleResult: MultiplicatorResult = this.contentManager.multiplicatorModule.update();
        if (lModuleResult) {
            // Add shadow parent to all module results.
            for (const lResult of lModuleResult.elementList) {
                lResult.template.parent = this.shadowParent;
            }

            // Get current StaticBuilder. Only content are static builder.
            const lOldStaticBuilderList: Array<StaticBuilder> = <Array<StaticBuilder>>this.contentManager.rootElementList;

            // Update content and save new added builder.
            this.updateStaticBuilder(lOldStaticBuilderList, lModuleResult.elementList);
        }

        // No need to report any update.
        // New static builder are always updating.
        return false;
    }

    /**
     * Insert new content after last found content.
     * @param pNewContent - New content.
     * @param pLastContent - Last content that comes before new content.
     */
    private insertNewContent(pNewContent: ManipulatorElement, pLastContent: StaticBuilder): StaticBuilder {
        // Create new static builder.
        const lStaticBuilder: StaticBuilder = new StaticBuilder(pNewContent.template, this.shadowParent, this.contentManager.modules, pNewContent.componentValues, this);

        // Prepend content if no content is before the new content. 
        if (pLastContent === null) {
            this.contentManager.prepend(lStaticBuilder);
        } else {
            // Append after content that is before the new content. Obviously -,-
            this.contentManager.after(lStaticBuilder, pLastContent);
        }

        return lStaticBuilder;
    }

    /**
     * Update content of manipulator builder.
     * @param pNewContentList - New content list.
     * @param pOldContentList - Old content list.
     */
    private updateStaticBuilder(pOldContentList: Array<StaticBuilder>, pNewContentList: Array<ManipulatorElement>): void {
        // Define difference search.
        const lDifferenceSearch: DifferenceSearch<StaticBuilder, ManipulatorElement> = new DifferenceSearch<StaticBuilder, ManipulatorElement>((pA, pB) => {
            return pB.componentValues.equal(pA.values) && pB.template.equals(pA.template);
        });

        // Get differences of old an new content.
        const lDifferenceList: Array<HistoryItem<StaticBuilder, ManipulatorElement>> = lDifferenceSearch.differencesOf(pOldContentList, pNewContentList);

        let lLastContent: StaticBuilder = null;
        for (const lHistoryItem of lDifferenceList) {
            // Update, Remove or do nothing with static builder depended on change state.
            if (lHistoryItem.changeState === ChangeState.Keep) {
                lLastContent = lHistoryItem.item;
            } if (lHistoryItem.changeState === ChangeState.Remove) {
                this.contentManager.remove(lHistoryItem.item);
            } else if (lHistoryItem.changeState === ChangeState.Insert) {
                // Create new static builder, insert after last content.
                lLastContent = this.insertNewContent(lHistoryItem.item, lLastContent);
            }
        }
    }
}