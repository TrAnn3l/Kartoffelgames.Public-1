import { UserClass, UserObject } from '../../interface/user-class';
import { UpdateHandler } from './update-handler';
export declare class UserObjectHandler {
    private readonly mUserObject;
    /**
     * Untracked user class instance.
     */
    get untrackedUserObject(): UserObject;
    /**
     * User class.
     */
    get userClass(): UserClass;
    /**
     * User class instance.
     */
    get userObject(): UserObject;
    /**
     * Constrcutor.
     * @param pUserClass - User object constructor.
     */
    constructor(pUserClass: UserClass, pUpdateHandler: UpdateHandler, pInjectionList: Array<object>);
    /**
     * Call onPwbInitialize of user class object.
     */
    callAfterPwbInitialize(): void;
    /**
     * Call onPwbInitialize of user class object.
     */
    callAfterPwbUpdate(): void;
    /**
     * Call onPwbInitialize of user class object.
     * @param pAttributeName - Name of updated attribute.
     */
    callOnPwbAttributeChange(pAttributeName: string | symbol): void;
    /**
     * Call onPwbDeconstruct of user class object.
     */
    callOnPwbDeconstruct(): void;
    /**
     * Call onPwbInitialize of user class object.
     */
    callOnPwbInitialize(): void;
    /**
     * Call onPwbInitialize of user class object.
     */
    callOnPwbUpdate(): void;
    /**
     * Callback by name.
     * @param pCallbackKey - Callback name.
     */
    private callUserCallback;
}
//# sourceMappingURL=user-object-handler.d.ts.map