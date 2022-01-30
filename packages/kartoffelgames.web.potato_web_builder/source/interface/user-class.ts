import { ComponentHandler } from '../component_manager/component-handler';
import { PwbComponentElement } from './html-component';
import { IPwbOnDeconstruct, IPwbOnInit, IPwbSlotAssign, IPwbAfterInit, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange } from './user-interface';

export interface UserClassObject extends IPwbOnInit, IPwbAfterInit, IPwbOnDeconstruct, IPwbSlotAssign, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange {
    readonly componentHandler: ComponentHandler;
}

export type UserClassConstructor = {
    componentSelector: string;
    new(...pParameter: Array<any>): UserClassObject;
    createComponent(): PwbComponentElement;
}
