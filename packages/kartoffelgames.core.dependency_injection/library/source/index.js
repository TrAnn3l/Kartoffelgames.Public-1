"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectableSingleton = exports.Injectable = exports.DecorationHistory = exports.Metadata = exports.Injector = void 0;
// Injection
var injector_1 = require("./injector");
Object.defineProperty(exports, "Injector", { enumerable: true, get: function () { return injector_1.Injector; } });
// Metadata
var metadata_1 = require("./metadata/metadata");
Object.defineProperty(exports, "Metadata", { enumerable: true, get: function () { return metadata_1.Metadata; } });
// Decoration
var decoration_history_1 = require("./reflect/decoration-history");
Object.defineProperty(exports, "DecorationHistory", { enumerable: true, get: function () { return decoration_history_1.DecorationHistory; } });
// Decorator
var injectable_1 = require("./injection/injectable");
Object.defineProperty(exports, "Injectable", { enumerable: true, get: function () { return injectable_1.Injectable; } });
var injectable_singleton_1 = require("./injection/injectable-singleton");
Object.defineProperty(exports, "InjectableSingleton", { enumerable: true, get: function () { return injectable_singleton_1.InjectableSingleton; } });
//# sourceMappingURL=index.js.map