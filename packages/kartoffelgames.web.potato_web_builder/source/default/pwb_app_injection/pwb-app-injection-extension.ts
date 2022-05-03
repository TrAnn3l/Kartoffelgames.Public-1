import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { PwbExtension } from '../../extension/decorator/pwb-extension.decorator';
import { ExtensionMode } from '../../extension/enum/extension-mode';
import { ExtensionType } from '../../extension/enum/extension-type';
import { IPwbExtensionOnCollectInjections } from '../../extension/interface/extension';
import { PwbApp } from '../../pwb-app';

@PwbExtension({
    type: ExtensionType.Component | ExtensionType.Module,
    mode: ExtensionMode.Inject
})
export class PwbAppInjectionExtension implements IPwbExtensionOnCollectInjections {
    /**
     * Collect all injectables.
     */
    public onCollectInjections(): Array<object | null> {
        const lInjectionList: Array<object | null> = new Array<object | null>();
        lInjectionList.push(PwbApp.getChangeDetectionApp(ChangeDetection.current) ?? null);
        return lInjectionList;
    }
}

