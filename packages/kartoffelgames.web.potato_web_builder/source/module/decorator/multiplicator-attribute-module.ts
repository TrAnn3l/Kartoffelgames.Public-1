import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ModuleAccessType } from '../enum/module-access-type';
import { ModuleType } from '../enum/module-type';
import { IPwbMultiplicatorModuleClass } from '../interface/module';
import { Modules } from '../modules';

/**
 * AtScript. PWB Multiplicator attribute module.
 * @param pSettings - Module settings.
 */
export function MultiplicatorAttributeModule(pSettings: AttributeModuleSettings): any {

    // Needs constructor without argument.
    return (pManipulatorModuleConstructor: IPwbMultiplicatorModuleClass) => {

        // Set user class to be injectable
        Injector.Injectable(pManipulatorModuleConstructor);

        // Register module.
        Modules.add(pManipulatorModuleConstructor, {
            type: ModuleType.Manipulator,
            selector: pSettings.selector,
            forbiddenInManipulatorScopes: false,
            access: ModuleAccessType.Write
        });
    };
}

type AttributeModuleSettings = {
    selector: RegExp;
};