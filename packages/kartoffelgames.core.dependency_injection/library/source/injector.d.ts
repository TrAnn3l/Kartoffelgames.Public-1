import { Injectable } from './injection/injectable';
import { InjectableSingleton } from './injection/injectable-singleton';
import { InjectionRegister } from './injection/injection-register';
export declare class Injector {
    /**
     * AtScript.
     * Mark class to be injectable as an instanced object.
     * @param pConstructor - Constructor.
     */
    static readonly Injectable: typeof Injectable;
    /**
     * AtScript.
     * Mark class to be injectable as an singleton object.
     * @param pConstructor - Constructor.
     */
    static readonly InjectableSingleton: typeof InjectableSingleton;
    /**
     * Create object and auto inject parameter.
     * @param pConstructor - Constructor that should be created.
     */
    static createObject: typeof InjectionRegister.createObject;
    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both consructors must be registered.
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     */
    static replaceInjectable: typeof InjectionRegister.replaceInjectable;
}
//# sourceMappingURL=injector.d.ts.map