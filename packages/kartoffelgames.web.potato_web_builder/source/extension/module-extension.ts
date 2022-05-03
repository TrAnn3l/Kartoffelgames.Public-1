import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { BaseXmlNode, XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { ModuleAttributeReference } from '../injection_reference/module-attribute-reference';
import { ModuleLayerValuesReference } from '../injection_reference/module-layer-values-reference';
import { ModuleTargetReference } from '../injection_reference/module-target-reference';
import { ModuleTemplateReference } from '../injection_reference/module-template-reference';
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
        if (pParameter.attribute !== null) {
            lInjections.set(ModuleAttributeReference, new ModuleAttributeReference(pParameter.attribute));
        }
        lInjections.set(ModuleLayerValuesReference, new ModuleLayerValuesReference(pParameter.layerValues));
        lInjections.set(ModuleTargetReference, new ModuleTargetReference(pParameter.element));

        // Create extension.
        this.createExtensionObject(lInjections);
    }
}

type ModuleExtensionConstructorParameter = {
    // Base 
    extensionClass: IPwbExtensionClass,
    componentManager: ComponentManager,
    targetClass: InjectionConstructor,
    targetObject: object | null,

    // Module
    template: BaseXmlNode,
    attribute: XmlAttribute | null, // Null for native text expressions.
    layerValues: LayerValues,
    element: Node | null;  // Null for multiplicator modules
};