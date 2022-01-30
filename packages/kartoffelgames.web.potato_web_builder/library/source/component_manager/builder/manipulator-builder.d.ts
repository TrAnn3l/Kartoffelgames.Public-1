import { BaseBuilder } from './base-builder';
import { ComponentValues } from '../component-values';
import { ComponentModules } from '../component-modules';
import { ComponentHandler } from '../component-handler';
import { XmlElement } from '@kartoffelgames/core.xml';
/**
 * Manipulator builder for building single template element with an manipulator module.
 */
export declare class ManipulatorBuilder extends BaseBuilder {
    /**
     * Build handler that handles initialisation and update of template.
     * Always inside an manipulator scope.
     * @param pTemplate - Templates that the component builder needs to build.
     * @param pAttributeModules - All attributes of component.
     * @param pParentComponentValues - Parents component values.
     */
    constructor(pTemplate: XmlElement, pAttributeModules: ComponentModules, pParentComponentValues: ComponentValues, pComponentHandler: ComponentHandler);
    /**
     * Initializes manipulator content.
     * Executes manipulator module on single template element and
     * create new ComponentHandler for each generated template node.
     */
    protected initialize(): void;
    /**
     * Update content dependent on temporar value.
     */
    protected update(): boolean;
    /**
     * Insert new content after last found content.
     * @param pNewContent - New content.
     * @param pLastContent - Last content that comes before new content.
     */
    private insertNewContent;
    /**
     * Update content of manipulator builder.
     * @param pNewContentList - New content list.
     * @param pOldContentList - Old content list.
     */
    private updateStaticBuilder;
}
//# sourceMappingURL=manipulator-builder.d.ts.map