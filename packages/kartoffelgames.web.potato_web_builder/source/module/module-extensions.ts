import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { BaseXmlNode, XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { ModuleExtension } from '../extension/module-extension';
import { Extensions } from '../extension/extensions';

// Import default extensions.
import '../default/event-listener/event-listener-module-extension';
import '../default/pwb_app_injection/pwb-app-injection-extension';

export class ModuleExtensions {
    private readonly mExtensionList: Array<ModuleExtension>;

    /**
     * Constructor.
     */
    public constructor() {
        // Create all extensions.
        this.mExtensionList = new Array<ModuleExtension>();
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
    public executeInjectorExtensions(pParameter: ModuleExtensionsExecuteInjectorExtensionsParameter): Array<object|null> {
        const lInjectionTypeList: Array<object|null> = new Array<object|null>();

        for (const lExtensionClass of Extensions.moduleInjectorExtensions) {
            // Create extension and add to extension list.
            const lExtension: ModuleExtension = new ModuleExtension({
                extensionClass: lExtensionClass,
                componentManager: pParameter.componentManager,
                template: pParameter.template,
                attribute: pParameter.attribute,
                layerValues: pParameter.layerValues,
                targetClass: pParameter.targetClass,
                targetObject: null,
                element: pParameter.element
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
    public executePatcherExtensions(pParameter: ModuleExtensionsExecutePatcherExtensionsParameter): void {
        for (const lExtensionClass of Extensions.modulePatcherExtensions) {
            this.mExtensionList.push(new ModuleExtension({
                extensionClass: lExtensionClass,
                componentManager: pParameter.componentManager,
                template: pParameter.template,
                attribute: pParameter.attribute,
                layerValues: pParameter.layerValues,
                targetClass: pParameter.targetClass,
                targetObject: pParameter.targetObject,
                element: <Node>pParameter.element
            }));
        }
    }
}

type ModuleExtensionsExecutePatcherExtensionsParameter = {
    componentManager: ComponentManager,
    targetClass: InjectionConstructor,
    targetObject: object,
    template: BaseXmlNode,
    attribute: XmlAttribute | null, // Null for native text expressions.
    layerValues: LayerValues,
    element: Node | null; // Null for multiplicator modules
};

type ModuleExtensionsExecuteInjectorExtensionsParameter = {
    componentManager: ComponentManager,
    targetClass: InjectionConstructor,
    template: BaseXmlNode,
    attribute: XmlAttribute | null, // Null for native text expressions.
    layerValues: LayerValues,
    element: Node | null; // Null for multiplicator modules
};