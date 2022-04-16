import { ComponentConnection } from '../../source/component/component-connection';
import { ComponentManager } from '../../source/component/component-manager';
import { PwbApp } from '../../source/pwb-app';

export class TestUtil {
    /**
     * Create component from selector.
     * @param pSelector - component selector.
     */
    public static async createComponent(pClass: any, pSilenceErrors: boolean = false): Promise<HTMLElement> {
        // Setup. Create app and silence errors.
        const lPwbApp: PwbApp = new PwbApp('Name');
        lPwbApp.addErrorListener(() => {
            return !pSilenceErrors;
        });

        // Skip wait for splash screen.
        lPwbApp.setSplashScreen({ content: '', background: '', manual: true });

        // Add component and append app to dom.
        lPwbApp.addContent(pClass);
        await lPwbApp.appendTo(document.body);

        // Get component.
        const lComponent: HTMLElement = <HTMLElement>lPwbApp.content.shadowRoot.childNodes[1];

        // Wait for any update to happen.
        await ComponentConnection.componentManagerOf(lComponent).updateHandler.waitForUpdate();

        return lComponent;
    }

    /**
     * Deconstruct the component.
     * @param pComponent - Pwb component.
     */
    public static deconstructComponent(pComponent: HTMLElement): void {
        ComponentConnection.componentManagerOf(pComponent).deconstruct();
    }

    /**
     * Get component manager of component.
     * @param pComponent - Pwb component.
     */
    public static getComponentManager(pComponent: HTMLElement): ComponentManager {
        return ComponentConnection.componentManagerOf(pComponent);
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

