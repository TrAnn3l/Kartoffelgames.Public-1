import { Dictionary } from '@kartoffelgames/core.data';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { UserClassConstructor, UserClassObject } from '../../interface/user-class';
import { UpdateHandler } from './update-handler';

export class UserObjectHandler {
    private readonly mUserObject: UserClassObject;

    /**
     * User class.
     */
    public get userClass(): UserClassConstructor {
        return <UserClassConstructor>this.mUserObject.constructor;
    }

    /**
     * User class instance.
     */
    public get userObject(): UserClassObject {
        return this.mUserObject;
    }

    /**
     * Constrcutor.
     * @param pUserClass - User object constructor.
     */
    public constructor(pUserClass: UserClassConstructor, pUpdateHandler: UpdateHandler, pInjectionList: Array<object>) {
        // Create injection mapping. Ignores none objects.
        const lLocalInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
        for (const lInjectionObject of pInjectionList) {
            if (typeof lInjectionObject === 'object' && lInjectionObject !== null) {
                lLocalInjections.add(<InjectionConstructor>lInjectionObject.constructor, lInjectionObject);
            }
        }

        // Create user object inside update zone.
        // Constructor needs to be called inside zone.
        let lUntrackedUserObject: UserClassObject;
        pUpdateHandler.execute(() => {
            lUntrackedUserObject = Injection.createObject(pUserClass, lLocalInjections);
        });
        this.mUserObject = pUpdateHandler.registerObject(lUntrackedUserObject);
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
    public callOnPwbAttributeChange(pAttributeName: string | symbol): void {
        this.callUserCallback('onPwbAttributeChange', pAttributeName);
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
    private callUserCallback(pCallbackKey: UserObjectCallbacks, ...pArguments: Array<any>) {
        // Callback when it exits
        if (pCallbackKey in this.mUserObject) {
            (<(...pArguments: Array<any>) => void>this.mUserObject[pCallbackKey])(...pArguments);
        }
    }

}

type UserObjectCallbacks = keyof UserClassObject;