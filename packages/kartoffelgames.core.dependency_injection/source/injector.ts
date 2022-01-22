import { Injectable } from './injection/injectable';
import { InjectableSingleton } from './injection/injectable-singleton';
import { InjectionRegister } from './injection/injection-register';

export class Injector {
    /**
     * AtScript.
     * Mark class to be injectable as an instanced object.
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Injectable = Injectable;

    /**
     * AtScript.
     * Mark class to be injectable as an singleton object.
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly InjectableSingleton = InjectableSingleton;

    /**
     * Create object and auto inject parameter.
     * @param pConstructor - Constructor that should be created.
     */
    public static createObject = InjectionRegister.createObject;

    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both consructors must be registered.
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     */
    public static replaceInjectable = InjectionRegister.replaceInjectable;
}