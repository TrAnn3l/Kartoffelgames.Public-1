import { UserObjectHandler } from './user-object-handler';
export declare class AttributeHandler {
    private readonly mHtmlElement;
    private readonly mUserObjectHandler;
    /**
     * Constructor.
     * @param pUserObjectHandler - user object handler.
     * @param pHtmlElement - Components html element.
     */
    constructor(pUserObjectHandler: UserObjectHandler, pHtmlElement: HTMLElement);
    /**
     * Connect exported properties to html element attributes with the same name.
     * @param pExportedProperties - Exported user object properties.
     */
    connectExportedProperties(pExportedProperties: Array<string | symbol>): void;
    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    private exportPropertyAsAttribute;
    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     */
    private patchHtmlAttributes;
}
//# sourceMappingURL=attribute-handler.d.ts.map