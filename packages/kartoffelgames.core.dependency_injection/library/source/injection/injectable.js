"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = void 0;
const inject_mode_1 = require("../enum/inject-mode");
const reflect_initializer_1 = require("../reflect/reflect-initializer");
const injection_register_1 = require("./injection-register");
reflect_initializer_1.ReflectInitializer.initialize();
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