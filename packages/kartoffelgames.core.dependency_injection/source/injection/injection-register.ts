import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { InjectMode } from '../enum/inject-mode';
import { DecorationHistory } from '../reflect/decoration-history';
import { InjectionConstructor } from '../type';
import { TypeRegister } from '../type_register/type-register';

export class InjectionRegister {
    private static readonly mInjectMode: Dictionary<InjectionConstructor, InjectMode> = new Dictionary<InjectionConstructor, InjectMode>();
    private static readonly mInjectableConstructor: Dictionary<InjectionConstructor, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();
    private static readonly mSingletonMapping: Dictionary<InjectionConstructor, object> = new Dictionary<InjectionConstructor, object>();

    /**
     * Create object and auto inject parameter.
     * @param pConstructor - Constructor that should be created.
     * @param pLocalInjections - [Optional] Type objects pairs that replaces parameter with given type.
     *                           Does not inject those types any further into create object of parameters.
     * @param pForceCreate - [Optional] Force create new objects. Ignores the singleton injection restriction and creates a new object.
     *                       Has no effect on none singleton injections.
     */
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pForceCreate?: boolean): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pLocalInjections?: Dictionary<InjectionConstructor, any>): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pLocalInjectionsOrForceCreate?: Dictionary<InjectionConstructor, any> | boolean): T {
        // Check if constructor is registered or constructor is inside decorator history.
        const lHistory: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(pConstructor);

        // Check if any constructor inside the decoration history is registered.
        let lIsRegistered: boolean = false;
        for (const lConstructor of lHistory) {
            if (InjectionRegister.mInjectableConstructor.has(lConstructor)) {
                lIsRegistered = true;
                break;
            }
        }

        // Exit if constructor is not register.
        if (!lIsRegistered) {
            throw new Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, InjectionRegister);
        }

        // Get constructor parameter type information and default to empty parameter list.
        let lParameterTypeList: Array<InjectionConstructor> = TypeRegister.getConstructorTypes(pConstructor);
        if (typeof lParameterTypeList === 'undefined') {
            lParameterTypeList = new Array<InjectionConstructor>();
        }

        // Decide between local injection or force creation parameter.
        let lLocalInjections: Dictionary<InjectionConstructor, any>;
        let lForceCreate: boolean;
        if (typeof pLocalInjectionsOrForceCreate === 'boolean') {
            lForceCreate = pLocalInjectionsOrForceCreate;
            lLocalInjections = new Dictionary<InjectionConstructor, any>();
        } else {
            lForceCreate = false;
            lLocalInjections = pLocalInjectionsOrForceCreate ?? new Dictionary<InjectionConstructor, any>();
        }

        // Return cached sinleton object if not forced to create a new one.
        if (!lForceCreate && InjectionRegister.mSingletonMapping.has(pConstructor)) {
            return <T>InjectionRegister.mSingletonMapping.get(pConstructor);
        }

        // Create parameter.
        const lConstructorParameter: Array<object> = new Array<object>();
        for (const lParameterType of lParameterTypeList) {
            let lCreatedParameter: object;

            // Check if parameter can be replaced with an local injection
            if (lLocalInjections && lLocalInjections.has(lParameterType)) {
                lCreatedParameter = lLocalInjections.get(lParameterType);
            } else {
                // Get injectable parameter.
                const lParameterConstructor: InjectionConstructor = InjectionRegister.mInjectableConstructor.get(lParameterType);

                // Check if parameter is registerd to be injected.
                if (typeof lParameterConstructor !== 'undefined') {
                    lCreatedParameter = InjectionRegister.createObject(lParameterConstructor, lLocalInjections);
                } else {
                    throw new Exception(`Parameter "${lParameterType.name}" of ${pConstructor.name} is not injectable.`, InjectionRegister);
                }
            }

            // Add parameter to construction parameter list.
            lConstructorParameter.push(lCreatedParameter);
        }

        // Create object.
        const lCreatedObject: T = <T>new pConstructor(...lConstructorParameter);

        // Cache singleton objects but only if not forced to create.
        const lInjecttionMode: InjectMode = InjectionRegister.mInjectMode.get(pConstructor);
        if (lForceCreate && lInjecttionMode === InjectMode.Singleton) {
            InjectionRegister.mSingletonMapping.add(pConstructor, lCreatedObject);
        }

        return lCreatedObject;
    }

    /**
     * Register an constructor for injection.
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    public static registerInjectable(pConstructor: InjectionConstructor, pMode: InjectMode): void {
        InjectionRegister.mInjectableConstructor.add(pConstructor, pConstructor);
        InjectionRegister.mInjectMode.add(pConstructor, pMode);
    }

    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both consructors must be registered.
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     */
    public static replaceInjectable(pOriginalConstructor: InjectionConstructor, pReplacementConstructor: InjectionConstructor): void {
        // Check if original constructor is registerd.
        if (InjectionRegister.mInjectableConstructor.has(pOriginalConstructor)) {
            // Check if replacement constructor is registerd.
            if (InjectionRegister.mInjectableConstructor.has(pReplacementConstructor)) {
                // Replace original with replaced constructor.
                InjectionRegister.mInjectableConstructor.set(pOriginalConstructor, pReplacementConstructor);
            } else {
                throw new Exception('Replacement constructor is not registered.', InjectionRegister);
            }
        } else {
            throw new Exception('Original constructor is not registered.', InjectionRegister);
        }
    }
}