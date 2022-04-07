import { TextNode, XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ExpressionModule } from '../module/base/expression-module';
import { MultiplicatorModule } from '../module/base/multiplicator-module';
import { StaticModule } from '../module/base/static-module';
// Import default modules
import '../module/default/attribute_module/event-attribute-module';
import '../module/default/attribute_module/for-of-manipulator-attribute-module';
import '../module/default/attribute_module/id-child-attribute-module';
import '../module/default/attribute_module/if-manipulator-attribute-module';
import '../module/default/attribute_module/one-way-binding-attribute-module';
import '../module/default/attribute_module/slot-attribute-module';
import '../module/default/attribute_module/two-way-binding-attribute-module';
import { MustacheExpressionModule } from '../module/default/mustache-expression-module';
import { ModuleType } from '../module/base/enum/module-type';
import { IPwbExpressionModuleClass, IPwbMultiplicatorModuleClass, IPwbStaticModuleClass } from '../module/base/interface/module';
import { Modules } from '../module/modules';
import { ComponentManager } from './component-manager';
import { LayerValues } from './values/layer-values';


export class ComponentModules {
    private readonly mComponentManager: ComponentManager;
    private readonly mExpressionModule: IPwbExpressionModuleClass;

    /**
     * Constructor.
     * @param pExpressionModule - default expression module for this component. 
     * @param pComponentManager - Component manager.
     */
    public constructor(pComponentManager: ComponentManager, pExpressionModule?: IPwbExpressionModuleClass) {
        // Get expression module.
        this.mExpressionModule = pExpressionModule ?? <IPwbExpressionModuleClass><any>MustacheExpressionModule;
        this.mComponentManager = pComponentManager;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Template element.
     * @param pValues - Values of current layer.
     */
    public getElementMultiplicatorModule(pTemplate: XmlElement, pValues: LayerValues): MultiplicatorModule {
        // Find manipulator module inside attributes.
        for (const lDefinition of Modules.moduleDefinitions) {
            // Only manipulator modules.
            if (lDefinition.type === ModuleType.Manipulator) {
                for (const lAttribute of pTemplate.attributeList) {
                    if (lDefinition.selector.test(lAttribute.qualifiedName)) {
                        // Get constructor and create new module.
                        const lModule: MultiplicatorModule = new MultiplicatorModule({
                            moduleDefinition: lDefinition,
                            moduleClass: <IPwbMultiplicatorModuleClass>Modules.getModuleClass(lDefinition),
                            targetTemplate: pTemplate,
                            targetAttribute: lAttribute,
                            values: pValues,
                            componentManager: this.mComponentManager,
                        });

                        return lModule;
                    }
                }
            }
        }
    }

    /**
     * Get all static modules of template.
     * @param pTemplate - Template
     * @param pElement - Build template.
     * @param pValues - Layer values.
     */
    public getElementStaticModules(pTemplate: XmlElement, pElement: Element, pValues: LayerValues): Array<ExpressionModule | StaticModule> {
        const lModules: Array<ExpressionModule | StaticModule> = new Array<ExpressionModule | StaticModule>();

        // Find static modules inside attributes.
        for (const lAttribute of pTemplate.attributeList) {
            let lModuleFound: boolean = false;

            // Find static modules.
            for (const lDefinition of Modules.moduleDefinitions) {
                if (lDefinition.type === ModuleType.Static && lDefinition.selector.test(lAttribute.qualifiedName)) {
                    // Get constructor and create new module.
                    const lModule: StaticModule = new StaticModule({
                        moduleDefinition: lDefinition,
                        moduleClass: <IPwbStaticModuleClass>Modules.getModuleClass(lDefinition),
                        targetTemplate: pTemplate,
                        targetAttribute: lAttribute,
                        values: pValues,
                        componentManager: this.mComponentManager,
                        targetNode: pElement
                    });

                    lModules.push(lModule);
                    lModuleFound = true;
                    break;
                }
            }

            // When no static module is found, use expression module.
            if (!lModuleFound) {
                const lModule: ExpressionModule = new ExpressionModule({
                    moduleDefinition: Modules.getModuleDefinition(this.mExpressionModule),
                    moduleClass: this.mExpressionModule,
                    targetTemplate: pTemplate,
                    targetAttribute: lAttribute,
                    values: pValues,
                    componentManager: this.mComponentManager,
                    targetNode: pElement
                });

                lModules.push(lModule);
            }
        }

        return lModules;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Key list for possible multiplicator modules.
     */
    public getMultiplicatorAttribute(pTemplate: XmlElement): XmlAttribute {
        // Find manipulator module inside attributes.
        for (const lDefinition of Modules.moduleDefinitions) {
            // Only manipulator modules.
            if (lDefinition.type === ModuleType.Manipulator) {
                for (const lAttribute of pTemplate.attributeList) {
                    if (lDefinition.selector.test(lAttribute.qualifiedName)) {
                        return lAttribute;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Text node template.
     * @param pTextNode - Build text node.
     * @param pValues - Values of current layer.
     */
    public getTextExpressionModule(pTemplate: TextNode, pTextNode: Text, pValues: LayerValues): ExpressionModule {
        const lModule: ExpressionModule = new ExpressionModule({
            moduleDefinition: Modules.getModuleDefinition(this.mExpressionModule),
            moduleClass: this.mExpressionModule,
            targetTemplate: pTemplate,
            values: pValues,
            componentManager: this.mComponentManager,
            targetNode: pTextNode
        });

        return lModule;
    }

}