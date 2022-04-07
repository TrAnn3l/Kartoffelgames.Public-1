import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../component/component-manager';
import { ComponentManagerReference } from '../injection_reference/component-manager-reference';
import { ExtensionTargetClassReference } from '../injection_reference/extension-target-class-reference';
import { ExtensionTargetObjectReference } from '../injection_reference/extension-target-object-reference';
import { IPwbExtensionClass, IPwbExtensionObject } from './interface/extension';

export class BaseExtension {
    private readonly mExtensionClass: IPwbExtensionClass;
    private readonly mExtensionObjectList: Array<IPwbExtensionObject>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseExtensionConstructorParameter) {
        this.mExtensionClass = pParameter.extensionClass;

        // Create injection mapping.
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mInjections.set(ComponentManagerReference, new ComponentManagerReference(pParameter.componentManager));
        this.mInjections.set(ExtensionTargetClassReference, new ExtensionTargetClassReference(pParameter.targetClass));
        this.mInjections.set(ExtensionTargetObjectReference, new ExtensionTargetObjectReference(pParameter.targetObject));
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        for (const lExtension of this.mExtensionObjectList) {
            lExtension.onDeconstruct?.();
        }
    }

    /**
      * Create extension object.
      * @param pInjections - Local injections.
      */
    protected createExtensionObject(pInjections: Dictionary<InjectionConstructor, any>): IPwbExtensionObject {
        // Clone injections and extend by value reference.
        const lInjections = new Dictionary<InjectionConstructor, any>(this.mInjections);

        // Merge local injections.
        for (const lKey of pInjections.keys()) {
            lInjections.set(lKey, pInjections.get(lKey));
        }

        // Create module object with local injections.
        const lExtensionObject: IPwbExtensionObject = Injection.createObject(this.mExtensionClass, lInjections);
        this.mExtensionObjectList.push(lExtensionObject);

        return lExtensionObject;
    }
}

type BaseExtensionConstructorParameter = {
    extensionClass: IPwbExtensionClass;
    componentManager: ComponentManager;
    targetClass: InjectionConstructor;
    targetObject: object;
};