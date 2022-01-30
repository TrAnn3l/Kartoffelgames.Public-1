import { ModuleType } from '../enum/module-type';
import { IPwbAttributeModule } from './attribute-module';

export interface IPwbStaticAttributeModule extends IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate, IPwbStaticAttributeOnCleanup {
    /**
     * Cleanup events and other data that does not delete itself.
     * Added data to the values handler cleanup itself.
     */
    cleanup(): void;

    /**
     * Processes the module.
     */
    process(): void;

    /**
     * Update data related to this attribute module.
     * @returns if any update was made.
     */
    update(): boolean;
}

export interface PwbStaticAttributeModuleConstructor extends IPwbAttributeModule {
    /**
     * Loced module type to static.
     */
    readonly moduleType: ModuleType.Static;

    /**
     * Constructor.
     */
    new(): IPwbStaticAttributeModule;
}

export interface IPwbStaticAttributeOnProcess {
    /**
     * Processes the module for the provided target.
     * No DOM manipulation, adding or removing complete Elements, are allowed.
     * Adding or removing attributes is allowed.
     * Removes the xml attribute from the template.
     */
    onProcess(): void;
}

export interface IPwbStaticAttributeOnUpdate {
    /**
     * Called on update.
     * Should never recreate the DOM. 
     * Result doesn't matter.
     */
    onUpdate(): boolean;
}

export interface IPwbStaticAttributeOnCleanup {
    /**
     * Cleanup events and other data that does not delete itself.
     * Added data to the values handler cleanup itself.
     */
    onCleanup(): void;
}
