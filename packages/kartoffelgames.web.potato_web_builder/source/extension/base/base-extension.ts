import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '../../component/component-manager';
import { IPwbExtensionClass, IPwbExtensionObject } from '../base/interface/extension';

export class Base {
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
        //this.mInjections.set(LayerValuesReference, new LayerValuesReference(pParameter.values));
        //this.mInjections.set(ComponentManagerReference, new ComponentManagerReference(pParameter.componentManager));
        //this.mInjections.set(AttributeReference, new AttributeReference(pParameter.targetAttribute));
        //this.mInjections.set(TemplateReference, new TemplateReference(lTemplateClone));
        //this.mInjections.set(TargetReference, new TargetReference(pParameter.targetNode));



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

export type BaseExtensionConstructorParameter = {
    extensionClass: IPwbExtensionClass,
    componentManager: ComponentManager,

    // Component
    //targetNode: HTMLElement,
   // rootValues: LayerValues;

    // Module
    //targetTemplate: BaseXmlNode,
    //targetAttribute: XmlAttribute,
    //values: LayerValues,

};