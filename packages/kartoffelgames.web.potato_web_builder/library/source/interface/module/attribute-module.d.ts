import { AttributeModuleAccessType } from '../../enum/attribute-module-access-type';
import { ModuleType } from '../../enum/module-type';
export interface IPwbAttributeModuleConstructor {
    /**
     * Modules access type.
     */
    readonly accessType: AttributeModuleAccessType;
    /**
     * Selector of attributes the modules gets applied.
     */
    readonly attributeSelector: RegExp;
    /**
     * If module is forbidden inside manipulator scopes.
     */
    readonly forbiddenInManipulatorScopes: boolean;
    /**
     * If modules reads data into the view.
     */
    readonly isReading: boolean;
    /**
     * If modules writes data out of the view.
     */
    readonly isWriting: boolean;
    /**
     * If module removes or adds attributes to the provided template element.
     */
    readonly manipulatesAttributes: boolean;
    /**
     * Type of this module.
     */
    readonly moduleType: ModuleType;
}
/**
 * Object for setting attribute module appearance.
 */
export declare type AttributeModuleSettings = {
    /**
     * Access type of data binding.
     */
    accessType: AttributeModuleAccessType;
    /**
     * Selector of attributes the modules gets applied.
     */
    attributeSelector: RegExp;
    /**
     * If module is forbidden inside manipulator scopes.
     * Does nothing on manipulator modules.
     */
    forbiddenInManipulatorScopes: boolean;
    /**
     * If module removes or adds attributes to the provided template element.
     * Writing modules can not manipulate attributes.
     */
    manipulatesAttributes: boolean;
};
//# sourceMappingURL=attribute-module.d.ts.map