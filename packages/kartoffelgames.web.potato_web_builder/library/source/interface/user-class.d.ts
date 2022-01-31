import { ComponentManager } from '../component/component-manager';
import { IPwbOnDeconstruct, IPwbOnInit, IPwbSlotAssign, IPwbAfterInit, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange } from './user-interface';
export interface UserClassObject extends IPwbOnInit, IPwbAfterInit, IPwbOnDeconstruct, IPwbSlotAssign, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange {
    readonly componentHandler: ComponentManager;
}
export declare type UserClassConstructor = {
    new (...pParameter: Array<any>): UserClassObject;
};
//# sourceMappingURL=user-class.d.ts.map