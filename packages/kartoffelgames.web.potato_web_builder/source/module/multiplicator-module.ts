import { Exception } from '@kartoffelgames/core.data';
import { XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ComponentManager } from '../component/component-manager';
import { LayerValues } from '../component/values/layer-values';
import { IPwbMultiplicatorModuleClass, IPwbMultiplicatorModuleObject, ModuleDefinition } from './interface/module';
import { BaseModule } from './base-module';
import { MultiplicatorResult } from './result/multiplicator-result';

export class MultiplicatorModule extends BaseModule<MultiplicatorResult, MultiplicatorResult> {
    private readonly mModuleObject: IPwbMultiplicatorModuleObject;

    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    public constructor(pParameter: MultiplicatorModuleConstructorParameter) {
        super({
            ...pParameter,
            targetNode: null
        });
        this.mModuleObject = this.createModuleObject(this.attribute.value);
    }

    /**
     * Update module.
     */
    public update(): MultiplicatorResult {
        if (!this.mModuleObject.onUpdate) {
            throw new Exception('Multiplicator modules need to implement IPwbMultiplicatorModuleOnUpdate', this);   
        } 

        return this.mModuleObject.onUpdate();
    }
}

export type MultiplicatorModuleConstructorParameter = {
    moduleDefinition: ModuleDefinition,
    moduleClass: IPwbMultiplicatorModuleClass,
    targetTemplate: XmlElement,
    targetAttribute: XmlAttribute,
    values: LayerValues,
    componentManager: ComponentManager,
};