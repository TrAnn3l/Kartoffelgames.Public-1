import { Exception } from '@kartoffelgames/core.data';
import { BaseXmlNode, TextNode, XmlDocument, XmlElement } from '@kartoffelgames/core.xml';
import { ModuleType } from '../../enum/module-type';
import { IPwbAttributeModuleConstructor } from '../../interface/module/attribute-module';
import { IPwbExpressionModule } from '../../interface/module/expression-module';
import { IPwbStaticAttributeModule, PwbStaticAttributeModuleConstructor } from '../../interface/module/static-attribute-module';
import { ComponentModules } from '../../module/component-modules';
import { ElementCreator } from '../content/element-creator';
import { LayerValues } from '../values/layer-values';
import { BaseBuilder } from './base-builder';
import { MultiplicatorBuilder } from './multiplicator-builder';

export class StaticBuilder extends BaseBuilder {
    private mInitialized: boolean;

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

        // Not initialized on start.
        this.mInitialized = false;
    }

    /**
     * Update static builder.
     */
    protected onUpdate(): boolean {
        if (this.mInitialized) {
            this.mInitialized = true;
            this.buildTemplate([this.template]);
        }

        // Get all modules.
        const lModuleList: Array<IPwbExpressionModule | IPwbStaticAttributeModule> = this.contentManager.linkedModuleList;

        // Sort by write->readwrite->read->expression and update.
        lModuleList.sort((pModuleA, pModuleB): number => {
            const lModuleConstructorA: IPwbAttributeModuleConstructor = <IPwbAttributeModuleConstructor><any>pModuleA.constructor;
            const lModuleConstructorB: IPwbAttributeModuleConstructor = <IPwbAttributeModuleConstructor><any>pModuleB.constructor;

            // "Calculate" execution priority of module A.
            let lCompareValueA: number;
            if (lModuleConstructorA.moduleType === ModuleType.Static) {
                if (lModuleConstructorA.isWriting && !lModuleConstructorA.isReading) {
                    lCompareValueA = 4;
                } else if (lModuleConstructorA.isWriting && lModuleConstructorA.isReading) {
                    lCompareValueA = 3;
                } else if (!lModuleConstructorA.isWriting && lModuleConstructorA.isReading) {
                    lCompareValueA = 2;
                }
            } else if (lModuleConstructorA.moduleType === ModuleType.Expression) {
                lCompareValueA = 1;
            }

            // "Calculate" execution priority of module A.
            let lCompareValueB: number;
            if (lModuleConstructorB.moduleType === ModuleType.Static) {
                if (lModuleConstructorB.isWriting && !lModuleConstructorB.isReading) {
                    lCompareValueB = 4;
                } else if (lModuleConstructorB.isWriting && lModuleConstructorB.isReading) {
                    lCompareValueB = 3;
                } else if (!lModuleConstructorB.isWriting && lModuleConstructorB.isReading) {
                    lCompareValueB = 2;
                }
            } else if (lModuleConstructorB.moduleType === ModuleType.Expression) {
                lCompareValueB = 1;
            }

            return lCompareValueA - lCompareValueB;
        });

        let lUpdated: boolean = false;
        for (const lModule of lModuleList) {
            lUpdated = lModule.update() || lUpdated;
        }

        return lUpdated;
    }

    /**
     * Build template. Creates and link modules.
     * @param pTemplateNodeList - Template node list.
     * @param pParentElement - Parent element of templates.
     */
    private buildTemplate(pTemplateNodeList: Array<BaseXmlNode>, pParentElement: Element = null, pShadowParent: BaseXmlNode = null): void {
        // Get shadow parent of template nodes.
        // Use builder shadow parent is template is a root node.
        let lShadowParent: BaseXmlNode = pShadowParent;
        if (!lShadowParent) {
            lShadowParent = this.shadowParent;
        }

        // Create each template.
        for (const lTemplateNode of pTemplateNodeList) {
            if (lTemplateNode instanceof XmlDocument) {
                // Ignore documents just process body.
                this.buildTemplate(lTemplateNode.body, pParentElement, lTemplateNode);
            } else if (lTemplateNode instanceof TextNode) {
                this.buildTextTemplate(lTemplateNode, pParentElement);
            } else if (lTemplateNode instanceof XmlElement) {
                // Differentiate between static and multiplicator templates.
                if (this.contentManager.modules.templateUsesMultiplicatorModule(lTemplateNode)) {
                    this.buildMultiplicatorTemplate(lTemplateNode, pParentElement, lShadowParent);
                } else {
                    this.buildStaticTemplate(lTemplateNode, pParentElement);
                }
            }

            // Ignore comments.
        }
    };

    /**
     * Build text template and append to parent.
     * @param pTextTemplate - Text template.
     * @param pParentHtmlElement - Build parent element of template. 
     */
    public buildTextTemplate(pTextTemplate: TextNode, pParentHtmlElement: Element): void {
        // Create and process expression module, append text node to content.
        const lTextValue: string = pTextTemplate.text;
        const lHtmlNode: Text = ElementCreator.createText('');

        // TODO: Rework expressionmodule.
        // Create and link expression module, link only if text has any expression.
        const lExpressionModule: IPwbExpressionModule = this.contentManager.modules.getExpressionModule(lHtmlNode, null, lTextValue, this.values, this.componentManager);
        if (lExpressionModule.update()) {
            this.contentManager.linkModule(lExpressionModule, lHtmlNode);
        } else {
            lHtmlNode.textContent = lTextValue;
        }

        // Append text to parent.
        this.contentManager.append(lHtmlNode, pParentHtmlElement);
    }

    public buildStaticTemplate(pElementTemplate: XmlElement, pParentHtmlElement: Element) {
        // Build element.
        const lHtmlNode: Element = ElementCreator.createElement(pElementTemplate);

        // Set attributes. Create and link modules.
        for (const lAttribute of pElementTemplate.attributeList) {
            // TODO: Rework static modules.
            // Find attribute module for attribute.
            const lAttributeModule: IPwbStaticAttributeModule = this.contentManager.modules.getStaticModule(
                lHtmlNode,
                pElementTemplate,
                this.values,
                lAttribute,
                this.componentManager
            );

            // Check if module exists for attribute and link.
            if (typeof lAttributeModule !== 'undefined') {
                const lModuleConstructor: PwbStaticAttributeModuleConstructor = <PwbStaticAttributeModuleConstructor>lAttributeModule.constructor;

                // Check if module is allowd in current scope.
                if (this.inManipulatorScope && lModuleConstructor.forbiddenInManipulatorScopes) {
                    throw new Exception(`Module ${lModuleConstructor.attributeSelector.source} is forbidden inside manipulator scopes.`, this);
                }

                this.contentManager.linkModule(lAttributeModule, lHtmlNode);
            } else {
                // TODO: Rework expressionmodule.
                // Create and link expression module, link only if attribute has any expression.
                const lExpressionModule: IPwbExpressionModule = this.contentManager.modules.getExpressionModule(lHtmlNode, lAttribute.qualifiedName, lAttribute.value, this.values, this.componentManager);
                if (lExpressionModule.update()) {
                    this.contentManager.linkModule(lExpressionModule, lHtmlNode);
                } else {
                    lHtmlNode.setAttribute(lAttribute.qualifiedName, lAttribute.value);
                }
            }
        }

        // Append element to parent.
        this.contentManager.append(lHtmlNode, pParentHtmlElement);

        // Build childs.
        this.buildTemplate(pElementTemplate.childList, lHtmlNode, pElementTemplate);
    }

    /**
     * Build template with multiplicator module.
     * Creates a new multiplicator builder and append to content.
     * @param pMultiplicatorTemplate - Template with multiplicator module.
     * @param pParentHtmlElement - Build parent element of template.
     * @param pShadowParent - Parent template element that is loosly linked as parent.
     */
    public buildMultiplicatorTemplate(pMultiplicatorTemplate: XmlElement, pParentHtmlElement: Element, pShadowParent: BaseXmlNode) {
        // Create new component builder and add to content.
        const lMultiplicatorBuilder: MultiplicatorBuilder = new MultiplicatorBuilder(pMultiplicatorTemplate, pShadowParent, this.contentManager.modules, this.values, this);
        this.contentManager.append(lMultiplicatorBuilder, pParentHtmlElement);
    }
}