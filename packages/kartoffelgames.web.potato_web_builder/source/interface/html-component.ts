import { ComponentHandler } from '../component_manager/component-handler';

export interface PwbComponentElement extends HTMLElement {
    readonly componentHandler: ComponentHandler;
}

export type PwbComponentConstructor = {
    new(): PwbComponentElement;
};