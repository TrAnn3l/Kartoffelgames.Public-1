import { Dictionary, List } from '@kartoffelgames/core.data';
import { IPwbModuleClass, ModuleDefinition } from './base/interface/module';

export class Modules {
    private static readonly mModuleClasses: Dictionary<ModuleDefinition, IPwbModuleClass<unknown>> = new Dictionary<ModuleDefinition, IPwbModuleClass<unknown>>();
    private static readonly mModuleDefinition: Dictionary<IPwbModuleClass<unknown>, ModuleDefinition> = new Dictionary<IPwbModuleClass<unknown>, ModuleDefinition>();

    /**
     * Get module definitions of all modules.
     */
    public static get moduleDefinitions(): Array<ModuleDefinition> {
        return List.newListWith(...Modules.mModuleDefinition.values());
    }

    /**
     * Add module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    public static add(pModuleClass: IPwbModuleClass<unknown>, pModuleDefinition: ModuleDefinition): void {
        Modules.mModuleClasses.set(pModuleDefinition, pModuleClass);
        Modules.mModuleDefinition.set(pModuleClass, pModuleDefinition);
    }

    /**
     * Get module definition for module class.
     * @param pModuleClass - Module class.
     */
    public static getModuleClass(pModuleDefinition: ModuleDefinition): IPwbModuleClass<unknown> {
        return Modules.mModuleClasses.get(pModuleDefinition);
    }

    /**
     * Get module definition for module class.
     * @param pModuleClass - Module class.
     */
    public static getModuleDefinition(pModuleClass: IPwbModuleClass<unknown>): ModuleDefinition {
        return Modules.mModuleDefinition.get(pModuleClass);
    }
}