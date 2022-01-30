import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor, Injector } from '@kartoffelgames/core.dependency-injection';
import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentHandler } from '../component_manager/component-handler';
import { ComponentValues } from '../component_manager/component-values';
import { AttributeModuleAccessType } from '../enum/attribute-module-access-type';
import { ModuleType } from '../enum/module-type';
import { IPwbExpressionModule, PwbExpressionModuleConstructor } from '../interface/expression-module';
import { IPwbManipulatorAttributeModule, PwbManipulatorAttributeModuleConstructor } from '../interface/manipulator-attribute-module';
import { IPwbStaticAttributeModule, PwbStaticAttributeModuleConstructor } from '../interface/static-attribute-module';
import { HtmlContent } from '../types';

export class ModuleStorage {
    private static readonly mExpressionModuleList: Array<PwbExpressionModuleConstructor> = new Array<PwbExpressionModuleConstructor>();
    private static readonly mManipulatorModuleList: Array<PwbManipulatorAttributeModuleConstructor> = new Array<PwbManipulatorAttributeModuleConstructor>();
    private static readonly mStaticModuleList: Array<PwbStaticAttributeModuleConstructor> = new Array<PwbStaticAttributeModuleConstructor>();

    /**
     * Add all attribute modules to inner mapping.
     * @param pAttributeModuleList - List of attribute modules.
     */
    public static addModule(pAttributeModule: PwbStaticAttributeModuleConstructor | PwbManipulatorAttributeModuleConstructor | PwbExpressionModuleConstructor): void {
        if (pAttributeModule.moduleType === ModuleType.Static) {
            ModuleStorage.mStaticModuleList.push(pAttributeModule);
        } else if (pAttributeModule.moduleType === ModuleType.Manipulator) {
            ModuleStorage.mManipulatorModuleList.push(pAttributeModule);
        } else if (pAttributeModule.moduleType === ModuleType.Expression) {
            ModuleStorage.mExpressionModuleList.push(pAttributeModule);
        }
    }

    /**
     * Check if template has a manipluator module.
     * @param pTemplate - Template element.
     */
    public static checkTemplateIsManipulator(pTemplate: XmlElement): boolean {
        // Get manipulator module from template and check if it exists.
        return typeof ModuleStorage.getManipulatorModuleConstructor(pTemplate) !== 'undefined';
    }

    /**
     * Get expression module for expression.
     * @param pTargetNode - Target. Element or text element.
     * @param pAttributeName - Attribute name. Null if on text element.
     * @param pValue - Expression.
     * @param pValueHandler - Value handler of current scope.
     * @param pComponentHandler - Component handler.
     * @returns build expression module.
     */
    public static getExpressionModule(pExpressionModule: PwbExpressionModuleConstructor, pTargetNode: HtmlContent | Text, pAttributeName: string | null, pValue: string, pValueHandler: ComponentValues, pComponentHandler: ComponentHandler): IPwbExpressionModule {
        // Local injections for object creation.
        const lLocalInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
        lLocalInjections.add(ComponentValues, pValueHandler);
        lLocalInjections.add(ComponentHandler, pComponentHandler);

        // Create object.
        const lModule: IPwbExpressionModule = Injection.createObject(pExpressionModule, lLocalInjections);
        lModule.key = pAttributeName;
        lModule.value = pValue;
        lModule.targetNode = pTargetNode;

        return lModule;
    }

    /**
     * Get manipulator module from template element.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pComponentHandler - Component handler.
     */
    public static getManipulatorModule(pTargetTemplate: XmlElement, pValues: ComponentValues, pComponentHandler: ComponentHandler): IPwbManipulatorAttributeModule | undefined {
        // Get module constructor.
        const lModuleConstructor: PwbManipulatorAttributeModuleConstructor = this.getManipulatorModuleConstructor(pTargetTemplate);

        // Return undefined if no constructor was found.
        if (typeof lModuleConstructor === 'undefined') {
            return undefined;
        } else {
            // Find attribute
            const lFoundAttribute: XmlAttribute = pTargetTemplate.attributeList.find(pAttribute => {
                return lModuleConstructor.attributeSelector.test(pAttribute.name);
            });

            // Check if attribute was found.
            if (typeof lFoundAttribute === 'undefined') {
                throw new Exception('No Attribute for processing found.', this);
            }

            // Check manipulation restriction.
            if (lModuleConstructor.isWriting && lModuleConstructor.manipulatesAttributes) {
                throw new Exception('Writing attibute modules can not manipulate the templates attributes.', this);
            }

            // Remove attribute from template. So no second process with this attribute is started.
            pTargetTemplate.removeAttribute(lFoundAttribute.name);

            // Local injections for object creation.
            const lLocalInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjections.add(XmlElement, pTargetTemplate);
            lLocalInjections.add(ComponentValues, pValues);
            lLocalInjections.add(ComponentHandler, pComponentHandler);
            lLocalInjections.add(XmlAttribute, lFoundAttribute);

            // Create object.
            return Injection.createObject(lModuleConstructor, lLocalInjections);
        }
    }

    /**
     * Get static module from template element.
     * @param pTargetElement - Html element the module should work with.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pAttribute - attribute wich module should be searched.
     * @param pComponentHandler - Component handler.
     * @param pAccessFilter - [OPTIONAL] Filter for access type.
     */
    public static getStaticModule(pTargetElement: HtmlContent, pTargetTemplate: XmlElement, pValues: ComponentValues, pAttribute: XmlAttribute, pComponentHandler: ComponentHandler, pAccessFilter?: AttributeModuleAccessType): IPwbStaticAttributeModule | undefined {
        // Find modules that matches attribute.
        const lFindFn = (pModuleConstructor: PwbStaticAttributeModuleConstructor) => {
            // Check attribute and check if attribute matches module selector.
            const lModuleMatches: boolean = pModuleConstructor.attributeSelector.test(pAttribute.name);

            // Check for optional access filter.
            if (lModuleMatches && typeof pAccessFilter !== 'undefined') {
                return pModuleConstructor.accessType === pAccessFilter;
            } else {
                return lModuleMatches;
            }
        };

        // Find static module.
        const lModuleConstructor: PwbStaticAttributeModuleConstructor = ModuleStorage.mStaticModuleList.find(lFindFn);

        // Return undefined if no constructor was found.
        if (typeof lModuleConstructor === 'undefined') {
            return undefined;
        } else {
            // Remove attribute from template. So no second process with this attribute is started.
            pTargetTemplate.removeAttribute(pAttribute.name);

            // Check manipulation restriction.
            if (lModuleConstructor.isWriting && lModuleConstructor.manipulatesAttributes) {
                throw new Exception('Writing attibute modules can not manipulate the templates attributes.', this);
            }

            // Local injections for object creation.
            const lLocalInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
            lLocalInjections.add(XmlElement, pTargetTemplate);
            lLocalInjections.add(ComponentValues, pValues);
            lLocalInjections.add(ComponentHandler, pComponentHandler);
            lLocalInjections.add(Element, pTargetElement);
            lLocalInjections.add(XmlAttribute, pAttribute);

            // Create module.
            return Injection.createObject(lModuleConstructor, lLocalInjections);
        }
    }

    /**
     * Get manipulator module constructor from template element.
     * @param pTemplate - Template element.
     */
    private static getManipulatorModuleConstructor(pTemplate: XmlElement): PwbManipulatorAttributeModuleConstructor | undefined {
        // Find modules that matches attribute.
        const lFindFn = (pModuleConstructor: PwbManipulatorAttributeModuleConstructor) => {
            // Check all attributes and check if attribute matches module selector.
            for (const lAttribute of pTemplate.attributeList) {
                if (pModuleConstructor.attributeSelector.test(lAttribute.name)) {
                    return true;
                }
            }

            return false;
        };

        // Find manipulator module.
        return ModuleStorage.mManipulatorModuleList.find(lFindFn);
    }

}