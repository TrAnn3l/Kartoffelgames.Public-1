import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { InjectMode } from '../enum/inject-mode';
import { DecorationHistory } from '../reflect/decoration-history';
import { InjectionConstructor } from '../type';
import { TypeStorage } from '../type_storage/type-storage';

export class InjectionRegister {
    private static readonly mInjectMode: Dictionary<InjectionConstructor, InjectMode> = new Dictionary<InjectionConstructor, InjectMode>();
    private static readonly mInjectableConstructor: Dictionary<InjectionConstructor, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();
    private static readonly mSingletonMapping: Dictionary<InjectionConstructor, object> = new Dictionary<InjectionConstructor, object>();

    /**
     * Create object and auto inject parameter.
     * @param pConstructor - Constructor that should be created.
     * @param pLocalInjections - [Optional] Type objects pairs that replaces parameter with given type.
     *                           Does not inject those types any further into create object of parameters.
     */
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pLocalInjections?: Dictionary<InjectionConstructor, any>): T {
        // Check if constrcutor is registered or constructor is inside decorator history.
        const lHistory: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(pConstructor);

        // Check if constructor is registered.
        let lIsRegistered: boolean = false;
        for (const lConstructor of lHistory) {
            if (InjectionRegister.mInjectableConstructor.has(lConstructor)) {
                lIsRegistered = true;
                break;
            }
        }

        if (!lIsRegistered) {
            throw new Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, InjectionRegister);
        }

        let lParameterTypeList: Array<InjectionConstructor> = TypeStorage.getConstructorTypes(pConstructor);

        // Check if constructor has any typeinformation.
        if (typeof lParameterTypeList === 'undefined') {
            // Default empty parameter list.
            lParameterTypeList = new Array<InjectionConstructor>();
        }

        const lConstructorParameter: Array<object> = new Array<object>();

        const lLocalInjections: Dictionary<InjectionConstructor, any> = pLocalInjections ?? new Dictionary<InjectionConstructor, any>();

        // Create each parameter.
        for (const lParameterType of lParameterTypeList) {
            let lCreatedParameter: object;

            // Check if parameter can be replaced with an local injection
            if (lLocalInjections.has(lParameterType)) {
                lCreatedParameter = lLocalInjections.get(lParameterType);
            } else {

                // Get injectable parameter.
                const lParameterConstructor: InjectionConstructor = InjectionRegister.mInjectableConstructor.get(lParameterType);

                // Check if parameter is registerd to be injected.
                if (typeof lParameterConstructor !== 'undefined') {
                    const lInjecttionMode: InjectMode = InjectionRegister.mInjectMode.get(lParameterConstructor);

                    // Check injection mode.
                    if (lInjecttionMode === InjectMode.Instanced) {
                        lCreatedParameter = InjectionRegister.createObject(lParameterConstructor);
                    } else {
                        // Get already created object or create a new one if not already created.
                        if (InjectionRegister.mSingletonMapping.has(lParameterConstructor)) {
                            lCreatedParameter = InjectionRegister.mSingletonMapping.get(lParameterConstructor);
                        } else {
                            // Create new singleton instance and cache it.
                            lCreatedParameter = InjectionRegister.createObject(lParameterConstructor);
                            InjectionRegister.mSingletonMapping.add(lParameterConstructor, lCreatedParameter);
                        }
                    }
                } else {
                    throw new Exception(`Parameter "${lParameterType.name}" of ${pConstructor.name} is not injectable.`, InjectionRegister);
                }
            }
            // Add created object to 
            lConstructorParameter.push(lCreatedParameter);
        }

        // create constructor with created parameter..
        return <T>new pConstructor(...lConstructorParameter);
    }

    /**
     * Register an constructor for injection.
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    public static registerInjectableObject(pConstructor: InjectionConstructor, pMode: InjectMode): void {
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