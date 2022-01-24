"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectionRegister = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const inject_mode_1 = require("../enum/inject-mode");
const decoration_history_1 = require("../reflect/decoration-history");
const type_register_1 = require("../type_register/type-register");
class InjectionRegister {
    static createObject(pConstructor, pForceCreateOrLocalInjections, pLocalInjections) {
        // Decide between local injection or force creation parameter.
        let lLocalInjections;
        let lForceCreate;
        if (typeof pForceCreateOrLocalInjections === 'object' && pForceCreateOrLocalInjections !== null) {
            lForceCreate = false;
            lLocalInjections = pForceCreateOrLocalInjections;
        }
        else {
            lForceCreate = !!pForceCreateOrLocalInjections;
            lLocalInjections = pLocalInjections !== null && pLocalInjections !== void 0 ? pLocalInjections : new core_data_1.Dictionary();
        }
        // Find constructor in decoration history that was used for registering.
        const lHistory = decoration_history_1.DecorationHistory.getBackwardHistoryOf(pConstructor);
        let lRegisteredConstructor = lHistory.find((pConstructorHistory) => {
            return InjectionRegister.mInjectableConstructor.has(pConstructorHistory);
        });
        // Exit if constructor is not register.
        if (!lRegisteredConstructor) {
            throw new core_data_1.Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, InjectionRegister);
        }
        // Replace current constructor with global replacement.
        let lConstructor;
        const lReplacementConstructor = InjectionRegister.mInjectableReplacement.get(lRegisteredConstructor);
        if (lReplacementConstructor) {
            lConstructor = lReplacementConstructor;
            // Find replacement constructor in decoration history that was used for registering. Is allways registered.
            const lHistory = decoration_history_1.DecorationHistory.getBackwardHistoryOf(lReplacementConstructor);
            lRegisteredConstructor = lHistory.find((pConstructorHistory) => {
                return InjectionRegister.mInjectableConstructor.has(pConstructorHistory);
            });
        }
        else {
            lConstructor = pConstructor;
        }
        // Get constructor parameter type information and default to empty parameter list.
        let lParameterTypeList = type_register_1.TypeRegister.getConstructorParameterTypes(lRegisteredConstructor);
        if (typeof lParameterTypeList === 'undefined') {
            lParameterTypeList = new Array();
        }
        // Get injection mode.
        const lInjecttionMode = InjectionRegister.mInjectMode.get(lRegisteredConstructor);
        // Return cached sinleton object if not forced to create a new one.
        if (!lForceCreate && lInjecttionMode === inject_mode_1.InjectMode.Singleton && InjectionRegister.mSingletonMapping.has(lRegisteredConstructor)) {
            return InjectionRegister.mSingletonMapping.get(lRegisteredConstructor);
        }
        // Create parameter.
        const lConstructorParameter = new Array();
        for (const lParameterType of lParameterTypeList) {
            let lCreatedParameter;
            // Check if parameter can be replaced with an local injection
            if ((lInjecttionMode !== inject_mode_1.InjectMode.Singleton || lForceCreate) && lLocalInjections.has(lParameterType)) {
                lCreatedParameter = lLocalInjections.get(lParameterType);
            }
            else {
                // Proxy exception.
                try {
                    // Get injectable parameter.
                    lCreatedParameter = InjectionRegister.createObject(lParameterType, lLocalInjections);
                }
                catch (pException) {
                    throw new core_data_1.Exception(`Parameter "${lParameterType.name}" of ${lConstructor.name} is not injectable.\n` + pException.message, InjectionRegister);
                }
            }
            // Add parameter to construction parameter list.
            lConstructorParameter.push(lCreatedParameter);
        }
        // Create object.
        const lCreatedObject = new lConstructor(...lConstructorParameter);
        // Cache singleton objects but only if not forced to create.
        if (!lForceCreate && lInjecttionMode === inject_mode_1.InjectMode.Singleton) {
            InjectionRegister.mSingletonMapping.add(lRegisteredConstructor, lCreatedObject);
        }
        return lCreatedObject;
    }
    /**
     * Register an constructor for injection.
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    static registerInjectable(pConstructor, pMode) {
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
        // Find original registered original.
        const lOriginalHistory = decoration_history_1.DecorationHistory.getBackwardHistoryOf(pOriginalConstructor);
        const lRegisteredOriginal = lOriginalHistory.find((pConstructorHistory) => {
            return InjectionRegister.mInjectableConstructor.has(pConstructorHistory);
        });
        // Exit if original is not registered.
        if (!lRegisteredOriginal) {
            throw new core_data_1.Exception('Original constructor is not registered.', InjectionRegister);
        }
        // Find replacement registered original.
        const lReplacementHistory = decoration_history_1.DecorationHistory.getBackwardHistoryOf(pReplacementConstructor);
        const lRegisteredReplacement = lReplacementHistory.find((pConstructorHistory) => {
            return InjectionRegister.mInjectableConstructor.has(pConstructorHistory);
        });
        // Exit if original is not registered.
        if (!lRegisteredReplacement) {
            throw new core_data_1.Exception('Replacement constructor is not registered.', InjectionRegister);
        }
        // Register replacement.
        InjectionRegister.mInjectableReplacement.set(lRegisteredOriginal, pReplacementConstructor);
    }
}
exports.InjectionRegister = InjectionRegister;
InjectionRegister.mInjectMode = new core_data_1.Dictionary();
InjectionRegister.mInjectableConstructor = new core_data_1.Dictionary();
InjectionRegister.mInjectableReplacement = new core_data_1.Dictionary();
InjectionRegister.mSingletonMapping = new core_data_1.Dictionary();
//# sourceMappingURL=injection-register.js.map