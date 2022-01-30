import { Dictionary } from '@kartoffelgames/core.data';
import { UserClassConstructor } from '../interface/user-class';
import { DecorationHistory } from '@kartoffelgames/core.dependency-injection';

/**
 * Data that is same for all UserObjects. Like information that is set via decorators(Output, Event).
 */
export class StaticUserClassData {
    private static readonly mStaticData: Dictionary<UserClassConstructor, UserClassStaticData> = new Dictionary<UserClassConstructor, UserClassStaticData>();

    /**
     * Get the static user class data.
     * @param pUserClassConstructor - User class constructor.
     */
    public static get(pUserClassConstructor: UserClassConstructor): UserClassStaticData | undefined {
        const lRootConstructor: UserClassConstructor = <UserClassConstructor>DecorationHistory.getRootOf(pUserClassConstructor);

        if (StaticUserClassData.mStaticData.has(lRootConstructor)) {
            return StaticUserClassData.mStaticData.get(lRootConstructor);
        }

        // If no created static user class data was found, create new one.
        const lNewStaticData: UserClassStaticData = new UserClassStaticData();
        StaticUserClassData.mStaticData.add(pUserClassConstructor, lNewStaticData);

        return lNewStaticData;
    }
}

class UserClassStaticData {
    public eventInformation: Dictionary<string, string> = new Dictionary<string, string>();
    public exportProperty: Dictionary<string, boolean> = new Dictionary<string, boolean>();
}