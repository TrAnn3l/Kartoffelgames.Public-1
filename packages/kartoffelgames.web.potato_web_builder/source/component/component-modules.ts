import { XmlAttribute } from '@kartoffelgames/core.xml';
import { MustacheExpressionModule } from '../module/default/mustache-expression-module';
import { ComponentManager } from './component-manager';
import { XmlElement } from '@kartoffelgames/core.xml';
import { ModuleStorage } from '../module/module-storage';
import { IPwbExpressionModule, PwbExpressionModuleConstructor } from '../interface/expression-module';
import { HtmlContent } from '../types';
import { ComponentValues } from './component-values';
import { IPwbManipulatorAttributeModule } from '../interface/manipulator-attribute-module';
import { AttributeModuleAccessType } from '../enum/attribute-module-access-type';
import { IPwbStaticAttributeModule } from '../interface/static-attribute-module';

// Import default modules
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
export class ComponentModules {
    private readonly mExpressionModule: PwbExpressionModuleConstructor;

    /**
     * Constructor.
     * Build attribute module for mapping and finding module for attributes.
     */
    public constructor(pExpressionModule?: PwbExpressionModuleConstructor) {
        this.mExpressionModule = pExpressionModule ?? <PwbExpressionModuleConstructor><any>MustacheExpressionModule;
    }

    /**
     * Check if template has a manipluator module.
     * @param pTemplate - Template element.
     */
    public checkTemplateIsManipulator(pTemplate: XmlElement): boolean {
        return ModuleStorage.checkTemplateIsManipulator(pTemplate);
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
    public getExpressionModule(pTargetNode: HtmlContent | Text, pAttributeName: string | null, pValue: string, pValueHandler: ComponentValues, pComponentHandler: ComponentManager): IPwbExpressionModule {
        return ModuleStorage.getExpressionModule(this.mExpressionModule, pTargetNode, pAttributeName, pValue, pValueHandler, pComponentHandler);
    }

    /**
     * Get manipulator module from template element.
     * @param pTargetTemplate - Template the module is working with.
     * @param pValues - Values handler of current manipulator scope.
     * @param pComponentHandler - Component handler.
     */
    public getManipulatorModule(pTargetTemplate: XmlElement, pValues: ComponentValues, pComponentHandler: ComponentManager): IPwbManipulatorAttributeModule | undefined {
        return ModuleStorage.getManipulatorModule(pTargetTemplate, pValues, pComponentHandler);
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
    public getStaticModule(pTargetElement: HtmlContent, pTargetTemplate: XmlElement, pValues: ComponentValues, pAttribute: XmlAttribute, pComponentHandler: ComponentManager, pAccessFilter?: AttributeModuleAccessType): IPwbStaticAttributeModule | undefined {
        return ModuleStorage.getStaticModule(pTargetElement, pTargetTemplate, pValues, pAttribute, pComponentHandler, pAccessFilter);
    }
}