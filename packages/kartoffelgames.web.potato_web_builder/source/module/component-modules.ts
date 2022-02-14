import { Dictionary } from '@kartoffelgames/core.data';
import { LayerValues, TextNode, XmlAttribute, XmlElement } from '..';
import { ComponentManager } from '../component/component-manager';
import { ModuleType } from '../enum/module-type';
import { IPwbExpressionModuleClass, IPwbModuleClass, IPwbMultiplicatorModuleClass, IPwbStaticModuleClass, ModuleDefinition } from '../interface/module';
import { ExpressionModule } from './base/expression-module';
import { MultiplicatorModule } from './base/multiplicator-module';
import { StaticModule } from './base/static-module';
import { MustacheExpressionModule } from './default/mustache-expression-module';

// Import default modules
import './default/attribute_module/event-attribute-module';
import './default/attribute_module/for-of-manipulator-attribute-module';
import './default/attribute_module/id-child-attribute-module';
import './default/attribute_module/if-manipulator-attribute-module';
import './default/attribute_module/one-way-binding-attribute-module';
import './default/attribute_module/slot-attribute-module';
import './default/attribute_module/two-way-binding-attribute-module';

export class ComponentModules {
    private static readonly mModuleClasses: Dictionary<ModuleDefinition, IPwbModuleClass<unknown>> = new Dictionary<ModuleDefinition, IPwbModuleClass<unknown>>();
    private static readonly mModuleDefinition: Dictionary<IPwbModuleClass<unknown>, ModuleDefinition> = new Dictionary<IPwbModuleClass<unknown>, ModuleDefinition>();

    /**
     * Add module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    public static add(pModuleClass: IPwbModuleClass<unknown>, pModuleDefinition: ModuleDefinition) {
        ComponentModules.mModuleClasses.set(pModuleDefinition, pModuleClass);
        ComponentModules.mModuleDefinition.set(pModuleClass, pModuleDefinition);
    }

    private readonly mExpressionModule: IPwbExpressionModuleClass;

    /**
     * Constructor.
     * @param pExpressionModule - default expression module for this component. 
     */
    public constructor(pExpressionModule?: IPwbExpressionModuleClass) {
        // Get expression module.
        this.mExpressionModule = pExpressionModule ?? <IPwbExpressionModuleClass><any>MustacheExpressionModule;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Key list for possible multiplicator modules.
     */
    public getMultiplicatorAttribute(pTemplate: XmlElement): XmlAttribute {
        // Find manipulator module inside attributes.
        for (const lDefinition of ComponentModules.mModuleDefinition.values()) {
            for (const lAttribute of pTemplate.attributeList) {
                if (lDefinition.selector.test(lAttribute.qualifiedName)) {
                    return lAttribute;
                }
            }
        }

        return null;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pKeyList - Key list for possible multiplicator modules.
     */
    public getElementMultiplicatorModule(pTemplate: XmlElement, pValues: LayerValues, pComponentManager: ComponentManager): MultiplicatorModule {
        // Find manipulator module inside attributes.
        for (const lDefinition of ComponentModules.mModuleDefinition.values()) {
            for (const lAttribute of pTemplate.attributeList) {
                if (lDefinition.type === ModuleType.Manipulator && lDefinition.selector.test(lAttribute.qualifiedName)) {
                    // Get constructor and create new module.
                    const lModule: MultiplicatorModule = new MultiplicatorModule({
                        moduleDefinition: lDefinition,
                        moduleClass: <IPwbMultiplicatorModuleClass>ComponentModules.mModuleClasses.get(lDefinition),
                        targetTemplate: pTemplate,
                        targetAttribute: lAttribute,
                        values: pValues,
                        componentManager: pComponentManager,
                    });

                    return lModule;
                }
            }
        }

        return null;
    }

    /**
     * Get all static modules of template.
     * @param pTemplate - Template
     * @param pElement - Build template.
     * @param pValues - Layer values.
     * @param pComponentManager - Component manager.
     */
    public getElementStaticModules(pTemplate: XmlElement, pElement: Element, pValues: LayerValues, pComponentManager: ComponentManager): Array<ExpressionModule | StaticModule> {
        const lModules: Array<ExpressionModule | StaticModule> = new Array<ExpressionModule | StaticModule>();

        // Find static modules inside attributes.
        for (const lAttribute of pTemplate.attributeList) {
            let lModuleFound: boolean = false;

            // Find static modules.
            for (const lDefinition of ComponentModules.mModuleDefinition.values()) {
                if (lDefinition.type === ModuleType.Static && lDefinition.selector.test(lAttribute.qualifiedName)) {
                    // Get constructor and create new module.
                    const lModule: StaticModule = new StaticModule({
                        moduleDefinition: lDefinition,
                        moduleClass: <IPwbStaticModuleClass>ComponentModules.mModuleClasses.get(lDefinition),
                        targetTemplate: pTemplate,
                        targetAttribute: lAttribute,
                        values: pValues,
                        componentManager: pComponentManager,
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
                    moduleDefinition: ComponentModules.mModuleDefinition.get(this.mExpressionModule),
                    moduleClass: this.mExpressionModule,
                    targetTemplate: pTemplate,
                    targetAttribute: lAttribute,
                    values: pValues,
                    componentManager: pComponentManager,
                    targetNode: pElement
                });

                lModules.push(lModule);
            }
        }

        return lModules;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pKeyList - Key list for possible multiplicator modules.
     */
    public getTextExpressionModule(pTemplate: TextNode, pTextNode: Text, pValues: LayerValues, pComponentManager: ComponentManager): ExpressionModule {
        const lModule: ExpressionModule = new ExpressionModule({
            moduleDefinition: ComponentModules.mModuleDefinition.get(this.mExpressionModule),
            moduleClass: this.mExpressionModule,
            targetTemplate: pTemplate,
            values: pValues,
            componentManager: pComponentManager,
            targetNode: pTextNode
        });

        return lModule;
    }

}