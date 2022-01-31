import { ComponentManager } from '../component/component-manager';

export interface PwbComponentElement extends HTMLElement {
    readonly component: ComponentManager;
}

export type PwbComponentConstructor = {
    new(): PwbComponentElement;
};