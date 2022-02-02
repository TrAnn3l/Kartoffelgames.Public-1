import { IPwbOnDeconstruct, IPwbOnInit, IPwbSlotAssign, IPwbAfterInit, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange } from './user-interface';

export interface UserClassObject extends IPwbOnInit, IPwbAfterInit, IPwbOnDeconstruct, IPwbSlotAssign, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange {}

export type UserClassConstructor = {
    new(...pParameter: Array<any>): UserClassObject;
}
