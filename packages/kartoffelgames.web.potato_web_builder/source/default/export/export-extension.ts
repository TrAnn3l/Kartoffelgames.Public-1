import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { UserObjectHandler } from '../../component/handler/user-object-handler';
import { PwbExtension } from '../../extension/decorator/pwb-extension.decorator';
import { ExtensionMode } from '../../extension/enum/extension-mode';
import { ExtensionType } from '../../extension/enum/extension-type';
import { ComponentElementReference } from '../../injection_reference/component-element-reference';
import { ComponentManagerReference } from '../../injection_reference/component-manager-reference';

@PwbExtension({
    type: ExtensionType.Component,
    mode: ExtensionMode.Patch
})
export class ExportExtension {
    public static readonly METADATA_EXPORTED_PROPERTIES: string = 'pwb:exported_properties';

    private readonly mHtmlElement: HTMLElement;
    private readonly mUserObjectHandler: UserObjectHandler;

    /**
     * Constructor.
     * @param pTargetElementReference - Component html element reference.
     * @param pComponentManagerReference - Component manager reference.
     */
    public constructor(pTargetElementReference: ComponentElementReference, pComponentManagerReference: ComponentManagerReference,) {
        this.mHtmlElement = <HTMLElement>pTargetElementReference.value;
        this.mUserObjectHandler = pComponentManagerReference.value.userObjectHandler;

        const lExportedPropertyList: Array<string | symbol> = Metadata.get(this.mUserObjectHandler.userClass).getMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES);
        this.connectExportedProperties(lExportedPropertyList ?? new Array<string | symbol>());
    }

    /**
     * Connect exported properties to html element attributes with the same name.
     * @param pExportedProperties - Exported user object properties.
     */
    private connectExportedProperties(pExportedProperties: Array<string | symbol>): void {
        this.exportPropertyAsAttribute(pExportedProperties);
        this.patchHtmlAttributes(pExportedProperties);
    }

    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    private exportPropertyAsAttribute(pExportedProperties: Array<string | symbol>): void {
        // Each exported property.
        for (const lExportProperty of pExportedProperties) {
            // Get property descriptor. HTMLElement has no descriptors -,-
            const lDescriptor: PropertyDescriptor = {}; //Object.getOwnPropertyDescriptor(this.mHtmlElement, lExportProperty);

            lDescriptor.enumerable = true;
            lDescriptor.configurable = true;
            delete lDescriptor.value;
            delete lDescriptor.writable;

            // Setter and getter of this property. Execute changes inside component handlers change detection.
            lDescriptor.set = (pValue: any) => {
                Reflect.set(this.mUserObjectHandler.userObject, lExportProperty, pValue);

                // Call OnAttributeChange.
                this.mUserObjectHandler.callOnPwbAttributeChange(lExportProperty);
            };
            lDescriptor.get = () => {
                let lValue: any = Reflect.get(this.mUserObjectHandler.userObject, lExportProperty);

                // Bind "this" context to the exported function.
                if (typeof lValue === 'function') {
                    lValue = (<(...pArgs: Array<any>) => any>lValue).bind(this.mUserObjectHandler.userObject);
                }

                return lValue;
            };

            Object.defineProperty(this.mHtmlElement, lExportProperty, lDescriptor);
        }
    }

    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     */
    private patchHtmlAttributes(pExportedProperties: Array<string | symbol>): void {
        // Get original functions.
        const lOriginalSetAttribute: (pQualifiedName: string, pValue: string) => void = this.mHtmlElement.setAttribute;
        const lOriginalGetAttribute: (pQualifiedName: string) => string = this.mHtmlElement.getAttribute;

        // Patch set attribute
        this.mHtmlElement.setAttribute = (pQualifiedName: string, pValue: string) => {
            // Check if attribute is an exported value and set value to user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                Reflect.set(this.mHtmlElement, pQualifiedName, pValue);
            }

            lOriginalSetAttribute.call(this.mHtmlElement, pQualifiedName, pValue);
        };

        // Patch get attribute
        this.mHtmlElement.getAttribute = (pQualifiedName: string): string => {
            // Check if attribute is an exported value and return value of user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                return Reflect.get(this.mHtmlElement, pQualifiedName);
            }

            return lOriginalGetAttribute.call(this.mHtmlElement, pQualifiedName);
        };
    }
}