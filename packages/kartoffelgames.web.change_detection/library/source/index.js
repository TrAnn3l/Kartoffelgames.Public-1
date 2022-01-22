"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeState = exports.DifferenceSearch = exports.ChangeDetection = exports.CompareHandler = void 0;
var compare_handler_1 = require("./comparison/compare-handler");
Object.defineProperty(exports, "CompareHandler", { enumerable: true, get: function () { return compare_handler_1.CompareHandler; } });
var change_detection_1 = require("./change_detection/change-detection");
Object.defineProperty(exports, "ChangeDetection", { enumerable: true, get: function () { return change_detection_1.ChangeDetection; } });
// Difference search
var difference_search_1 = require("./comparison/difference-search");
Object.defineProperty(exports, "DifferenceSearch", { enumerable: true, get: function () { return difference_search_1.DifferenceSearch; } });
Object.defineProperty(exports, "ChangeState", { enumerable: true, get: function () { return difference_search_1.ChangeState; } });
//# sourceMappingURL=index.js.map