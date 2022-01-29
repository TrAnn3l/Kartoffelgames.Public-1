import { Dictionary } from '@kartoffelgames/core.data';
import { InjectMode } from '../enum/inject-mode';
import { InjectionConstructor } from '../type';
export declare class Injection {
    private static readonly mInjectMode;
    private static readonly mInjectableConstructor;
    private static readonly mInjectableReplacement;
    private static readonly mSingletonMapping;
    /**
     * Create object and auto inject parameter.
     * @param pConstructor - Constructor that should be created.
     * @param pLocalInjections - [Optional] Type objects pairs that replaces parameter with given type.
     *                           Does not inject those types any further into create object of parameters.
     * @param pForceCreate - [Optional] Force create new objects. Ignores the singleton injection restriction and creates a new object.
     *                       Has no effect on none singleton injections.
     */
    static createObject<T extends object>(pConstructor: InjectionConstructor, pForceCreate?: boolean): T;
    static createObject<T extends object>(pConstructor: InjectionConstructor, pLocalInjections?: Dictionary<InjectionConstructor, any>): T;
    static createObject<T extends object>(pConstructor: InjectionConstructor, pForceCreate?: boolean, pLocalInjections?: Dictionary<InjectionConstructor, any>): T;
    /**
     * Register an constructor for injection.
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    static registerInjectable(pConstructor: InjectionConstructor, pMode: InjectMode): void;
    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both consructors must be registered.
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     */
    static replaceInjectable(pOriginalConstructor: InjectionConstructor, pReplacementConstructor: InjectionConstructor): void;
}
//# sourceMappingURL=injection.d.ts.map