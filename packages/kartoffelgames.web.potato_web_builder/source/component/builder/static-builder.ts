import { Exception } from '@kartoffelgames/core.data';
import { BaseXmlNode, TextNode, XmlAttribute, XmlDocument, XmlElement } from '@kartoffelgames/core.xml';
import { BaseModule } from '../../module/base-module';
import { ExpressionModule } from '../../module/expression-module';
import { StaticModule } from '../../module/static-module';
import { ComponentModules } from '../component-modules';
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
    public constructor(pTemplate: BaseXmlNode, pShadowParent: BaseXmlNode, pModules: ComponentModules, pParentLayerValues: LayerValues, pParentBuilder: BaseBuilder | null) {
        super(pTemplate, pShadowParent, pModules, pParentLayerValues, pParentBuilder);

        // Not initialized on start.
        this.mInitialized = false;
    }

    /**
     * Build template with multiplicator module.
     * Creates a new multiplicator builder and append to content.
     * @param pMultiplicatorTemplate - Template with multiplicator module.
     * @param pParentHtmlElement - Build parent element of template.
     * @param pShadowParent - Parent template element that is loosly linked as parent.
     */
    public buildMultiplicatorTemplate(pMultiplicatorTemplate: XmlElement, pParentHtmlElement: Element | null, pShadowParent: BaseXmlNode): void {
        // Create new component builder and add to content.
        const lMultiplicatorBuilder: MultiplicatorBuilder = new MultiplicatorBuilder(pMultiplicatorTemplate, pShadowParent, this.contentManager.modules, this.values, this);
        this.contentManager.append(lMultiplicatorBuilder, pParentHtmlElement);
    }

    /**
     * Build static template.
     * Create and link all modules.
     * @param pElementTemplate - Element template.
     * @param pParentHtmlElement - Parent of template.
     */
    public buildStaticTemplate(pElementTemplate: XmlElement, pParentHtmlElement: Element | null): void {
        // Build element.
        const lHtmlNode: Element = ElementCreator.createElement(pElementTemplate);

        // Every attribute is a module. Even text attributes without any any expression.
        for (const lModule of this.contentManager.modules.getElementStaticModules(pElementTemplate, lHtmlNode, this.values)) {
            // Check if module is allowd in current scope.
            if (this.inManipulatorScope && lModule.moduleDefinition.forbiddenInManipulatorScopes) {
                throw new Exception(`Module ${lModule.moduleDefinition.selector.source} is forbidden inside manipulator scopes.`, this);
            }

            // Link modules.
            this.contentManager.linkModule(lModule, lHtmlNode);
        }

        // Append element to parent.
        this.contentManager.append(lHtmlNode, pParentHtmlElement);

        // Build childs.
        this.buildTemplate(pElementTemplate.childList, lHtmlNode, pElementTemplate);
    }

    /**
     * Build text template and append to parent.
     * @param pTextTemplate - Text template.
     * @param pParentHtmlElement - Build parent element of template. 
     */
    public buildTextTemplate(pTextTemplate: TextNode, pParentHtmlElement: Element | null): void {
        // Create and process expression module, append text node to content.
        const lHtmlNode: Text = ElementCreator.createText('');

        // Create and link expression module, link only if text has any expression.
        const lExpressionModule: ExpressionModule = this.contentManager.modules.getTextExpressionModule(pTextTemplate, lHtmlNode, this.values);
        this.contentManager.linkModule(lExpressionModule, lHtmlNode);

        // Append text to parent.
        this.contentManager.append(lHtmlNode, pParentHtmlElement);
    }

    /**
     * If builder is multiplicator.
     */
    protected isMultiplicator(): boolean {
        return false;
    }

    /**
     * Update static builder.
     */
    protected onUpdate(): boolean {
        if (!this.mInitialized) {
            this.mInitialized = true;
            this.buildTemplate([this.template]);
        }

        // Get all modules.
        const lModuleList: Array<BaseModule<any, boolean>> = this.contentManager.linkedModuleList;

        // Sort by write->readwrite->read->expression and update.
        lModuleList.sort((pModuleA, pModuleB): number => {
            // "Calculate" execution priority of module A.
            let lCompareValueA: number;
            if (pModuleA instanceof StaticModule) {
                if (pModuleA.isWriting && !pModuleA.isReading) {
                    lCompareValueA = 4;
                } else if (pModuleA.isWriting && pModuleA.isReading) {
                    lCompareValueA = 3;
                } else { // if (!pModuleA.isWriting && pModuleA.isReading) {
                    lCompareValueA = 2;
                }
            } else { // Expression
                lCompareValueA = 1;
            }

            // "Calculate" execution priority of module A.
            let lCompareValueB: number;
            if (pModuleB instanceof StaticModule) {
                if (pModuleB.isWriting && !pModuleB.isReading) {
                    lCompareValueB = 4;
                } else if (pModuleB.isWriting && pModuleB.isReading) {
                    lCompareValueB = 3;
                } else { // if (!pModuleB.isWriting && pModuleB.isReading) 
                    lCompareValueB = 2;
                }
            } else {
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
    private buildTemplate(pTemplateNodeList: Array<BaseXmlNode>, pParentElement: Element | null = null, pShadowParent: BaseXmlNode | null = null): void {
        // Get shadow parent of template nodes.
        // Use builder shadow parent is template is a root node.
        let lShadowParent: BaseXmlNode | null = pShadowParent;
        if (lShadowParent === null) {
            lShadowParent = this.shadowParent;
        }

        // Create each template.
        for (const lTemplateNode of pTemplateNodeList) {
            /* istanbul ignore else */
            if (lTemplateNode instanceof XmlDocument) {
                // Ignore documents just process body.
                this.buildTemplate(lTemplateNode.body, pParentElement, lTemplateNode);
            } else if (lTemplateNode instanceof TextNode) {
                this.buildTextTemplate(lTemplateNode, pParentElement);
            } else if (lTemplateNode instanceof XmlElement) {
                // Differentiate between static and multiplicator templates.
                const lMultiplicatorAttribute: XmlAttribute | undefined = this.contentManager.modules.getMultiplicatorAttribute(lTemplateNode);
                if (lMultiplicatorAttribute) {
                    this.buildMultiplicatorTemplate(lTemplateNode, pParentElement, lShadowParent);
                } else {
                    this.buildStaticTemplate(lTemplateNode, pParentElement);
                }
            }

            // Ignore comments.
        }
    }
}