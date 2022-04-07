import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentExtension } from '../extension/base/component-extension';
import { Extensions } from '../extension/extensions';
import { ComponentManager } from './component-manager';

export class ComponentExtensions {
    private readonly mExtensionList: Array<ComponentExtension>;

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: ComponentExtensionsConstructorParameter) {
        // Create all extensions.
        this.mExtensionList = new Array<ComponentExtension>();
        for (const lExtensionClass of Extensions.componentExtensions) {
            this.mExtensionList.push(new ComponentExtension({
                extensionClass: lExtensionClass,
                componentElement: pParameter.componentElement,
                componentManager: pParameter.componentManager,
                targetClass: pParameter.targetClass,
                targetObject: pParameter.targetObject
            }));
        }
    }

    /**
     * Deconstruct all extensions.
     */
    public deconstruct(): void {
        for (const lExtension of this.mExtensionList) {
            lExtension.deconstruct();
        }
    }
}

type ComponentExtensionsConstructorParameter = {
    componentManager: ComponentManager;
    targetClass: InjectionConstructor;
    targetObject: object;
    componentElement: HTMLElement;
};