import { ModuleType } from '../enum/module-type';
import { ModuleManipulatorResult } from '../module/base/module-manipulator-result';
import { IPwbAttributeModule } from './attribute-module';

export interface IPwbManipulatorAttributeModule extends IPwbManipulatorAttributeOnProcess, IPwbManipulatorAttributeOnUpdate {
    /**
    * Processes the module.
    */
    process(): ModuleManipulatorResult;

    /**
     * Update data related to this attribute module.
     * @returns if the complete component should be updated.
     */
    update(): boolean;
}

export interface PwbManipulatorAttributeModuleConstructor extends IPwbAttributeModule {
    /**
     * Loced module type to Manipulator.
     */
    readonly moduleType: ModuleType.Manipulator;

    /**
     * Constructor.
     */
    new(): IPwbManipulatorAttributeModule;
}

export interface IPwbManipulatorAttributeOnProcess {
    /**
     * Processes the module for the provided target.
     * No DOM manipulation, adding or removing complete Elements, are allowed.
     * Adding or removing attributes is allowed.
     * Removes the xml attribute from the template.
     */
    onProcess(): ModuleManipulatorResult;
}

export interface IPwbManipulatorAttributeOnUpdate {
    /**
     * Called on update.
     * If true is returned, the complete element gets updated.
     * Updating eh component without returning true is allowed.
     */
    onUpdate(): boolean;
}
