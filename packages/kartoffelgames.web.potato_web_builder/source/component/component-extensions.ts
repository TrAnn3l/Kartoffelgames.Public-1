import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentExtension } from '../extension/component-extension';
import { Extensions } from '../extension/extensions';
import { ComponentManager } from './component-manager';

// Import default extensions.
import '../default/component-event/component-event-extension';
import '../default/export/export-extension';
import '../default/event-listener/event-listener-component-extension';
import '../default/pwb_app_injection/pwb-app-injection-extension';

export class ComponentExtensions {
    private readonly mExtensionList: Array<ComponentExtension>;

    /**
     * Constructor.
     */
    public constructor() {
        // Create all extensions.
        this.mExtensionList = new Array<ComponentExtension>();
    }

    /**
     * Deconstruct all extensions.
     */
    public deconstruct(): void {
        for (const lExtension of this.mExtensionList) {
            lExtension.deconstruct();
        }
    }

    /**
     * Execute patcher extensions.
     * @param pParameter - Parameter.
     */
    public executeInjectorExtensions(pParameter: ComponentExtensionsExecuteInjectorExtensionsParameter): Array<object> {
        const lInjectionTypeList: Array<object> = new Array<object>();

        for (const lExtensionClass of Extensions.componentInjectorExtensions) {
            // Create extension and add to extension list.
            const lExtension: ComponentExtension = new ComponentExtension({
                extensionClass: lExtensionClass,
                componentElement: pParameter.componentElement,
                componentManager: pParameter.componentManager,
                targetClass: pParameter.targetClass,
                targetObject: null
            });
            this.mExtensionList.push(lExtension);

            // Collect extensions.
            lInjectionTypeList.push(...lExtension.collectInjections());
        }

        return lInjectionTypeList;
    }

    /**
     * Execute patcher extensions.
     * @param pParameter - Parameter.
     */
    public executePatcherExtensions(pParameter: ComponentExtensionsExecutePatcherExtensionsParameter): void {
        for (const lExtensionClass of Extensions.componentPatcherExtensions) {
            this.mExtensionList.push(new ComponentExtension({
                extensionClass: lExtensionClass,
                componentElement: pParameter.componentElement,
                componentManager: pParameter.componentManager,
                targetClass: pParameter.targetClass,
                targetObject: pParameter.targetObject
            }));
        }
    }
}

type ComponentExtensionsExecutePatcherExtensionsParameter = {
    componentManager: ComponentManager;
    targetClass: InjectionConstructor;
    targetObject: object;
    componentElement: HTMLElement;
};

type ComponentExtensionsExecuteInjectorExtensionsParameter = {
    componentManager: ComponentManager;
    targetClass: InjectionConstructor;
    componentElement: HTMLElement;
};