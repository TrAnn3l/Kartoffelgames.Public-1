import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { IPwbStaticModuleClass, IPwbStaticModuleObject, ModuleDefinition } from './interface/module';
import { BaseModule } from './base-module';

export class StaticModule extends BaseModule<boolean, boolean> {
    private readonly mModuleObject: IPwbStaticModuleObject;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: StaticModuleConstructorParameter) {
        super(pParameter);

        // Create module object with attribute value. Attribute is always set for static modules.
        const lAttribute: XmlAttribute = <XmlAttribute>this.attribute;
        this.mModuleObject = this.createModuleObject(lAttribute.value);
    }

    /**
     * Update module.
     */
    public update(): boolean {
        return this.mModuleObject.onUpdate?.() ?? false;
    }
}

export type StaticModuleConstructorParameter = {
    moduleDefinition: ModuleDefinition,
    moduleClass: IPwbStaticModuleClass,
    targetTemplate: XmlElement,
    targetAttribute: XmlAttribute,
    values: LayerValues,
    componentManager: ComponentManager,
    targetNode: Element;
};