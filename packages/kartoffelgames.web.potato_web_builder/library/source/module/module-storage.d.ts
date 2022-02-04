import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { AttributeModuleAccessType } from '../enum/attribute-module-access-type';
import { IPwbExpressionModule, PwbExpressionModuleConstructor } from '../interface/module/expression-module';
import { IPwbManipulatorAttributeModule, PwbManipulatorAttributeModuleConstructor } from '../interface/module/manipulator-attribute-module';
import { IPwbStaticAttributeModule, PwbStaticAttributeModuleConstructor } from '../interface/module/static-attribute-module';
import { HtmlContent } from '../types';
export declare class ModuleStorage {
    private static readonly mExpressionModuleList;
    private static readonly mManipulatorModuleList;
    private static readonly mStaticModuleList;
    /**
     * Add all attribute modules to inner mapping.
     * @param pAttributeModuleList - List of attribute modules.
     */
    static addModule(pAttributeModule: PwbStaticAttributeModuleConstructor | PwbManipulatorAttributeModuleConstructor | PwbExpressionModuleConstructor): void;
    /**
     * Check if template has a manipluator module.
     * @param pTemplate - Template element.
     */
    static checkTemplateIsManipulator(pTemplate: XmlElement): boolean;
    /**
     * Get expression module for expression.
     * @param pTargetNode - Target. Element or text element.
     * @param pAttributeName - Attribute name. Null if on text element.
     * @param pValue - Expression.
     * @param pValueHandler - Value handler of current scope.
     * @param pComponentHandler - Component handler.
     * @returns build expression module.
     */
    static getExpressionModule(pExpressionModule: PwbExpressionModuleConstructor, pTargetNode: HtmlContent | Text, pAttributeName: string | null, pValue: string, pValueHandler: LayerValues, pComponentHandler: ComponentManager): IPwbExpressionModule;
    /**
     * Get manipulator module from template element.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pComponentHandler - Component handler.
     */
    static getManipulatorModule(pTargetTemplate: XmlElement, pValues: LayerValues, pComponentHandler: ComponentManager): IPwbManipulatorAttributeModule | undefined;
    /**
     * Get static module from template element.
     * @param pTargetElement - Html element the module should work with.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pAttribute - attribute wich module should be searched.
     * @param pComponentHandler - Component handler.
     * @param pAccessFilter - [OPTIONAL] Filter for access type.
     */
    static getStaticModule(pTargetElement: HtmlContent, pTargetTemplate: XmlElement, pValues: LayerValues, pAttribute: XmlAttribute, pComponentHandler: ComponentManager, pAccessFilter?: AttributeModuleAccessType): IPwbStaticAttributeModule | undefined;
    /**
     * Get manipulator module constructor from template element.
     * @param pTemplate - Template element.
     */
    private static getManipulatorModuleConstructor;
}
//# sourceMappingURL=module-storage.d.ts.map