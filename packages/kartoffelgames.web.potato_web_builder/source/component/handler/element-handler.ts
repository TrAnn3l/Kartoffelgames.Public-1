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
    private readonly mSlotNameList: List<string>;
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
     * Valid slot names for this element.
     */
    public get validSlotNames(): Array<string> {
        return this.mSlotNameList.clone();
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
        this.mSlotNameList = new List<string>();
    }

    /**
     * Add valid slot name. Slot must be added independently.
     * @param pSlotName - New slot name.
     */
    public addValidSlot(pSlotName: string): void {
        this.mSlotNameList.push(pSlotName);
    }

    /**
     * Connect all exported properties with html element.
     */
    public connectExportedProperties(): void {
        const lExportedPropertyList: Array<string | symbol> = Metadata.get(this.mUserObjectHandler.userClass).getMetadata(MetadataKey.METADATA_EXPORTED_PROPERTIES);
        this.mAttributeHandler.connectExportedProperties(lExportedPropertyList ?? new Array<string | symbol>());
    }

    /**
     * Get Slotname for this element.
     * User can decide where the component gets append when any slot name was set.
     * If no slot was set an exception is thrown.
     * @param pTemplate - Template of node.
     */
    public getElementsSlotname(pTemplate: BaseXmlNode): string {
        const lSlotNameList: Array<string> = this.validSlotNames;

        let lSlotName: string;
        if (lSlotNameList.length === 0) {
            throw new Exception(`${this.mHtmlElement.tagName} does not support child elements.`, this);
        } else if (lSlotNameList.length === 1) {
            // Append content on single slot.
            lSlotName = lSlotNameList[0];
        } else {
            // Check if user class implements correct interface.
            if (typeof this.mUserObjectHandler.userObject.assignSlotContent !== 'function') {
                throw new Exception('UserClass must implement PwbSlotAssign to use more than one content root.', this);
            }

            // Let the user decide in which content root the new content gets append.
            lSlotName = this.mUserObjectHandler.userObject.assignSlotContent(pTemplate);

            // Check user selected slot name.
            if (!lSlotNameList.includes(lSlotName)) {
                throw new Exception(`No slot with slotname "${lSlotName}" found.`, this);
            }
        }

        return lSlotName;
    }

}