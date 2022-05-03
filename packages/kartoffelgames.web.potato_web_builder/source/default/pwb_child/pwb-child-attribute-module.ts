import { PwbStaticAttributeModule } from '../../module/decorator/pwb-static-attribute-module.decorator';
import { ModuleAccessType } from '../../module/enum/module-access-type';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ComponentManagerReference } from '../../injection_reference/component-manager-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module-layer-values-reference';
import { ModuleTargetReference } from '../../injection_reference/module-target-reference';

/**
 * Used with "#IdChildName" like => #PasswordInput.
 */
@PwbStaticAttributeModule({
    selector: /^#[[\w$]+$/,
    access: ModuleAccessType.Write,
    forbiddenInManipulatorScopes: true
})
export class PwbChildAttributeModule {
    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetReference, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference, pComponentManager: ComponentManagerReference) {
        const lTarget: Node = <Node>pTargetReference.value;
        const lRegistedElement: Node = pComponentManager.value.updateHandler.registerObject(lTarget);

        // Add current html element to temporary root values. Delete starting #.
        pValueReference.value.setRootValue(pAttributeReference.value.qualifiedName.substring(1), lRegistedElement);
    }
}