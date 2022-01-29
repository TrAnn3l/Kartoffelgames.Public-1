"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataDecorator = void 0;
const metadata_1 = require("../metadata/metadata");
const reflect_initializer_1 = require("../reflect/reflect-initializer");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
function MetadataDecorator(pMetadataKey, pMetadataValue) {
    return (pTarget, pProperty) => {
        // Get constructor from prototype if is an instanced member.
        let lConstructor;
        if (typeof pTarget !== 'function') {
            lConstructor = pTarget.constructor;
        }
        else {
            lConstructor = pTarget;
        }
        // Set metadata for property or class.
        if (pProperty) {
            metadata_1.Metadata.get(lConstructor).getProperty(pProperty).setMetadata(pMetadataKey, pMetadataValue);
        }
        else {
            metadata_1.Metadata.get(lConstructor).setMetadata(pMetadataKey, pMetadataValue);
        }
    };
}
exports.MetadataDecorator = MetadataDecorator;
//# sourceMappingURL=metadata-decorator.js.map