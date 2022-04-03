import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { ComponentConnection } from '../../source/component/component-connection';
import { ComponentManager } from '../../source/component/component-manager';
import { MetadataKey } from '../../source/metadata-key';

export class TestUtil {
    /**
     * Create component from selector.
     * @param pSelector - component selector.
     */
    public static async createComponent(pClass: any): Promise<HTMLElement> {
        const lSelector: string = Metadata.get(pClass).getMetadata(MetadataKey.METADATA_SELECTOR);

        // Create element.
        const lComponentConstructor: CustomElementConstructor = window.customElements.get(lSelector);
        const lComponent: HTMLElement = new lComponentConstructor();

        // Add to document and wait for any update to happen.
        document.body.appendChild(lComponent);
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();

        return lComponent;
    }

    /**
     * Deconstruct the component.
     */
    public static deconstructComponent(pComponent: HTMLElement): void {
        ComponentConnection.componentManagerOf(pComponent).deconstruct();
    }

    /**
     * Get component inner values. Start new selector if value should be searched inside shadow root.
     * @param pComponent - Component.
     * @param pSelectorList - List of selectors.
     */
    public static getComponentNode<TExpected extends Element>(pComponent: Element, ...pSelectorList: Array<string>): TExpected {
        // Clone selector list.
        const lSelectorList: Array<string> = [...pSelectorList];

        let lComponent: Element = pComponent;

        // Check if element has shadow root.
        if (lComponent.shadowRoot) {
            lComponent = lComponent.shadowRoot.querySelector(lSelectorList.shift());
        } else {
            lComponent = lComponent.querySelector(lSelectorList.shift());
        }

        // Search next selector.
        if (lSelectorList.length > 0) {
            lComponent = TestUtil.getComponentNode(lComponent, ...pSelectorList);
        }

        return <TExpected>lComponent;
    }

    /**
     * Manual update component.
     * @param pComponent - Component.
     */
    public static manualUpdate(pComponent: HTMLElement): void {
        const lComponentManager: ComponentManager = ComponentConnection.componentManagerOf(pComponent);
        lComponentManager.updateHandler.requestUpdate({ source: pComponent, property: null, stacktrace: '' });
    }

    /**
     * Get random component selector.
     */
    public static randomSelector(): string {
        let lResult = '';
        const lCharacters = 'abcdefghijklmnopqrstuvwxyz';
        const lCharactersLength = lCharacters.length;
        for (let lIndex = 0; lIndex < 10; lIndex++) {
            lResult += lCharacters.charAt(Math.floor(Math.random() * lCharactersLength));
        }
        return `${lResult}-${lResult}`;
    }

    /**
     * Wait for component to update.
     * @param pComponent - Component.
     */
    public static async waitForUpdate(pComponent: HTMLElement): Promise<void> {
        const lComponentManager: ComponentManager = ComponentConnection.componentManagerOf(pComponent);
        await lComponentManager.updateHandler.waitForUpdate();
    }
}

