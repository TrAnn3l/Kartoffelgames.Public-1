"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
const injectable_decorator_1 = require("./decorator/injectable-decorator");
const injectable_singleton_decorator_1 = require("./decorator/injectable-singleton-decorator");
const metadata_decorator_1 = require("./decorator/metadata-decorator");
class Injector {
}
exports.Injector = Injector;
/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
Injector.Injectable = injectable_decorator_1.InjectableDecorator;
/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * @param pConstructor - Constructor.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
Injector.InjectableSingleton = injectable_singleton_decorator_1.InjectableSingletonDecorator;
/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
Injector.Metadata = metadata_decorator_1.MetadataDecorator;
//# sourceMappingURL=injector.js.map