import { List } from '@kartoffelgames/core.data';
import { ExtensionMode } from './enum/extension-mode';
import { ExtensionType } from './enum/extension-type';
import { IPwbExtensionClass } from './interface/extension';

export class Extensions {
    private static readonly mComponentInjectorExtensions: Array<IPwbExtensionClass> = new Array<IPwbExtensionClass>();
    private static readonly mComponentPatcherExtensions: Array<IPwbExtensionClass> = new Array<IPwbExtensionClass>();
    private static readonly mModuleInjectorExtensions: Array<IPwbExtensionClass> = new Array<IPwbExtensionClass>();
    private static readonly mModulePatcherExtensions: Array<IPwbExtensionClass> = new Array<IPwbExtensionClass>();

    /**
     * Get all component extensions that inject neew types.
     */
    public static get componentInjectorExtensions(): Array<IPwbExtensionClass> {
        return List.newListWith(...Extensions.mComponentInjectorExtensions);
    }

    /**
     * Get all module extensions that inject neew types.
     */
    public static get moduleInjectorExtensions(): Array<IPwbExtensionClass> {
        return List.newListWith(...Extensions.mModuleInjectorExtensions);
    }

    /**
     * Get all component extensions that only patches.
     */
    public static get componentPatcherExtensions(): Array<IPwbExtensionClass> {
        return List.newListWith(...Extensions.mComponentPatcherExtensions);
    }

    /**
     * Get all module extensions that only patches..
     */
    public static get modulePatcherExtensions(): Array<IPwbExtensionClass> {
        return List.newListWith(...Extensions.mModulePatcherExtensions);
    }

    /**
     * Add global component extension.
     * @param pExtension - Component extension constructor.
     * @param pExtensionType - Type of extension.
     */
    public static add(pExtension: IPwbExtensionClass, pExtensionType: ExtensionType, pExtensionMode: ExtensionMode): void {
        // Module extensions.
        if ((pExtensionType & ExtensionType.Module) === ExtensionType.Module) {
            if (pExtensionMode === ExtensionMode.Inject) {
                Extensions.mModuleInjectorExtensions.push(pExtension);
            } else {
                Extensions.mModulePatcherExtensions.push(pExtension);
            }
        }

        // Component extensions.
        if ((pExtensionType & ExtensionType.Component) === ExtensionType.Component) {
            if (pExtensionMode === ExtensionMode.Inject) {
                Extensions.mComponentInjectorExtensions.push(pExtension);
            } else {
                Extensions.mComponentPatcherExtensions.push(pExtension);
            }
        }
    }
}