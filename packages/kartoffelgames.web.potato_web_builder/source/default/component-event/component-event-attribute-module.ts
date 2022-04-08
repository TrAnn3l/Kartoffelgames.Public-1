import { Dictionary } from '@kartoffelgames/core.data';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module-layer-values-reference';
import { ModuleTargetReference } from '../../injection_reference/module-target-reference';
import { StaticAttributeModule } from '../../module/decorator/static-attribute-module.decorator';
import { ModuleAccessType } from '../../module/enum/module-access-type';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { IPwbModuleOnDeconstruct } from '../../module/interface/module';

@StaticAttributeModule({
    selector: /^\([[\w\-$]+\)$/,
    access: ModuleAccessType.Write,
    forbiddenInManipulatorScopes: false
})
export class EventAttributeModule implements IPwbModuleOnDeconstruct {
    private readonly mEventName: string;
    private readonly mListener: (this: null, pEvent: any) => void;
    private readonly mTargetReference: ModuleTargetReference;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetReference, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference) {
        this.mTargetReference = pTargetReference;
        this.mEventName = pAttributeReference.value.name.substr(1, pAttributeReference.value.name.length - 2);

        // Define listener.
        this.mListener = (pEvent: any): void => {
            // Add event to external values.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$event', pEvent);

            // Execute string with external event value.
            ComponentScopeExecutor.execute(pAttributeReference.value.value, pValueReference.value, lExternalValues);
        };

        // Add native event listener.
        this.mTargetReference.value.addEventListener(this.mEventName, this.mListener);
    }

    /**
     * Cleanup event on deconstruction.
     */
    public onDeconstruct(): void {
        this.mTargetReference.value.removeEventListener(this.mEventName, this.mListener);
    }
}
