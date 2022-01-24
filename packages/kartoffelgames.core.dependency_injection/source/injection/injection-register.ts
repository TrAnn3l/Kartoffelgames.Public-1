import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { InjectMode } from '../enum/inject-mode';
import { DecorationHistory } from '../reflect/decoration-history';
import { InjectionConstructor } from '../type';
import { TypeRegister } from '../type_register/type-register';

export class InjectionRegister {
    private static readonly mInjectMode: Dictionary<InjectionConstructor, InjectMode> = new Dictionary<InjectionConstructor, InjectMode>();
    private static readonly mInjectableConstructor: Dictionary<InjectionConstructor, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();
    private static readonly mInjectableReplacement: Dictionary<InjectionConstructor, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();
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
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pForceCreate?: boolean, pLocalInjections?: Dictionary<InjectionConstructor, any>): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pForceCreateOrLocalInjections?: boolean | Dictionary<InjectionConstructor, any>, pLocalInjections?: Dictionary<InjectionConstructor, any>): T {
        // Decide between local injection or force creation parameter.
        let lLocalInjections: Dictionary<InjectionConstructor, any>;
        let lForceCreate: boolean;
        if (typeof pForceCreateOrLocalInjections === 'object' && pForceCreateOrLocalInjections !== null) {
            lForceCreate = false;
            lLocalInjections = pForceCreateOrLocalInjections;
        } else {
            lForceCreate = !!pForceCreateOrLocalInjections;
            lLocalInjections = pLocalInjections ?? new Dictionary<InjectionConstructor, any>();
        }

        // Find constructor in decoration history that was used for registering.
        const lHistory: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(pConstructor);
        let lRegisteredConstructor: InjectionConstructor = lHistory.find((pConstructorHistory: InjectionConstructor) => {
            return InjectionRegister.mInjectableConstructor.has(pConstructorHistory);
        });

        // Exit if constructor is not register.
        if (!lRegisteredConstructor) {
            throw new Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, InjectionRegister);
        }

        // Replace current constructor with global replacement.
        let lConstructor: InjectionConstructor;
        const lReplacementConstructor = InjectionRegister.mInjectableReplacement.get(lRegisteredConstructor);
        if (lReplacementConstructor) {
            lConstructor = lReplacementConstructor;

            // Find replacement constructor in decoration history that was used for registering. Is allways registered.
            const lHistory: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(lReplacementConstructor);
            lRegisteredConstructor = lHistory.find((pConstructorHistory: InjectionConstructor) => {
                return InjectionRegister.mInjectableConstructor.has(pConstructorHistory);
            });
        } else {
            lConstructor = pConstructor;
        }

        // Get constructor parameter type information and default to empty parameter list.
        let lParameterTypeList: Array<InjectionConstructor> = TypeRegister.getConstructorParameterTypes(lRegisteredConstructor);
        if (typeof lParameterTypeList === 'undefined') {
            lParameterTypeList = new Array<InjectionConstructor>();
        }

        // Get injection mode.
        const lInjecttionMode: InjectMode = InjectionRegister.mInjectMode.get(lRegisteredConstructor);

        // Return cached sinleton object if not forced to create a new one.
        if (!lForceCreate && lInjecttionMode === InjectMode.Singleton && InjectionRegister.mSingletonMapping.has(lRegisteredConstructor)) {
            return <T>InjectionRegister.mSingletonMapping.get(lRegisteredConstructor);
        }

        // Create parameter.
        const lConstructorParameter: Array<object> = new Array<object>();
        for (const lParameterType of lParameterTypeList) {
            let lCreatedParameter: object;

            // Check if parameter can be replaced with an local injection
            if ((lInjecttionMode !== InjectMode.Singleton || lForceCreate) && lLocalInjections.has(lParameterType)) {
                lCreatedParameter = lLocalInjections.get(lParameterType);
            } else {
                // Proxy exception.
                try {
                    // Get injectable parameter.
                    lCreatedParameter = InjectionRegister.createObject(lParameterType, lLocalInjections);
                } catch (pException) {
                    throw new Exception(`Parameter "${lParameterType.name}" of ${lConstructor.name} is not injectable.\n` + pException.message, InjectionRegister);
                }
            }

            // Add parameter to construction parameter list.
            lConstructorParameter.push(lCreatedParameter);
        }

        // Create object.
        const lCreatedObject: T = <T>new lConstructor(...lConstructorParameter);

        // Cache singleton objects but only if not forced to create.
        if (!lForceCreate && lInjecttionMode === InjectMode.Singleton) {
            InjectionRegister.mSingletonMapping.add(lRegisteredConstructor, lCreatedObject);
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
        // Find original registered original.
        const lOriginalHistory: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(pOriginalConstructor);
        const lRegisteredOriginal: InjectionConstructor = lOriginalHistory.find((pConstructorHistory: InjectionConstructor) => {
            return InjectionRegister.mInjectableConstructor.has(pConstructorHistory);
        });

        // Exit if original is not registered.
        if (!lRegisteredOriginal) {
            throw new Exception('Original constructor is not registered.', InjectionRegister);
        }

        // Find replacement registered original.
        const lReplacementHistory: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(pReplacementConstructor);
        const lRegisteredReplacement: InjectionConstructor = lReplacementHistory.find((pConstructorHistory: InjectionConstructor) => {
            return InjectionRegister.mInjectableConstructor.has(pConstructorHistory);
        });

        // Exit if original is not registered.
        if (!lRegisteredReplacement) {
            throw new Exception('Replacement constructor is not registered.', InjectionRegister);
        }

        // Register replacement.
        InjectionRegister.mInjectableReplacement.set(lRegisteredOriginal, pReplacementConstructor);
    }
}