import { XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentManager } from './component-manager';
import { XmlElement } from '@kartoffelgames/core.xml';
import { IPwbExpressionModule, PwbExpressionModuleConstructor } from '../interface/module/expression-module';
import { HtmlContent } from '../types';
import { LayerValues } from './values/layer-values';
import { IPwbManipulatorAttributeModule } from '../interface/module/manipulator-attribute-module';
import { AttributeModuleAccessType } from '../enum/attribute-module-access-type';
import { IPwbStaticAttributeModule } from '../interface/module/static-attribute-module';
import '../module/default/attribute_module/event-attribute-module';
import '../module/default/attribute_module/for-of-manipulator-attribute-module';
import '../module/default/attribute_module/id-child-attribute-module';
import '../module/default/attribute_module/if-manipulator-attribute-module';
import '../module/default/attribute_module/one-way-binding-attribute-module';
import '../module/default/attribute_module/slot-attribute-module';
import '../module/default/attribute_module/two-way-binding-attribute-module';
/**
 * Map attributes modules for finding modules for attributes.
 */
export declare class ComponentModules {
    private readonly mExpressionModule;
    /**
     * Constructor.
     * Build attribute module for mapping and finding module for attributes.
     */
    constructor(pExpressionModule?: PwbExpressionModuleConstructor);
    /**
     * Check if template has a manipluator module.
     * @param pTemplate - Template element.
     */
    checkTemplateIsManipulator(pTemplate: XmlElement): boolean;
    /**
     * Get expression module for expression.
     * @param pTargetNode - Target. Element or text element.
     * @param pAttributeName - Attribute name. Null if on text element.
     * @param pValue - Expression.
     * @param pValueHandler - Value handler of current scope.
     * @param pComponentHandler - Component handler.
     * @returns build expression module.
     */
    getExpressionModule(pTargetNode: HtmlContent | Text, pAttributeName: string | null, pValue: string, pValueHandler: LayerValues, pComponentHandler: ComponentManager): IPwbExpressionModule;
    /**
     * Get manipulator module from template element.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pComponentHandler - Component handler.
     */
    getManipulatorModule(pTargetTemplate: XmlElement, pValues: LayerValues, pComponentHandler: ComponentManager): IPwbManipulatorAttributeModule | undefined;
    /**
     * Get static module from template element.
     * @param pTargetElement - Html element the module should work with.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pAttribute - attribute wich module should be searched.
     * @param pComponentHandler - Component handler.
     * @param pAccessFilter - [OPTIONAL] Filter for access type.
     */
    getStaticModule(pTargetElement: HtmlContent, pTargetTemplate: XmlElement, pValues: LayerValues, pAttribute: XmlAttribute, pComponentHandler: ComponentManager, pAccessFilter?: AttributeModuleAccessType): IPwbStaticAttributeModule | undefined;
}
//# sourceMappingURL=component-modules.d.ts.map