import { ComponentHandler } from '../component_manager/component-handler';
export interface PwbComponentElement extends HTMLElement {
    readonly componentHandler: ComponentHandler;
}
export declare type PwbComponentConstructor = {
    new (): PwbComponentElement;
};
//# sourceMappingURL=html-component.d.ts.map