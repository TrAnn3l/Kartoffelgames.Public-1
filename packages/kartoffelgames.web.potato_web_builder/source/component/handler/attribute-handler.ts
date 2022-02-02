import { UserObjectHandler } from './user-object-handler';

export class AttributeHandler {
    private readonly mHtmlElement: HTMLElement;
    private readonly mUserObjectHandler: UserObjectHandler;

    /**
     * Constructor.
     * @param pUserObjectHandler - user object handler.
     * @param pHtmlElement - Components html element.
     */
    public constructor(pUserObjectHandler: UserObjectHandler, pHtmlElement: HTMLElement) {
        this.mHtmlElement = pHtmlElement;
        this.mUserObjectHandler = pUserObjectHandler;
    }

    /**
     * Connect exported properties to html element attributes with the same name.
     * @param pExportedProperties - Exported user object properties.
     */
    public connectExportedProperties(pExportedProperties: Array<string | symbol>): void {
        this.exportPropertyAsAttribute(pExportedProperties);
        this.patchHtmlAttributes(pExportedProperties);
    }

    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    private exportPropertyAsAttribute(pExportedProperties: Array<string | symbol>): void {
        // Each exported property.
        for (const lExportProperty of pExportedProperties) {
            // Get property descriptor.
            let lDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(this.mHtmlElement, lExportProperty);
            if (!lDescriptor) {
                lDescriptor = {};
            }

            lDescriptor.enumerable = true;
            lDescriptor.configurable = true;
            delete lDescriptor.value;
            delete lDescriptor.writable;

            // Setter and getter of this property. Execute changes inside component handlers change detection.
            lDescriptor.set = (pValue: any) => {
                (<any>this.mUserObjectHandler.userObject)[lExportProperty] = pValue;

                // Call OnAttributeChange.
                this.mUserObjectHandler.callOnPwbAttributeChange(lExportProperty);
            };
            lDescriptor.get = () => {
                let lValue: any = (<any>this.mUserObjectHandler.userObject)[lExportProperty];

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
                (<any>this.mHtmlElement)[pQualifiedName] = pValue;
            }

            lOriginalSetAttribute.call(this.mHtmlElement, pQualifiedName, pValue);
        };

        // Patch get attribute
        this.mHtmlElement.getAttribute = (pQualifiedName: string): string => {
            // Check if attribute is an exported value and return value of user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                return (<any>this.mHtmlElement)[pQualifiedName];
            }

            return lOriginalGetAttribute.call(this.mHtmlElement, pQualifiedName);
        };
    }

}