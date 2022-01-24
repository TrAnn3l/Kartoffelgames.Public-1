"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = void 0;
const inject_mode_1 = require("../enum/inject-mode");
const reflect_initialiser_1 = require("../reflect/reflect-initialiser");
const injection_register_1 = require("./injection-register");
reflect_initialiser_1.ReflectInitialiser.initialize();
/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
function Injectable(pConstructor) {
    injection_register_1.InjectionRegister.registerInjectable(pConstructor, inject_mode_1.InjectMode.Instanced);
}
exports.Injectable = Injectable;
//# sourceMappingURL=injectable.js.map