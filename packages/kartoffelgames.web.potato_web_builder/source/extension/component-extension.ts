import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { ComponentElementReference } from '../injection_reference/component-element-reference';
import { BaseExtension } from './base-extension';
import { IPwbExtensionClass } from './interface/extension';

export class ComponentExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ComponentExtensionConstructorParameter) {
        super(pParameter);

        // Create local injection mapping.
        const lInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
        lInjections.set(ComponentElementReference, new ComponentElementReference(pParameter.componentElement));

        // Create extension.
        this.createExtensionObject(lInjections);
    }
}

type ComponentExtensionConstructorParameter = {
    // Base 
    extensionClass: IPwbExtensionClass;
    componentManager: ComponentManager;
    targetClass: InjectionConstructor;
    targetObject: object | null;

    // Component
    componentElement: HTMLElement;
};