import { ComponentManager } from '../component/component-manager';
export interface PwbComponentElement extends HTMLElement {
    readonly component: ComponentManager;
}
export declare type PwbComponentConstructor = {
    new (): PwbComponentElement;
};
//# sourceMappingURL=html-component.d.ts.map