import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { BaseXmlNode, XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { ModuleExtension } from '../extension/module-extension';
import { Extensions } from '../extension/extensions';

// Import default extensions.
import '../default/event-listener/event-listener-extension';

export class ModuleExtensions {
    private readonly mExtensionList: Array<ModuleExtension>;

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: ModuleExtensionsConstructorParameter) {
        // Create all extensions.
        this.mExtensionList = new Array<ModuleExtension>();
        for (const lExtensionClass of Extensions.moduleExtensions) {
            this.mExtensionList.push(new ModuleExtension({
                extensionClass: lExtensionClass,
                componentManager: pParameter.componentManager,
                template: pParameter.template,
                attribute: pParameter.attribute,
                layerValues: pParameter.layerValues,
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

type ModuleExtensionsConstructorParameter = {
    componentManager: ComponentManager,
    targetClass: InjectionConstructor,
    targetObject: object,
    template: BaseXmlNode,
    attribute: XmlAttribute,
    layerValues: LayerValues,
};