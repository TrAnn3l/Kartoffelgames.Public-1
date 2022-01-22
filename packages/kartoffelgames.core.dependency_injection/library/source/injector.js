"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
const injectable_1 = require("./injection/injectable");
const injectable_singleton_1 = require("./injection/injectable-singleton");
const injection_register_1 = require("./injection/injection-register");
class Injector {
}
exports.Injector = Injector;
/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
Injector.Injectable = injectable_1.Injectable;
/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * @param pConstructor - Constructor.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
Injector.InjectableSingleton = injectable_singleton_1.InjectableSingleton;
/**
 * Create object and auto inject parameter.
 * @param pConstructor - Constructor that should be created.
 */
Injector.createObject = injection_register_1.InjectionRegister.createObject;
/**
 * Replaces an constructor so instead of the original, the replacement gets injected.
 * Both consructors must be registered.
 * @param pOriginalConstructor - Original constructor that should be replaced.
 * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
 */
Injector.replaceInjectable = injection_register_1.InjectionRegister.replaceInjectable;
//# sourceMappingURL=injector.js.map