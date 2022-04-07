import { Injector } from '@kartoffelgames/core.dependency-injection';
import { ExtensionType } from '../enum/extension-type';
import { Extensions } from '../extensions';
import { IPwbExtensionClass } from '../interface/extension';

/**
 * AtScript. PWB component extension.
 */
export function Extension(pSettings: ExtensionSettings): any {
    return (pExtensionConstructor: IPwbExtensionClass) => {

        // Set user class to be injectable
        Injector.Injectable(pExtensionConstructor);

        // Register module.
        Extensions.add(pExtensionConstructor, pSettings.type);
    };
}

type ExtensionSettings = {
    type: ExtensionType;
};