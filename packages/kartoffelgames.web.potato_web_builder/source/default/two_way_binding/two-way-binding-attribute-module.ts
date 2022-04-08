import { Dictionary } from '@kartoffelgames/core.data';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../component/values/layer-values';
import { PwbStaticAttributeModule } from '../../module/decorator/pwb-static-attribute-module.decorator';
import { ModuleAccessType } from '../../module/enum/module-access-type';
import { IPwbStaticModuleOnUpdate } from '../../module/interface/module';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ComponentManagerReference } from '../../injection_reference/component-manager-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module-layer-values-reference';
import { ModuleTargetReference } from '../../injection_reference/module-target-reference';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

@PwbStaticAttributeModule({
    selector: /^\[\([[\w$]+\)\]$/,
    access: ModuleAccessType.ReadWrite,
    forbiddenInManipulatorScopes: false
})
export class TwoWayBindingAttributeModule implements IPwbStaticModuleOnUpdate {
    private readonly mAttributeReference: ModuleAttributeReference;
    private readonly mTargetReference: ModuleTargetReference;
    private readonly mThisProperty: string;
    private readonly mUserObjectCompareHandler: CompareHandler<any>;
    private readonly mValueHandler: LayerValues;
    private readonly mViewCompareHandler: CompareHandler<any>;
    private readonly mViewProperty: string;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetReference, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference, pComponentManagerReference: ComponentManagerReference) {
        this.mTargetReference = pTargetReference;
        this.mValueHandler = pValueReference.value;
        this.mAttributeReference = pAttributeReference;

        // Get property name.
        const lAttributeKey: string = this.mAttributeReference.value.qualifiedName;
        this.mViewProperty = lAttributeKey.substr(2, lAttributeKey.length - 4);
        this.mThisProperty = this.mAttributeReference.value.value;

        // Add comparison handler for this and for the target view value.
        this.mUserObjectCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
        this.mViewCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);

        // Patch target. Do nothing with it.
        pComponentManagerReference.value.updateHandler.registerObject(pTargetReference.value);
    }

    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    public onUpdate(): boolean {
        let lValueChanged: boolean = false;
        // Try to update view only on module initialize.
        const lThisValue: any = ComponentScopeExecutor.executeSilent(this.mThisProperty, this.mValueHandler);

        // Check for changes in this value.
        if (!this.mUserObjectCompareHandler.compareAndUpdate(lThisValue)) {
            // Update target view
            Reflect.set(this.mTargetReference.value, this.mViewProperty, lThisValue);

            // Update view compare with same value. 
            this.mViewCompareHandler.update(lThisValue);

            // Set flag that value was updated.
            lValueChanged = true;
        } else {
            const lTargetViewValue: any = Reflect.get(this.mTargetReference.value, this.mViewProperty);

            // Check for changes in view.
            if (!this.mViewCompareHandler.compareAndUpdate(lTargetViewValue)) {
                const lExtendedValues: Dictionary<string, any> = new Dictionary<string, any>();
                lExtendedValues.set('$DATA', lTargetViewValue);

                // Update value.
                ComponentScopeExecutor.execute(`${this.mThisProperty} = $DATA;`, this.mValueHandler, lExtendedValues);

                // Update compare.
                this.mUserObjectCompareHandler.update(lTargetViewValue);

                // Set flag that value was updated.
                lValueChanged = true;
            }
        }

        return lValueChanged;
    }
}