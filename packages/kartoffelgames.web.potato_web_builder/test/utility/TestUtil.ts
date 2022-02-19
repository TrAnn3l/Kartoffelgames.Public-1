import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
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
}

