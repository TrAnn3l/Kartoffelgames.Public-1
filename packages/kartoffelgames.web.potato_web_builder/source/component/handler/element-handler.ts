import { Exception, List } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { MetadataKey } from '../../global-key';
import { AttributeHandler } from './attribute-handler';
import { UserObjectHandler } from './user-object-handler';

export class ElementHandler {
    private readonly mAttributeHandler: AttributeHandler;
    private readonly mHtmlElement: HTMLElement;
    private readonly mShadowRoot: ShadowRoot;
    private readonly mUserObjectHandler: UserObjectHandler;

    /**
     * Get html element.
     */
    public get htmlElement(): HTMLElement {
        return this.mHtmlElement;
    }

    /**
     * Elements shadow root.
     */
    public get shadowRoot(): ShadowRoot {
        return this.mShadowRoot;
    }

    /**
     * Constructor.
     * @param pHtmlElement - HTMLElement.
     * @param pUserObjectHandler - User object handler.
     */
    public constructor(pHtmlElement: HTMLElement, pUserObjectHandler: UserObjectHandler) {
        this.mHtmlElement = pHtmlElement;
        this.mShadowRoot = this.mHtmlElement.attachShadow({ mode: 'open' });
        this.mAttributeHandler = new AttributeHandler(pUserObjectHandler, pHtmlElement);
        this.mUserObjectHandler = pUserObjectHandler;

        // Connect user class with element attributes.
        this.connectExportedProperties();
    }

    /**
     * Connect all exported properties with html element.
     */
    private connectExportedProperties(): void {
        const lExportedPropertyList: Array<string | symbol> = Metadata.get(this.mUserObjectHandler.userClass).getMetadata(MetadataKey.METADATA_EXPORTED_PROPERTIES);
        this.mAttributeHandler.connectExportedProperties(lExportedPropertyList ?? new Array<string | symbol>());
    }
}