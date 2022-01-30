import { Dictionary } from '@kartoffelgames/core.data';
import { UserClassConstructor } from '../interface/user-class';
/**
 * Data that is same for all UserObjects. Like information that is set via decorators(Output, Event).
 */
export declare class StaticUserClassData {
    private static readonly mStaticData;
    /**
     * Get the static user class data.
     * @param pUserClassConstructor - User class constructor.
     */
    static get(pUserClassConstructor: UserClassConstructor): UserClassStaticData | undefined;
}
declare class UserClassStaticData {
    eventInformation: Dictionary<string, string>;
    exportProperty: Dictionary<string, boolean>;
}
export {};
//# sourceMappingURL=static-user-class-data.d.ts.map