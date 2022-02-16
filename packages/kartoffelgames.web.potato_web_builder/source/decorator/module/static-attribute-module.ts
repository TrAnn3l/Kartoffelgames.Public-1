import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ModuleAccessType } from '../../enum/module-access-type';
import { ModuleType } from '../../enum/module-type';
import { IPwbStaticModuleClass } from '../../interface/module';
import { Modules } from '../../module/modules';

/**
 * AtScript. PWB static attribute module.
 * @param pSettings - Module settings.
 */
export function StaticAttributeModule(pSettings: AttributeModuleSettings): any {

    // Needs constructor without argument.
    return (pStaticModuleConstructor: IPwbStaticModuleClass) => {

        // Set user class to be injectable
        Injector.Injectable(pStaticModuleConstructor);

        // Register module.
        Modules.add(pStaticModuleConstructor, {
            type: ModuleType.Manipulator,
            selector: pSettings.selector,
            forbiddenInManipulatorScopes: pSettings.forbiddenInManipulatorScopes,
            access: pSettings.access
        });
    };
}

type AttributeModuleSettings = {
    selector: RegExp,
    forbiddenInManipulatorScopes: boolean,
    access: ModuleAccessType;
};