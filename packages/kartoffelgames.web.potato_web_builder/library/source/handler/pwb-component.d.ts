import { ComponentManager } from '../component/component-manager';
export declare class PwbComponent {
    private readonly mComponentManager;
    /**
     * Get raw html element of component.
     */
    get componentElement(): HTMLElement;
    /**
     * Constructor.
     * @param pComponentHandler - Component handler.
     */
    constructor(pComponentHandler: ComponentManager);
    /**
     * Update component manually.
     */
    update(): void;
}
//# sourceMappingURL=pwb-component.d.ts.map