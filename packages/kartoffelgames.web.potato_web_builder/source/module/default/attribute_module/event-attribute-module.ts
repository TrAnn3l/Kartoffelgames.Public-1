import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { ComponentConnection } from '../../../component/component-connection';
import { ComponentManager } from '../../../component/component-manager';
import { LayerValues } from '../../../component/values/layer-values';
import { StaticAttributeModule } from '../../decorator/static-attribute-module';
import { ModuleAccessType } from '../../enum/module-access-type';
import { IPwbModuleOnDeconstruct } from '../../interface/module';
import { ComponentEventEmitter } from '../../../user_class_manager/component-event-emitter';
import { AttributeReference } from '../../base/injection/attribute-reference';
import { LayerValuesReference } from '../../base/injection/layer-values-reference';
import { TargetReference } from '../../base/injection/target-reference';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

@StaticAttributeModule({
    selector: /^\([[\w\-$]+\)$/,
    access: ModuleAccessType.Write,
    forbiddenInManipulatorScopes: false
})
export class EventAttributeModule implements IPwbModuleOnDeconstruct {
    private readonly mEmitter: ComponentEventEmitter<any>;
    private readonly mEventName: string;
    private readonly mListener: (this: null, pEvent: any) => void;
    private readonly mTargetReference: TargetReference;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTargetReference: TargetReference, pValueReference: LayerValuesReference, pAttributeReference: AttributeReference) {
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
