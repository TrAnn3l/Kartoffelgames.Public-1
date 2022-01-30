"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticUserClassData = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
/**
 * Data that is same for all UserObjects. Like information that is set via decorators(Output, Event).
 */
class StaticUserClassData {
    /**
     * Get the static user class data.
     * @param pUserClassConstructor - User class constructor.
     */
    static get(pUserClassConstructor) {
        const lRootConstructor = core_dependency_injection_1.DecorationHistory.getRootOf(pUserClassConstructor);
        if (StaticUserClassData.mStaticData.has(lRootConstructor)) {
            return StaticUserClassData.mStaticData.get(lRootConstructor);
        }
        // If no created static user class data was found, create new one.
        const lNewStaticData = new UserClassStaticData();
        StaticUserClassData.mStaticData.add(pUserClassConstructor, lNewStaticData);
        return lNewStaticData;
    }
}
exports.StaticUserClassData = StaticUserClassData;
StaticUserClassData.mStaticData = new core_data_1.Dictionary();
class UserClassStaticData {
    constructor() {
        this.eventInformation = new core_data_1.Dictionary();
        this.exportProperty = new core_data_1.Dictionary();
    }
}
//# sourceMappingURL=static-user-class-data.js.map