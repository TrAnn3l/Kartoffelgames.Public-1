import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../../component/values/layer-values';
import { StaticAttributeModule } from '../../base/decorator/static-attribute-module';
import { ModuleAccessType } from '../../base/enum/module-access-type';
import { IPwbStaticModuleOnUpdate } from '../../base/interface/module';
import { AttributeReference } from '../../base/injection/attribute-reference';
import { LayerValuesReference } from '../../base/injection/layer-values-reference';
import { TargetReference } from '../../base/injection/target-reference';
import { ComponentScopeExecutor } from '../../base/execution/component-scope-executor';

/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
@StaticAttributeModule({
    selector: /^\[[\w$]+\]$/,
    access: ModuleAccessType.Read,
    forbiddenInManipulatorScopes: false
})
export class OneWayBindingAttributeModule implements IPwbStaticModuleOnUpdate {
    private readonly mExecutionString: string;
    private readonly mTargetProperty: string;
    private readonly mTargetReference: TargetReference;
    private readonly mValueCompare: CompareHandler<any>;
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

        // Get execution string.
        this.mExecutionString = pAttributeReference.value.value;

        // Get view object information. Remove starting [ and end ].
        const lAttributeKey: string = pAttributeReference.value.qualifiedName;
        this.mTargetProperty = lAttributeKey.substr(1, lAttributeKey.length - 2);

        // Create empty compare handler with unique symbol.
        this.mValueCompare = new CompareHandler(Symbol('Uncompareable'), 4);
    }

    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    public onUpdate(): boolean {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);

        if (!this.mValueCompare.compareAndUpdate(lExecutionResult)) {
            // Set view object property.
            Reflect.set(this.mTargetReference.value, this.mTargetProperty, lExecutionResult);

            return true;
        }

        return false;
    }
}