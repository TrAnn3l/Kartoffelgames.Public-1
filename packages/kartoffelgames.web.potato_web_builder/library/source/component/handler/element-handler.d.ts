import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { UserObjectHandler } from './user-object-handler';
export declare class ElementHandler {
    private readonly mAttributeHandler;
    private readonly mHtmlElement;
    private readonly mShadowRoot;
    private readonly mSlotNameList;
    private readonly mUserObjectHandler;
    /**
     * Get html element.
     */
    get htmlElement(): HTMLElement;
    /**
     * Elements shadow root.
     */
    get shadowRoot(): ShadowRoot;
    /**
     * Valid slot names for this element.
     */
    get validSlotNames(): Array<string>;
    /**
     * Constructor.
     * @param pHtmlElement - HTMLElement.
     * @param pUserObjectHandler - User object handler.
     */
    constructor(pHtmlElement: HTMLElement, pUserObjectHandler: UserObjectHandler);
    /**
     * Add valid slot name. Slot must be added independently.
     * @param pSlotName - New slot name.
     */
    addValidSlot(pSlotName: string): void;
    /**
     * Connect all exported properties with html element.
     */
    connectExportedProperties(): void;
    /**
     * Get Slotname for this element.
     * User can decide where the component gets append when any slot name was set.
     * If no slot was set an exception is thrown.
     * @param pTemplate - Template of node.
     */
    getElementsSlotname(pTemplate: BaseXmlNode): string;
}
//# sourceMappingURL=element-handler.d.ts.map