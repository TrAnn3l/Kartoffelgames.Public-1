import { Dictionary } from '@kartoffelgames/core.data';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../../component/values/layer-values';
import { StaticAttributeModule } from '../../../decorator/module/static-attribute-module';
import { ModuleAccessType } from '../../../enum/module-access-type';
import { IPwbStaticModuleOnUpdate } from '../../../interface/module';
import { AttributeReference } from '../../base/injection/attribute-reference';
import { TargetReference } from '../../base/injection/target-reference';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';

@StaticAttributeModule({
    selector: /^\[\([[\w$]+\)\]$/,
    access: ModuleAccessType.ReadWrite,
    forbiddenInManipulatorScopes: false
})
export class TwoWayBindingAttributeModule implements IPwbStaticModuleOnUpdate {
    private readonly mAttributeReference: AttributeReference;
    private readonly mTargetReference: TargetReference;
    private mViewCompareHandler: CompareHandler<any>;
    private mViewProperty: string;
    private mUserObjectCompareHandler: CompareHandler<any>;
    private mThisProperty: string;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetReference: TargetReference, pValueHandler: LayerValues, pAttributeReference: AttributeReference) {
        this.mTargetReference = pTargetReference;
        this.mValueHandler = pValueHandler;
        this.mAttributeReference = pAttributeReference;

        // Get property name.
        const lAttributeKey: string = this.mAttributeReference.value.qualifiedName;
        this.mViewProperty = lAttributeKey.substr(2, lAttributeKey.length - 4);
        this.mThisProperty = this.mAttributeReference.value.value;

        // Add comparison handler for this and for the target view value.
        this.mUserObjectCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
        this.mViewCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
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