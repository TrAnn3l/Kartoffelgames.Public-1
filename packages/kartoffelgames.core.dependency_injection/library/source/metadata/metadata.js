"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const decoration_history_1 = require("../reflect/decoration-history");
const constructor_metadata_1 = require("./constructor-metadata");
/**
 * Static.
 * Metadata storage.
 */
class Metadata {
    /**
     * Get metadata of constructor.
     */
    static get(pConstructor) {
        // Use root constructor to register metadata information.
        const lRegisteredConstructor = decoration_history_1.DecorationHistory.getRootOf(pConstructor);
        // Create new or get metadata.
        let lMetadata;
        if (!this.mConstructorMetadata.has(lRegisteredConstructor)) {
            lMetadata = new constructor_metadata_1.ConstructorMetadata();
            Metadata.mConstructorMetadata.add(lRegisteredConstructor, lMetadata);
        }
        else {
            lMetadata = Metadata.mConstructorMetadata.get(lRegisteredConstructor);
        }
        return lMetadata;
    }
}
exports.Metadata = Metadata;
Metadata.mConstructorMetadata = new core_data_1.Dictionary();
//# sourceMappingURL=metadata.js.map