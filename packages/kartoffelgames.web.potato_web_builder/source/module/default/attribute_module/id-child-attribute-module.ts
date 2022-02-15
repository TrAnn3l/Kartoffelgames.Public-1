import { ComponentManager } from '../../../component/component-manager';
import { LayerValues } from '../../../component/values/layer-values';
import { StaticAttributeModule } from '../../../decorator/module/static-attribute-module';
import { ModuleAccessType } from '../../../enum/module-access-type';
import { AttributeReference } from '../../base/injection/attribute-reference';
import { TargetReference } from '../../base/injection/target-reference';

/**
 * Used with "#IdChildName" like => #PasswordInput.
 */
@StaticAttributeModule({
    selector: /^#[[\w$]+$/,
    access: ModuleAccessType.Write,
    forbiddenInManipulatorScopes: true
})
export class IdChildAttributeModule {
    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTargetReference: TargetReference, pLayerValues: LayerValues, pAttributeReference: AttributeReference, pComponentHandler: ComponentManager) {
        const lRegistedElement: Node = pComponentHandler.updateHandler.registerObject(pTargetReference.value);

        // Add current html element to temporary root values. Delete starting #.
        pLayerValues.setRootValue(pAttributeReference.value.qualifiedName.substr(1), lRegistedElement);
    }
}