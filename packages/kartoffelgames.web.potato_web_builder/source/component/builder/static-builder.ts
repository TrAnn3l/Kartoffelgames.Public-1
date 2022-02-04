import { BaseContent, HtmlContent } from '../../types';
import { BaseBuilder } from './base-builder';
import { ManipulatorBuilder } from './manipulator-builder';
import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { BaseXmlNode, TextNode, XmlElement } from '@kartoffelgames/core.xml';
import { LayerValues } from '../values/layer-values';
import { ComponentModules } from '../component-modules';
import { ComponentManager } from '../component-manager';
import { ElementCreator } from '../content/element-creator';
import { IPwbStaticAttributeModule, PwbStaticAttributeModuleConstructor } from '../../interface/module/static-attribute-module';
import { IPwbExpressionModule } from '../../interface/module/expression-module';
import { AttributeModuleAccessType } from '../../enum/attribute-module-access-type';

export class StaticBuilder extends BaseBuilder {
    /**
     * Build handler that handles initialisation and update of template.
     * @param pTemplates - Templates that the component builder needs to build.
     * @param pAttributeModules - All attributes of component.
     * @param pParentComponentValues - Parents component values.
     * @param pManipulatorScope - If builder is inside an manipulator scope.
     */
    public constructor(pTemplates: Array<BaseXmlNode>, pAttributeModules: ComponentModules, pParentComponentValues: LayerValues, pComponentHandler: ComponentManager, pManipulatorScope: boolean) {
        super(pTemplates, pAttributeModules, new LayerValues(pParentComponentValues), pComponentHandler, pManipulatorScope);
    }

    /**
     * Initialize build.
     * Initializes builder in content after this function.
     */
    public initialize(): void {
        this.buildContentFrame(null, this.contentManager.template);

        // Create temporary templates for execution.
        const lBufferTemplates: Dictionary<HtmlContent, XmlElement> = new Dictionary<HtmlContent, XmlElement>();

        // Execute all none manipulative modules.
        let lAttributeChanged: boolean = true;
        let lIterations: number = 0;
        while (lAttributeChanged) {
            if (++lIterations > 20) {
                throw new Exception('To many module iteration. Check for attribute manipulation loops or to many attributes.', this);
            }

            // Execute all read modules and restart execution chain if any module has manipulated templates attributes.
            if (this.deepExecuteTemplateModules(null, lBufferTemplates, AttributeModuleAccessType.Write)) {
                continue;
            }

            // Execute all read/write modules and restart execution chain if any module has manipulated templates attributes.
            if (this.deepExecuteTemplateModules(null, lBufferTemplates, AttributeModuleAccessType.ReadWrite)) {
                continue;
            }

            // Execute all writing modules.  No restart needed. Writing modules can not manipulate attributes.
            this.deepExecuteTemplateModules(null, lBufferTemplates, AttributeModuleAccessType.Read);
            lAttributeChanged = false;
        }

        // Add all none module attributes and texts
        this.deepAddNativeData(null, lBufferTemplates);
    }

    /**
     * Update all template elements that are affected by the property change.
     */
    protected update(): boolean {
        // Get all modules that are currently used. Sort by module write , read/write, read.
        let lStaticModule: Array<IPwbStaticAttributeModule> = this.contentManager.linkedStaticModules;
        lStaticModule = lStaticModule.sort((pA, pB) => {
            const lConstructorA: PwbStaticAttributeModuleConstructor = <PwbStaticAttributeModuleConstructor>pA.constructor;
            const lConstructorB: PwbStaticAttributeModuleConstructor = <PwbStaticAttributeModuleConstructor>pB.constructor;

            if (lConstructorA.isWriting && lConstructorB.isReading) {
                return -1;
            }

            return 0;
        });

        let lAnyUpdateWasMade: boolean = false;

        // Update all modules. Result doesn't matter should allways be false.
        for (const lModule of lStaticModule) {
            if (lModule.update()) {
                lAnyUpdateWasMade = true;
            }
        }

        // Get all used expression modules. Those have always low priority. No need to sort.
        const lExpressionModules: Array<IPwbExpressionModule> = this.contentManager.linkedExpressionModules;
        for (const lModule of lExpressionModules) {
            if (lModule.update()) {
                lAnyUpdateWasMade = true;
            }
        }

        return lAnyUpdateWasMade;
    }

    /**
     * Add native attributes or text and execute all expressions.
     * @param pNode - Element or Text-
     * @param pTemplate - Template. Not required for Text.
     */
    private addNativeData(pNode: HtmlContent, pTemplate: BaseXmlNode): void;
    private addNativeData(pNode: Text): void;
    private addNativeData(pNode: Text | HtmlContent, pTemplate?: BaseXmlNode): void {
        if (pNode instanceof Element) {
            // For each xml attribute.
            for (const lAttribute of (<XmlElement>pTemplate).attributeList) {
                // Get expression module and process.
                const lExpressionModule: IPwbExpressionModule = this.contentManager.attributeModules.getExpressionModule(pNode, lAttribute.name, lAttribute.value, this.values, this.componentHandler);
                const lHadExpression: boolean = lExpressionModule.process();

                // Link module and element if attribute had any expression.
                if (lHadExpression) {
                    this.contentManager.linkModule(pNode, lExpressionModule);
                }
            }
        } else if (pNode instanceof Text) {
            // Use original because it does not get altered.
            const lOriginalTemplate: TextNode = this.contentManager.getTemplateByContent(pNode);

            // Get expression module and process.
            const lExpressionModule: IPwbExpressionModule = this.contentManager.attributeModules.getExpressionModule(pNode, null, lOriginalTemplate.text, this.values, this.componentHandler);
            const lHadExpression: boolean = lExpressionModule.process();

            // Link module and element if text had any expression.
            if (lHadExpression) {
                this.contentManager.linkModule(pNode, lExpressionModule);
            }
        }
    }

    /**
     * Recursion.
     * Build content frames. HTMLElements without parameter.
     * Custom elements will be created as correct elements.
     * @param pParentHtmlElement - Parent element of template.
     * @param pTemplate - Template element that should be build.
     */
    private buildContentFrame(pParentHtmlElement: HtmlContent | null, pTemplate: Array<BaseXmlNode>) {
        // For each template node inside template.
        for (const lTemplateNode of pTemplate) {
            // Check template type.
            if (lTemplateNode instanceof TextNode) {
                // Create and add empt text node mustache expression is executed later.
                const lTextNode = ElementCreator.createText('');
                this.contentManager.appendContent(pParentHtmlElement, lTextNode, lTemplateNode);
            } else if (lTemplateNode instanceof XmlElement) {
                // Check if template element is manipulator or not.
                if (this.contentManager.attributeModules.checkTemplateIsManipulator(lTemplateNode)) {
                    // Create new component builder and add to content.
                    const lManipulatorBuilder: ManipulatorBuilder = new ManipulatorBuilder(lTemplateNode, this.contentManager.attributeModules, this.values, this.componentHandler);

                    this.contentManager.appendContent(pParentHtmlElement, lManipulatorBuilder, lTemplateNode);
                } else {
                    // Try to get potential parent if no real parent is specified.
                    const lFutureparent: Element = pParentHtmlElement ?? this.contentManager.getLastElement().parentElement;

                    // Create HTMLElement or custom element.
                    const lCreatedHtmlElement: HtmlContent = ElementCreator.createElement(lTemplateNode, lFutureparent);

                    // Append element to component content.
                    this.contentManager.appendContent(pParentHtmlElement, lCreatedHtmlElement, lTemplateNode);

                    // Add all childs to this element
                    this.buildContentFrame(lCreatedHtmlElement, <Array<BaseXmlNode>>lTemplateNode.childList);
                }
            }
        }
    }

    /**
     * Add all Attributes and TextNodes and execute all expressions that are inside texts.
     * @param pParentElement - Parent element which child are checked expressions and executes.
     * @param pBufferTemplates - Buffer with current executed modules.
     */
    private deepAddNativeData(pParentElement: HtmlContent | null, pBufferTemplates: Dictionary<HtmlContent, XmlElement>): void {
        const lChildList: Array<BaseContent> = this.contentManager.getChildList(pParentElement);

        // For each child.
        for (const lChild of lChildList) {
            if (lChild instanceof Element) {
                // All buffer templates should be initalised. So no check for undefined.
                const lBufferTemplate: XmlElement = pBufferTemplates.get(lChild);

                // Add all native data to child.
                this.addNativeData(lChild, lBufferTemplate);

                // Add attributes and texts for all childs.
                this.deepAddNativeData(lChild, pBufferTemplates);
            } else if (lChild instanceof Text) {
                this.addNativeData(lChild);
            }
        }
    }

    /**
     * Executes all modules of parents childs.
     * Updates buffer templates.
     * Returns if any module manipulates the templates attributes.
     * @param pParentElement - Parent element which child are checked for modules and executes.
     * @param pBufferTemplates - Buffer with current executed modules.
     * @param pAccessFilter - [OPTIONAL] Execute only modules which has the specified accessor type.
     */
    private deepExecuteTemplateModules(pParentElement: HtmlContent | null, pBufferTemplates: Dictionary<HtmlContent, XmlElement>, pAccessFilter: AttributeModuleAccessType): boolean {
        const lChildList: Array<BaseContent> = this.contentManager.getChildList(pParentElement);
        let lModuleWasExecuted: boolean = false;

        // For each child.
        for (const lChild of lChildList) {
            // Only html elements.
            if (lChild instanceof Element) {
                // Try to get current buffer template.
                let lBufferTemplate: XmlElement = pBufferTemplates.get(lChild);
                if (typeof lBufferTemplate === 'undefined') {
                    // Get clone of template element.
                    lBufferTemplate = <XmlElement>this.contentManager.getTemplateByContent(lChild).clone();
                    pBufferTemplates.add(lChild, lBufferTemplate);
                }

                // Execute all modules of child with set access type.
                if (this.executeTemplateModules(lChild, lBufferTemplate, pAccessFilter)) {
                    lModuleWasExecuted = true;
                }

                // Execute all modules for child childs
                if (this.deepExecuteTemplateModules(lChild, pBufferTemplates, pAccessFilter)) {
                    lModuleWasExecuted = true;
                }
            }
        }

        return lModuleWasExecuted;
    }

    /**
     * Executes module, add rebuild trigger and link module with element.
     * @param pModule - Static module.
     * @param pElement -Element of module.
     */
    private executeModule(pModule: IPwbStaticAttributeModule, pTargetElement: HtmlContent): boolean {
        const lModuleConstructor: PwbStaticAttributeModuleConstructor = <PwbStaticAttributeModuleConstructor>pModule.constructor;

        // Check if module is allowd in current scope.
        if (this.inManipulatorScope && lModuleConstructor.forbiddenInManipulatorScopes) {
            throw new Exception(`Module ${lModuleConstructor.attributeSelector.source} is forbidden inside manipulator scopes.`, this);
        }

        // Execute module. No useable result. 
        pModule.process();

        // Map module with build child.
        this.contentManager.linkModule(pTargetElement, pModule);

        // Check if module manipulates templates attributes.
        return lModuleConstructor.manipulatesAttributes;
    }

    /**
     * Execute all modules of template for element of specified access type.
     * @param pElement - Element for which all modules should be executed.
     * @param pTemplate - Template element of element.
     * @param pModuleFilter - Filter for modules access types.
     */
    private executeTemplateModules(pElement: HtmlContent, pTemplate: XmlElement, pModuleFilter: AttributeModuleAccessType): boolean {
        let lManipulatedAttributes: boolean = false;

        // For each xml attribute.
        for (const lAttribute of pTemplate.attributeList) {
            // Find attribute module for attribute.
            const lAttributeModule: IPwbStaticAttributeModule = this.contentManager.attributeModules.getStaticModule(
                pElement,
                pTemplate,
                this.values,
                lAttribute,
                this.componentHandler,
                pModuleFilter
            );

            // Check if module exists for attribute.
            if (typeof lAttributeModule !== 'undefined') {
                // Check if module manipulates templates attributes.
                if (this.executeModule(lAttributeModule, pElement)) {
                    lManipulatedAttributes = true;
                }
            }
        }

        return lManipulatedAttributes;
    }
}
