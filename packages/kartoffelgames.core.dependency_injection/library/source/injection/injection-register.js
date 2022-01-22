"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectionRegister = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const inject_mode_1 = require("../enum/inject-mode");
const decoration_history_1 = require("../reflect/decoration-history");
const type_storage_1 = require("../type_storage/type-storage");
class InjectionRegister {
    /**
     * Create object and auto inject parameter.
     * @param pConstructor - Constructor that should be created.
     * @param pLocalInjections - [Optional] Type objects pairs that replaces parameter with given type.
     *                           Does not inject those types any further into create object of parameters.
     */
    static createObject(pConstructor, pLocalInjections) {
        // Check if constrcutor is registered or constructor is inside decorator history.
        const lHistory = decoration_history_1.DecorationHistory.getBackwardHistoryOf(pConstructor);
        // Check if constructor is registered.
        let lIsRegistered = false;
        for (const lConstructor of lHistory) {
            if (InjectionRegister.mInjectableConstructor.has(lConstructor)) {
                lIsRegistered = true;
                break;
            }
        }
        if (!lIsRegistered) {
            throw new core_data_1.Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, InjectionRegister);
        }
        let lParameterTypeList = type_storage_1.TypeStorage.getConstructorTypes(pConstructor);
        // Check if constructor has any typeinformation.
        if (typeof lParameterTypeList === 'undefined') {
            // Default empty parameter list.
            lParameterTypeList = new Array();
        }
        const lConstructorParameter = new Array();
        const lLocalInjections = pLocalInjections !== null && pLocalInjections !== void 0 ? pLocalInjections : new core_data_1.Dictionary();
        // Create each parameter.
        for (const lParameterType of lParameterTypeList) {
            let lCreatedParameter;
            // Check if parameter can be replaced with an local injection
            if (lLocalInjections.has(lParameterType)) {
                lCreatedParameter = lLocalInjections.get(lParameterType);
            }
            else {
                // Get injectable parameter.
                const lParameterConstructor = InjectionRegister.mInjectableConstructor.get(lParameterType);
                // Check if parameter is registerd to be injected.
                if (typeof lParameterConstructor !== 'undefined') {
                    const lInjecttionMode = InjectionRegister.mInjectMode.get(lParameterConstructor);
                    // Check injection mode.
                    if (lInjecttionMode === inject_mode_1.InjectMode.Instanced) {
                        lCreatedParameter = InjectionRegister.createObject(lParameterConstructor);
                    }
                    else {
                        // Get already created object or create a new one if not already created.
                        if (InjectionRegister.mSingletonMapping.has(lParameterConstructor)) {
                            lCreatedParameter = InjectionRegister.mSingletonMapping.get(lParameterConstructor);
                        }
                        else {
                            // Create new singleton instance and cache it.
                            lCreatedParameter = InjectionRegister.createObject(lParameterConstructor);
                            InjectionRegister.mSingletonMapping.add(lParameterConstructor, lCreatedParameter);
                        }
                    }
                }
                else {
                    throw new core_data_1.Exception(`Parameter "${lParameterType.name}" of ${pConstructor.name} is not injectable.`, InjectionRegister);
                }
            }
            // Add created object to 
            lConstructorParameter.push(lCreatedParameter);
        }
        // create constructor with created parameter..
        return new pConstructor(...lConstructorParameter);
    }
    /**
     * Register an constructor for injection.
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    static registerInjectableObject(pConstructor, pMode) {
        InjectionRegister.mInjectableConstructor.add(pConstructor, pConstructor);
        InjectionRegister.mInjectMode.add(pConstructor, pMode);
    }
    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both consructors must be registered.
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     */
    static replaceInjectable(pOriginalConstructor, pReplacementConstructor) {
        // Check if original constructor is registerd.
        if (InjectionRegister.mInjectableConstructor.has(pOriginalConstructor)) {
            // Check if replacement constructor is registerd.
            if (InjectionRegister.mInjectableConstructor.has(pReplacementConstructor)) {
                // Replace original with replaced constructor.
                InjectionRegister.mInjectableConstructor.set(pOriginalConstructor, pReplacementConstructor);
            }
            else {
                throw new core_data_1.Exception('Replacement constructor is not registered.', InjectionRegister);
            }
        }
        else {
            throw new core_data_1.Exception('Original constructor is not registered.', InjectionRegister);
        }
    }
}
exports.InjectionRegister = InjectionRegister;
InjectionRegister.mInjectMode = new core_data_1.Dictionary();
InjectionRegister.mInjectableConstructor = new core_data_1.Dictionary();
InjectionRegister.mSingletonMapping = new core_data_1.Dictionary();
//# sourceMappingURL=injection-register.js.map