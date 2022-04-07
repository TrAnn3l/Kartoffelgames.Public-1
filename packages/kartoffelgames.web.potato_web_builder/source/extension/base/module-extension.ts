import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { BaseXmlNode, XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../../component/component-manager';
import { LayerValues } from '../../component/values/layer-values';
import { ModuleAttributeReference } from '../../injection/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../injection/module-layer-values-reference';
import { ModuleTemplateReference } from '../../injection/module-template-reference';
import { BaseExtension } from './base-extension';
import { IPwbExtensionClass } from './interface/extension';

export class ModuleExtension extends BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    public constructor(pParameter: ModuleExtensionConstructorParameter) {
        super(pParameter);

        // Create local injection mapping.
        const lInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
        lInjections.set(ModuleTemplateReference, new ModuleTemplateReference(pParameter.template));
        lInjections.set(ModuleAttributeReference, new ModuleAttributeReference(pParameter.attribute));
        lInjections.set(ModuleLayerValuesReference, new ModuleLayerValuesReference(pParameter.layerValues));

        // Create extension.
        this.createExtensionObject(lInjections);
    }
}

type ModuleExtensionConstructorParameter = {
    // Base 
    extensionClass: IPwbExtensionClass,
    componentManager: ComponentManager,
    targetClass: InjectionConstructor,
    targetObject: object,

    // Module
    template: BaseXmlNode,
    attribute: XmlAttribute,
    layerValues: LayerValues,
};