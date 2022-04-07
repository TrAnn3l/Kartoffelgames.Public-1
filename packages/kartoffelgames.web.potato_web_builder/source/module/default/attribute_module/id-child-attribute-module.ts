import { StaticAttributeModule } from '../../base/decorator/static-attribute-module';
import { ModuleAccessType } from '../../base/enum/module-access-type';
import { ModuleAttributeReference } from '../../../injection/module-attribute-reference';
import { ComponentManagerReference } from '../../../injection/component-manager-reference';
import { ModuleLayerValuesReference } from '../../../injection/module-layer-values-reference';
import { ModuleTargetReference } from '../../../injection/module-target-reference';

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
    public constructor(pTargetReference: ModuleTargetReference, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference, pComponentManager: ComponentManagerReference) {
        const lRegistedElement: Node = pComponentManager.value.updateHandler.registerObject(pTargetReference.value);

        // Add current html element to temporary root values. Delete starting #.
        pValueReference.value.setRootValue(pAttributeReference.value.qualifiedName.substr(1), lRegistedElement);
    }
}