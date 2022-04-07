import { List } from '@kartoffelgames/core.data';
import { ExtensionType } from './enum/extension-type';
import { IPwbExtensionClass } from './interface/extension';

export class Extensions {
    private static readonly mComponentExtensions: Array<IPwbExtensionClass> = new Array<IPwbExtensionClass>();
    private static readonly mModuleExtensions: Array<IPwbExtensionClass> = new Array<IPwbExtensionClass>();

    /**
     * Get all component extensions.
     */
    public static get componentExtensions(): Array<IPwbExtensionClass> {
        return List.newListWith(...Extensions.mComponentExtensions);
    }

    /**
     * Get all module extensions.
     */
    public static get moduleExtensions(): Array<IPwbExtensionClass> {
        return List.newListWith(...Extensions.mModuleExtensions);
    }

    /**
     * Add global component extension.
     * @param pExtension - Component extension constructor.
     * @param pExtensionType - Type of extension.
     */
    public static add(pExtension: IPwbExtensionClass, pExtensionType: ExtensionType): void {
        if ((pExtensionType & ExtensionType.Module) === ExtensionType.Module) {
            Extensions.mModuleExtensions.push(pExtension);
        }

        if ((pExtensionType & ExtensionType.Component) === ExtensionType.Component) {
            Extensions.mComponentExtensions.push(pExtension);
        }
    }
}