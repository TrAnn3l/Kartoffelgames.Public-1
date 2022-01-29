"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectableSingletonDecorator = void 0;
const inject_mode_1 = require("../enum/inject-mode");
const injection_1 = require("../injection/injection");
const reflect_initializer_1 = require("../reflect/reflect-initializer");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * @param pConstructor - Constructor.
 */
function InjectableSingletonDecorator(pConstructor) {
    injection_1.Injection.registerInjectable(pConstructor, inject_mode_1.InjectMode.Singleton);
}
exports.InjectableSingletonDecorator = InjectableSingletonDecorator;
//# sourceMappingURL=injectable-singleton-decorator.js.map