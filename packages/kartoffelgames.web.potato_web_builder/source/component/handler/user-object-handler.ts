import { UserClassObject } from '../../interface/user-class';

export class UserObjectHandler {
    private readonly mUserObject: UserClassObject;

    /**
     * Constrcutor.
     * @param pUserObject - User class instance.
     */
    public constructor(pUserObject: UserClassObject) {
        this.mUserObject = pUserObject;
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    public callAfterPwbInitialize(): void {
        this.callUserCallback('afterPwbInitialize');
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    public callAfterPwbUpdate(): void {
        this.callUserCallback('afterPwbUpdate');
    }

    /**
     * Call onPwbInitialize of user class object.
     * @param pAttributeName - Name of updated attribute.
     */
    public callOnPwbAttributeChange(pAttributeName: string): void {
        this.callUserCallback('onPwbAttributeChange');
    }

    /**
     * Call onPwbDeconstruct of user class object.
     */
    public callOnPwbDeconstruct(): void {
        this.callUserCallback('onPwbDeconstruct');
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    public callOnPwbInitialize(): void {
        this.callUserCallback('onPwbInitialize');
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    public callOnPwbUpdate(): void {
        this.callUserCallback('onPwbUpdate');
    }

    /**
     * Callback by name.
     * @param pCallbackKey - Callback name.
     */
    private callUserCallback(pCallbackKey: UserObjectCallbacks) {
        // Callback when it exits
        if (pCallbackKey in this.mUserObject) {
            (<() => void>this.mUserObject[pCallbackKey])();
        }
    }

}

type UserObjectCallbacks = keyof UserClassObject;