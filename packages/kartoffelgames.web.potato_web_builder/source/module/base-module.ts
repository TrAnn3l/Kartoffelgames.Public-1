import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { BaseXmlNode, XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { ComponentManagerReference } from '../injection_reference/component-manager-reference';
import { ModuleAttributeReference } from '../injection_reference/module-attribute-reference';
import { ModuleExpressionReference } from '../injection_reference/module-expression-reference';
import { ModuleLayerValuesReference } from '../injection_reference/module-layer-values-reference';
import { ModuleTargetReference } from '../injection_reference/module-target-reference';
import { ModuleTemplateReference } from '../injection_reference/module-template-reference';
import { ModuleAccessType } from './enum/module-access-type';
import { IPwbModuleClass, IPwbModuleObject, ModuleDefinition } from './interface/module';
import { ModuleExtensions } from './module-extensions';

export abstract class BaseModule<TModuleResult, TModuleObjectResult> {
    private readonly mComponentManager: ComponentManager;
    private readonly mExtensionList: Array<ModuleExtensions>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private readonly mLayerValues: LayerValues;
    private readonly mModuleClass: IPwbModuleClass<TModuleObjectResult>;
    private readonly mModuleDefinition: ModuleDefinition;
    private readonly mModuleObjectList: Array<IPwbModuleObject<TModuleObjectResult>>;
    private readonly mTargetAttribute: XmlAttribute;
    private readonly mTargetNode: Node;
    private readonly mTemplateClone: BaseXmlNode;

    /**
     * Get module definition.
     */
    public get moduleDefinition(): ModuleDefinition {
        return this.mModuleDefinition;
    }

    /**
     * If modules reads data into the view.
     */
    public get isReading(): boolean {
        return (this.mModuleDefinition.access & ModuleAccessType.Read) === ModuleAccessType.Read;
    }

    /**
     * If modules writes data out of the view.
     */
    public get isWriting(): boolean {
        return (this.mModuleDefinition.access & ModuleAccessType.Write) === ModuleAccessType.Write;
    }

    /**
     * Get target node.
     */
    protected get node(): Node {
        return this.mTargetNode;
    }

    /**
     * Get target attribute.
     */
    protected get attribute(): XmlAttribute {
        return this.mTargetAttribute;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter: BaseModuleConstructorParameter<TModuleObjectResult>) {
        // Clone template.
        this.mTemplateClone = pParameter.targetTemplate.clone();
        this.mTemplateClone.parent = pParameter.targetTemplate.parent;

        // Remove target atribute.
        if (this.mTemplateClone instanceof XmlElement && pParameter.targetAttribute) {
            this.mTemplateClone.removeAttribute(pParameter.targetAttribute.qualifiedName);
        }

        this.mModuleDefinition = pParameter.moduleDefinition;
        this.mModuleClass = pParameter.moduleClass;
        this.mTargetNode = pParameter.targetNode;
        this.mTargetAttribute = pParameter.targetAttribute;
        this.mComponentManager = pParameter.componentManager;
        this.mLayerValues = pParameter.values;
        this.mModuleObjectList = new Array<IPwbModuleObject<TModuleObjectResult>>();
        this.mExtensionList = new Array<ModuleExtensions>();

        // Create injection mapping.
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mInjections.set(ModuleLayerValuesReference, new ModuleLayerValuesReference(this.mLayerValues));
        this.mInjections.set(ComponentManagerReference, new ComponentManagerReference(pParameter.componentManager));
        this.mInjections.set(ModuleAttributeReference, new ModuleAttributeReference(pParameter.targetAttribute));
        this.mInjections.set(ModuleTemplateReference, new ModuleTemplateReference(this.mTemplateClone));
        this.mInjections.set(ModuleTargetReference, new ModuleTargetReference(pParameter.targetNode));
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        // Deconstruct extensions.
        for (const lExtensions of this.mExtensionList) {
            lExtensions.deconstruct();
        }

        // Deconstruct modules.
        for (const lModule of this.mModuleObjectList) {
            lModule.onDeconstruct?.();
        }
    }

    /**
      * Create module object.
      * @param pValue - Value for module object.
      */
    protected createModuleObject(pValue: string): IPwbModuleObject<TModuleObjectResult> {
        // Clone injections and extend by value reference.
        const lInjections = new Dictionary<InjectionConstructor, any>(this.mInjections);
        lInjections.set(ModuleExpressionReference, new ModuleExpressionReference(pValue));

        // Create extensions and collect extension injections.
        const lExtensions: ModuleExtensions = new ModuleExtensions();
        const lExtensionInjectionList: Array<object> = lExtensions.executeInjectorExtensions({
            componentManager: this.mComponentManager,
            targetClass: this.mModuleClass,
            template: this.mTemplateClone,
            attribute: this.mTargetAttribute,
            layerValues: this.mLayerValues,
            element: this.mTargetNode
        });

        // Parse and merge extension injections into local injections.
        for (const lInjectionObject of lExtensionInjectionList) {
            lInjections.set(<InjectionConstructor>lInjectionObject.constructor, lInjectionObject);
        }

        // Create module object with local injections.
        const lModuleObject: IPwbModuleObject<TModuleObjectResult> = Injection.createObject(this.mModuleClass, lInjections);
        this.mModuleObjectList.push(lModuleObject);

        // Execute patcher extensions and save extension for deconstructing.
        this.mExtensionList.push(lExtensions);
        lExtensions.executePatcherExtensions({
            componentManager: this.mComponentManager,
            targetClass: this.mModuleClass,
            targetObject: lModuleObject,
            template: this.mTemplateClone,
            attribute: this.mTargetAttribute,
            layerValues: this.mLayerValues,
            element: this.mTargetNode
        });

        return lModuleObject;
    }

    /**
     * Update module.
     */
    public abstract update(): TModuleResult;
}

export type BaseModuleConstructorParameter<TModuleObjectResult> = {
    moduleDefinition: ModuleDefinition,
    moduleClass: IPwbModuleClass<TModuleObjectResult>,
    targetTemplate: BaseXmlNode,
    targetAttribute: XmlAttribute,
    values: LayerValues,
    componentManager: ComponentManager,
    targetNode: Node;
};