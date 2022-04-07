import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { ComponentConnection } from '../../../component/component-connection';
import { ComponentManager } from '../../../component/component-manager';
import { LayerValues } from '../../../component/values/layer-values';
import { StaticAttributeModule } from '../../../module/decorator/static-attribute-module';
import { ModuleAccessType } from '../../../module/enum/module-access-type';
import { IPwbModuleOnDeconstruct } from '../../../module/interface/module';
import { ComponentEventEmitter } from '../../../user_class_manager/component-event-emitter';
import { ModuleAttributeReference } from '../../../injection_reference/module-attribute-reference';
import { ModuleLayerValuesReference } from '../../../injection_reference/module-layer-values-reference';
import { ModuleTargetReference } from '../../../injection_reference/module-target-reference';
import { ComponentScopeExecutor } from '../../../module/execution/component-scope-executor';

@StaticAttributeModule({
    selector: /^\([[\w\-$]+\)$/,
    access: ModuleAccessType.Write,
    forbiddenInManipulatorScopes: false
})
export class EventAttributeModule implements IPwbModuleOnDeconstruct {
    private readonly mEmitter: ComponentEventEmitter<any>;
    private readonly mEventName: string;
    private readonly mListener: (this: null, pEvent: any) => void;
    private readonly mTargetReference: ModuleTargetReference;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetReference, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference) {
        this.mTargetReference = pTargetReference;
        this.mValueHandler = pValueReference.value;
        this.mEventName = pAttributeReference.value.name.substr(1, pAttributeReference.value.name.length - 2);

        // Try to get user class event from target element component manager.
        const lTargetComponentManager: ComponentManager = ComponentConnection.componentManagerOf(this.mTargetReference.value);
        if (lTargetComponentManager) {
            this.mEmitter = lTargetComponentManager.userEventHandler.getEventEmitter(this.mEventName);
        }

        // Define listener.
        this.mListener = (pEvent: any): void => {
            // Add event to external values.
            const lExternalValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExternalValues.add('$event', pEvent);

            // Execute string with external event value.
            ComponentScopeExecutor.execute(pAttributeReference.value.value, this.mValueHandler, lExternalValues);
        };

        // Add native element or user class event listener.
        if (typeof this.mEmitter !== 'undefined') {
            if (this.mEmitter instanceof ComponentEventEmitter) {
                this.mEmitter.addListener(this.mListener);
            } else {
                throw new Exception('Event emmiter must be of type ComponentEventEmitter', this);
            }
        } else {
            this.mTargetReference.value.addEventListener(this.mEventName, this.mListener);
        }
    }

    /**
     * Cleanup event on deconstruction.
     */
    public onDeconstruct(): void {
        if (typeof this.mEmitter === 'undefined') {
            this.mTargetReference.value.removeEventListener(this.mEventName, this.mListener);
        } else {
            this.mEmitter.removeListener(this.mListener);
        }
    }
}
