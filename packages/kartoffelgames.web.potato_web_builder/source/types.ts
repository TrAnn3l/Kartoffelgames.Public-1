import { BaseBuilder } from './component_manager/builder/base-builder';
import { PwbComponentElement } from './interface/html-component';

export type BaseContent = BaseBuilder | Node | PwbComponentElement;
export type HtmlContent = Element | PwbComponentElement;