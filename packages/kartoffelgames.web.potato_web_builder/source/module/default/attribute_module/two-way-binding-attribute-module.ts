import { Dictionary } from '@kartoffelgames/core.data';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { ComponentScopeExecutor } from '../../execution/component-scope-executor';
import { StaticAttributeModule } from '../../../decorator/static-attribute-module';
import { IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate } from '../../../interface/module/static-attribute-module';
import { XmlAttribute } from '@kartoffelgames/core.xml';
import { HtmlContent } from '../../../types';
import { LayerValues } from '../../../component/values/layer-values';
import { ComponentManager } from '../../../component/component-manager';
import { AttributeModuleAccessType } from '../../../enum/attribute-module-access-type';

@StaticAttributeModule({
    accessType: AttributeModuleAccessType.ReadWrite,
    attributeSelector: /^\[\([[\w$]+\)\]$/,
    forbiddenInManipulatorScopes: false,
    manipulatesAttributes: false
})
export class TwoWayBindingAttributeModule implements IPwbStaticAttributeOnProcess, IPwbStaticAttributeOnUpdate {
    private readonly mAttribute: XmlAttribute;
    private readonly mComponentHandler: ComponentManager;
    private readonly mTargetElement: HtmlContent;
    private mTargetViewCompareHandler: CompareHandler<any>;
    private mTargetViewProperty: string;
    private mThisCompareHandler: CompareHandler<any>;
    private mThisValueExpression: string;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetElement - Target element.
     * @param pValueHandler - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetElement: Element, pValueHandler: LayerValues, pAttribute: XmlAttribute, pComponentHandler: ComponentManager) {
        this.mTargetElement = pTargetElement;
        this.mValueHandler = pValueHandler;
        this.mAttribute = pAttribute;
        this.mComponentHandler = pComponentHandler;
    }

    /**
     * Process module.
     * Initialize watcher and set view value with user class object value on startup.
     */
    public onProcess(): void {
        // Get property name.
        this.mTargetViewProperty = this.mAttribute.qualifiedName.substr(2, this.mAttribute.qualifiedName.length - 4);
        this.mThisValueExpression = this.mAttribute.value;

        // Try to update view only on module initialize.
        const lThisValue: any = ComponentScopeExecutor.executeSilent(this.mThisValueExpression, this.mValueHandler);

        // Register all events.
        this.mComponentHandler.updateHandler.registerObject(this.mTargetElement);

        // Only update if not undefined
        if (typeof lThisValue !== 'undefined') {
            (<any>this.mTargetElement)[this.mTargetViewProperty] = lThisValue;
        }

        // Add comparison handler for this and for the target view value.
        this.mThisCompareHandler = new CompareHandler(lThisValue, 4);
        this.mTargetViewCompareHandler = new CompareHandler((<any>this.mTargetElement)[this.mTargetViewProperty], 4);
    }

    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    public onUpdate(): boolean {
        let lValueChanged: boolean = false;
        // Try to update view only on module initialize.
        const lThisValue: any = ComponentScopeExecutor.executeSilent(this.mThisValueExpression, this.mValueHandler);

        // Check for changes in this value.
        if (!this.mThisCompareHandler.compare(lThisValue)) {
            // Update target view
            (<any>this.mTargetElement)[this.mTargetViewProperty] = lThisValue;
            // Update compare 
            this.mTargetViewCompareHandler.compare(lThisValue);

            // Set flag that value was updated.
            lValueChanged = true;
        } else {
            const lTargetViewValue: any = (<any>this.mTargetElement)[this.mTargetViewProperty];

            // Check for changes in view.
            if (!this.mTargetViewCompareHandler.compare(lTargetViewValue)) {
                const lExtendedValues: Dictionary<string, any> = new Dictionary<string, any>();
                lExtendedValues.set('$DATA', lTargetViewValue);

                // Update value.
                ComponentScopeExecutor.execute(`${this.mThisValueExpression} = $DATA;`, this.mValueHandler, lExtendedValues);

                // Update compare.
                this.mThisCompareHandler.compare(lTargetViewValue);

                // Set flag that value was updated.
                lValueChanged = true;
            }
        }

        return lValueChanged;
    }
}