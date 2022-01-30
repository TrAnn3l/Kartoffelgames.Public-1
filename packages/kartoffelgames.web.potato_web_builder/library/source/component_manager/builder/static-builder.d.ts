import { BaseBuilder } from './base-builder';
import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { ComponentValues } from '../component-values';
import { ComponentModules } from '../component-modules';
import { ComponentHandler } from '../component-handler';
export declare class StaticBuilder extends BaseBuilder {
    /**
     * Build handler that handles initialisation and update of template.
     * @param pTemplates - Templates that the component builder needs to build.
     * @param pAttributeModules - All attributes of component.
     * @param pParentComponentValues - Parents component values.
     * @param pManipulatorScope - If builder is inside an manipulator scope.
     */
    constructor(pTemplates: Array<BaseXmlNode>, pAttributeModules: ComponentModules, pParentComponentValues: ComponentValues, pComponentHandler: ComponentHandler, pManipulatorScope: boolean);
    /**
     * Initialize build.
     * Initializes builder in content after this function.
     */
    initialize(): void;
    /**
     * Update all template elements that are affected by the property change.
     */
    protected update(): boolean;
    /**
     * Add native attributes or text and execute all expressions.
     * @param pNode - Element or Text-
     * @param pTemplate - Template. Not required for Text.
     */
    private addNativeData;
    /**
     * Recursion.
     * Build content frames. HTMLElements without parameter.
     * Custom elements will be created as correct elements.
     * @param pParentHtmlElement - Parent element of template.
     * @param pTemplate - Template element that should be build.
     */
    private buildContentFrame;
    /**
     * Add all Attributes and TextNodes and execute all expressions that are inside texts.
     * @param pParentElement - Parent element which child are checked expressions and executes.
     * @param pBufferTemplates - Buffer with current executed modules.
     */
    private deepAddNativeData;
    /**
     * Executes all modules of parents childs.
     * Updates buffer templates.
     * Returns if any module manipulates the templates attributes.
     * @param pParentElement - Parent element which child are checked for modules and executes.
     * @param pBufferTemplates - Buffer with current executed modules.
     * @param pAccessFilter - [OPTIONAL] Execute only modules which has the specified accessor type.
     */
    private deepExecuteTemplateModules;
    /**
     * Executes module, add rebuild trigger and link module with element.
     * @param pModule - Static module.
     * @param pElement -Element of module.
     */
    private executeModule;
    /**
     * Execute all modules of template for element of specified access type.
     * @param pElement - Element for which all modules should be executed.
     * @param pTemplate - Template element of element.
     * @param pModuleFilter - Filter for modules access types.
     */
    private executeTemplateModules;
}
//# sourceMappingURL=static-builder.d.ts.map