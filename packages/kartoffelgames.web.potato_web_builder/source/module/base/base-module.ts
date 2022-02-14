import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { BaseXmlNode, XmlAttribute } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../../component/component-manager';
import { LayerValues } from '../../component/values/layer-values';
import { ModuleAccessType } from '../../enum/module-access-type';
import { ModuleType } from '../../enum/module-type';
import { IPwbModuleClass, IPwbModuleObject, ModuleDefinition } from '../../interface/module';
import { AttributeReference } from './injection/attribute-reference';
import { TargetReference } from './injection/target-reference';
import { TemplateReference } from './injection/template-reference';
import { ValueReference } from './injection/value-reference';

export abstract class BaseModule<TModuleResult, TModuleObjectResult> {
    private readonly mModuleObjectList: Array<IPwbModuleObject<TModuleObjectResult>>;
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private readonly mModuleDefinition: ModuleDefinition;
    private readonly mModuleClass: IPwbModuleClass<TModuleObjectResult>;
    private readonly mTargetTemplate: BaseXmlNode;
    private readonly mTargetNode: Node;
    private readonly mTargetAttribute: XmlAttribute;

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
     * Get target template.
     */
    protected get template(): BaseXmlNode {
        return this.mTargetTemplate;
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
     * @param pModuleDefinition - Definition.
     */
    constructor(pParameter: BaseModuleConstructorParameter<TModuleObjectResult>) {
        this.mModuleDefinition = pParameter.moduleDefinition;
        this.mTargetTemplate = pParameter.targetTemplate;
        this.mModuleClass = pParameter.moduleClass;
        this.mTargetNode = pParameter.targetNode;
        this.mTargetAttribute = pParameter.targetAttribute;
        this.mModuleObjectList = new Array<IPwbModuleObject<TModuleObjectResult>>();

        // Create injection mapping.
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mInjections.set(LayerValues, pParameter.values);
        this.mInjections.set(ComponentManager, pParameter.componentManager);
        this.mInjections.set(AttributeReference, new AttributeReference(pParameter.targetAttribute));
        this.mInjections.set(TemplateReference, new TemplateReference(pParameter.targetTemplate));
        this.mInjections.set(TargetReference, new TargetReference(pParameter.targetNode));
    }

    /**
     * Deconstruct module.
     */
    public deconstruct(): void {
        for (const lModule of this.mModuleObjectList) {
            lModule.onDeconstruct?.();
        }
    }

    /**
     * Update module.
     */
    public abstract update(): TModuleResult;

    /**
     * Create module object.
     * @param pValue - Value for module object.
     */
    protected createModuleObject(pValue: string) {
        // Clone injections and extend by value reference.
        const lInjections = new Dictionary<InjectionConstructor, any>(this.mInjections);
        lInjections.set(ValueReference, new ValueReference(pValue));

        // Create module object with local injections.
        const lModuleObject: IPwbModuleObject<TModuleObjectResult> = Injection.createObject(this.mModuleClass, this.mInjections);;
        this.mModuleObjectList.push(lModuleObject);

        return lModuleObject;
    }
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