import { ComponentEventEmitter } from '../user_class_manager/component-event-emitter';
import { Dictionary } from '@kartoffelgames/core.data';
import { UserClassConstructor, UserClassObject } from '../interface/user-class';
import { StaticUserClassData } from '../user_class_manager/static-user-class-data';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';

/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Simple access for all value types: TemporaryValue, IdChild and UserClassValue.
 * has-, get-, set-, remove-.
 */
export class ComponentValues {
    /**
     * Check if value object is the root user class object.
     * @param pValueObject - Value object.
     */
    private static isUserClassObject(pValueObject: ComponentValues | UserClassObject): pValueObject is UserClassObject {
        // Check if user class object is a component value instance.
        return !(pValueObject instanceof ComponentValues);
    }

    private readonly mTemporaryValues: Dictionary<string, any>;
    private readonly mValueObject: UserClassObject | ComponentValues;
    
    /**
     * Get the user class object.
     */
    public get userClassObject(): UserClassObject & { [index: string]: any; } {
        // Get values from parent if handler is only branch handler.
        if (!ComponentValues.isUserClassObject(this.mValueObject)) {
            return this.mValueObject.userClassObject;
        } else {
            // Is always the user class object.
            return this.mValueObject;
        }
    }

    /**
     * Get all keys of temorary values.
     */
    public get temporaryValuesList(): Array<string> {
        const lKeyList: Array<string> = this.mTemporaryValues.map<string>((pKey: string) => pKey);

        // Get key list from parent if parent can have temporary values.
        if (!ComponentValues.isUserClassObject(this.mValueObject)) {
            lKeyList.push(...this.mValueObject.temporaryValuesList);
        }

        return lKeyList;
    }

    /**
     * Constructor.
     * Initialize data lists.
     * @param pValueObject - Parent value object.
     *                       Is the user class object on root level and values handler on any branch level          .
     */
    public constructor(pValueObject: UserClassObject | ComponentValues) {
        this.mValueObject = pValueObject;
        this.mTemporaryValues = new Dictionary<string, any>();
    }

    /**
     * Check for changes into two value handler.
     * @param pHandler - Handler two.
     */
    public equal(pHandler: ComponentValues): boolean {
        const lTemporaryValuesOne: Array<string> = this.temporaryValuesList;
        const lTemporaryValuesTwo: Array<string> = pHandler.temporaryValuesList;

        // Compare if it has the same user class object.
        if (this.userClassObject !== pHandler.userClassObject) {
            return false;
        }

        // Compare length of temporary values.
        if(lTemporaryValuesOne.length !== lTemporaryValuesTwo.length){
            return false;
        }

        // Check for temporary values differences from one to two.
        for (const lTemporaryValueOneKey of lTemporaryValuesOne) {
            // Check for difference.
            if (this.getTemporaryValue(lTemporaryValueOneKey) !== pHandler.getTemporaryValue(lTemporaryValueOneKey)) {
                return false;
            }
        }

        // Check for temporary values differences from two to one.
        for (const lTemporaryValueTwoKey of lTemporaryValuesTwo) {
            // Check for difference.
            if (pHandler.getTemporaryValue(lTemporaryValueTwoKey) !== this.getTemporaryValue(lTemporaryValueTwoKey)) {
                return false;
            }
        }    

        return true;
    }

    /**
     * Gets the html element specified temporary value.
     * @param pValueName - Name of value.
     */
    public getTemporaryValue<TValue>(pValueName: string): TValue {
        // If current dictionary has value.
        if (this.mTemporaryValues.has(pValueName)) {
            return this.mTemporaryValues.get(pValueName);
        } else if (!ComponentValues.isUserClassObject(this.mValueObject)) {
            // Search inside parents if not in current found.
            return this.mValueObject.getTemporaryValue(pValueName);
        }

        return undefined;
    }

    /**
     * Get event emitter from user class object.
     * @param pEventName - Name of event.
     */
    public getUserClassEvent(pEventName: string): ComponentEventEmitter<any> | undefined {
        let lUserClassConstructor: UserClassConstructor = <UserClassConstructor>this.userClassObject.constructor;

        // Get original constructor
        lUserClassConstructor = ChangeDetection.getUntrackedObject(lUserClassConstructor);

        // Check if event exists.
        const lEventProperty: string = StaticUserClassData.get(lUserClassConstructor).eventInformation.get(pEventName);
        if (typeof lEventProperty !== 'undefined') {
            // Get property of event emitter.
            return this.userClassObject[lEventProperty];
        } else {
            return undefined;
        }
    }

    /**
     * Remove temporary value from current manipulator scope.
     * Can only remove temporary values of current scope.
     * @param pValueName - Name of the value.
     */
    public removeTemporaryValue(pValueName: string): void {
        // Remove value from html element.
        this.mTemporaryValues.delete(pValueName);
    }

    /**
     * Add or replaces temporary value in this manipulator scope.
     * @param pValueName - Name of the value.
     * @param pValue - Value.
     * @param pSetToRoot - [Optional] If value should be set to root values and all layers should have access to it.
     */
    public setTemporaryValue<TValue>(pValueName: string, pValue: TValue, pSetToRoot?: boolean): void {
        if (!pSetToRoot || pSetToRoot && ComponentValues.isUserClassObject(this.mValueObject)) {
            // Set value to current layer.
            this.mTemporaryValues.set(pValueName, pValue);
        } else {
            // Set value to parent value object.
            (<ComponentValues>this.mValueObject).setTemporaryValue(pValueName, pValue, pSetToRoot);
        }
    }
}