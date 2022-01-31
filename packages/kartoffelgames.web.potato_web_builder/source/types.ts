import { BaseBuilder } from './component/builder/base-builder';
import { PwbComponentElement } from './interface/html-component';

export type BaseContent = BaseBuilder | Node | PwbComponentElement;
export type HtmlContent = Element | PwbComponentElement;