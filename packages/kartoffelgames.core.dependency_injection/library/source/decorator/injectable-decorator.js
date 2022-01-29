"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectableDecorator = void 0;
const inject_mode_1 = require("../enum/inject-mode");
const reflect_initializer_1 = require("../reflect/reflect-initializer");
const injection_1 = require("../injection/injection");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
function InjectableDecorator(pConstructor) {
    injection_1.Injection.registerInjectable(pConstructor, inject_mode_1.InjectMode.Instanced);
}
exports.InjectableDecorator = InjectableDecorator;
//# sourceMappingURL=injectable-decorator.js.map