import { StaticAttributeModule } from '../../decorator/static-attribute-module';
import { ModuleAccessType } from '../../enum/module-access-type';
import { AttributeReference } from '../../base/injection/attribute-reference';
import { ComponentManagerReference } from '../../base/injection/component-manager-reference';
import { LayerValuesReference } from '../../base/injection/layer-values-reference';
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
    public constructor(pTargetReference: TargetReference, pValueReference: LayerValuesReference, pAttributeReference: AttributeReference, pComponentManager: ComponentManagerReference) {
        const lRegistedElement: Node = pComponentManager.value.updateHandler.registerObject(pTargetReference.value);

        // Add current html element to temporary root values. Delete starting #.
        pValueReference.value.setRootValue(pAttributeReference.value.qualifiedName.substr(1), lRegistedElement);
    }
}