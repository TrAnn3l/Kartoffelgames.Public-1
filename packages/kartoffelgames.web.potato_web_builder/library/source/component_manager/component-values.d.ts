import { ComponentEventEmitter } from '../user_class_manager/component-event-emitter';
import { UserClassObject } from '../interface/user-class';
/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Simple access for all value types: TemporaryValue, IdChild and UserClassValue.
 * has-, get-, set-, remove-.
 */
export declare class ComponentValues {
    /**
     * Check if value object is the root user class object.
     * @param pValueObject - Value object.
     */
    private static isUserClassObject;
    private readonly mTemporaryValues;
    private readonly mValidSlotNameList;
    private readonly mValueObject;
    /**
     * Get the user class object.
     */
    get userClassObject(): UserClassObject & {
        [index: string]: any;
    };
    /**
     * Get all keys of temorary values.
     */
    get temporaryValuesList(): Array<string>;
    /**
     * Get all valid slot names.
     */
    get validSlotNameList(): Array<string>;
    /**
     * Constructor.
     * Initialize data lists.
     * @param pValueObject - Parent value object.
     *                       Is the user class object on root level and values handler on any branch level          .
     */
    constructor(pValueObject: UserClassObject | ComponentValues);
    /**
     * Check for changes into two value handler.
     * @param pHandler - Handler two.
     */
    equal(pHandler: ComponentValues): boolean;
    /**
     * Gets the html element specified temporary value.
     * @param pValueName - Name of value.
     */
    getTemporaryValue<TValue>(pValueName: string): TValue;
    /**
     * Get event emitter from user class object.
     * @param pEventName - Name of event.
     */
    getUserClassEvent(pEventName: string): ComponentEventEmitter<any> | undefined;
    /**
     * Remove temporary value from current manipulator scope.
     * Can only remove temporary values of current scope.
     * @param pValueName - Name of the value.
     */
    removeTemporaryValue(pValueName: string): void;
    /**
     * Add or replaces temporary value in this manipulator scope.
     * @param pValueName - Name of the value.
     * @param pValue - Value.
     * @param pSetToRoot - [Optional] If value should be set to root values and all layers should have access to it.
     */
    setTemporaryValue<TValue>(pValueName: string, pValue: TValue, pSetToRoot?: boolean): void;
}
//# sourceMappingURL=component-values.d.ts.map