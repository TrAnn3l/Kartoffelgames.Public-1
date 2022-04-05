import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { BaseXmlNode, XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../../component/component-manager';
import { LayerValues } from '../../component/values/layer-values';
import { ModuleAccessType } from '../enum/module-access-type';
import { IPwbModuleClass, IPwbModuleObject, ModuleDefinition } from '../interface/module';
import { AttributeReference } from './injection/attribute-reference';
import { ComponentManagerReference } from './injection/component-manager-reference';
import { ExpressionReference } from './injection/expression-reference';
import { LayerValuesReference } from './injection/layer-values-reference';
import { TargetReference } from './injection/target-reference';
import { TemplateReference } from './injection/template-reference';

export abstract class BaseModule<TModuleResult, TModuleObjectResult> {
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private readonly mModuleClass: IPwbModuleClass<TModuleObjectResult>;
    private readonly mModuleDefinition: ModuleDefinition;
    private readonly mModuleObjectList: Array<IPwbModuleObject<TModuleObjectResult>>;
    private readonly mTargetAttribute: XmlAttribute;
    private readonly mTargetNode: Node;
    private readonly mTargetTemplate: BaseXmlNode;

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
     * @param pModuleDefinition - Definition.
     */
    constructor(pParameter: BaseModuleConstructorParameter<TModuleObjectResult>) {
        // Clone template.
        const lTemplateClone: BaseXmlNode = pParameter.targetTemplate.clone();
        lTemplateClone.parent = pParameter.targetTemplate.parent;

        // Remove target atribute.
        if (lTemplateClone instanceof XmlElement && pParameter.targetAttribute) {
            lTemplateClone.removeAttribute(pParameter.targetAttribute.qualifiedName);
        }

        this.mModuleDefinition = pParameter.moduleDefinition;
        this.mTargetTemplate = lTemplateClone;
        this.mModuleClass = pParameter.moduleClass;
        this.mTargetNode = pParameter.targetNode;
        this.mTargetAttribute = pParameter.targetAttribute;
        this.mModuleObjectList = new Array<IPwbModuleObject<TModuleObjectResult>>();

        // Create injection mapping.
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mInjections.set(LayerValuesReference, new LayerValuesReference(pParameter.values));
        this.mInjections.set(ComponentManagerReference, new ComponentManagerReference(pParameter.componentManager));
        this.mInjections.set(AttributeReference, new AttributeReference(pParameter.targetAttribute));
        this.mInjections.set(TemplateReference, new TemplateReference(lTemplateClone));
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
      * Create module object.
      * @param pValue - Value for module object.
      */
    protected createModuleObject(pValue: string): IPwbModuleObject<TModuleObjectResult> {
        // Clone injections and extend by value reference.
        const lInjections = new Dictionary<InjectionConstructor, any>(this.mInjections);
        lInjections.set(ExpressionReference, new ExpressionReference(pValue));

        // Create module object with local injections.
        const lModuleObject: IPwbModuleObject<TModuleObjectResult> = Injection.createObject(this.mModuleClass, lInjections);
        this.mModuleObjectList.push(lModuleObject);

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