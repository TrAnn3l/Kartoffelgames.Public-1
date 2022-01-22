"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeStorage = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const member_type_1 = require("../enum/member-type");
const decoration_history_1 = require("../reflect/decoration-history");
const member_type_information_1 = require("./type_container/member-type-information");
class TypeStorage {
    /**
     * Get all types the constructor needs for construction.
     * @param pConstructor - Constructor.
     */
    static getConstructorTypes(pConstructor) {
        // Search for types in complete decoration history.
        for (const lConstructor of decoration_history_1.DecorationHistory.getBackwardHistoryOf(pConstructor)) {
            const lParameterTypeList = this.mConstructorToType.get(lConstructor);
            // Exit search if any type information was found.
            if (typeof lParameterTypeList !== 'undefined') {
                return lParameterTypeList;
            }
        }
        return undefined;
    }
    /**
     * Get typeinformation of a member.
     * @param pConstructor - Constructor.
     * @param pMember - Member of constructor.
     * @param pType - Member type type.
     */
    static getMemberTypes(pConstructor, pMember, pType) {
        for (const lConstructor of decoration_history_1.DecorationHistory.getBackwardHistoryOf(pConstructor)) {
            // Try to get constructors member information.
            const lConstructorMember = this.mMemberToType.get(lConstructor);
            // Check if constructor has member information.
            if (typeof lConstructorMember !== 'undefined') {
                const lMemberTypes = lConstructorMember.get(pMember);
                let lResultTypes;
                // Check if member has type information.
                if (typeof lMemberTypes !== 'undefined') {
                    // Set result type information by MemberType.
                    switch (pType) {
                        case member_type_1.MemberType.Member:
                            lResultTypes = lMemberTypes.memberType;
                            break;
                        case member_type_1.MemberType.Result:
                            lResultTypes = lMemberTypes.returnType;
                            break;
                        case member_type_1.MemberType.Parameter:
                            lResultTypes = lMemberTypes.parameterTypeList;
                            break;
                    }
                    // Check if type information exists.
                    if (typeof lResultTypes !== 'undefined') {
                        // Convert single type to list.
                        if (!Array.isArray(lResultTypes)) {
                            lResultTypes = core_data_1.List.newListWith(lResultTypes);
                        }
                        return lResultTypes;
                    }
                }
            }
        }
        return undefined;
    }
    /**
     * Set types of constructor.
     * @param pConstructor - Constructor.
     * @param pTypes - Types of constructor.
     */
    static setConstructorTypes(pConstructor, pTypes) {
        // Set constructor types.
        this.mConstructorToType.set(pConstructor, pTypes);
    }
    /**
     * Get typeinformation of a member.
     * @param pConstructor - Constructor.
     * @param pMember - Member of constructor.
     * @param pType - Member type type.
     */
    static setMemberTypes(pConstructor, pMember, pType, ...pTypes) {
        // Create constructor enty if it does not exist.
        if (!this.mMemberToType.has(pConstructor)) {
            this.mMemberToType.set(pConstructor, new core_data_1.Dictionary());
        }
        // Get all members of constructor.
        const lConstructorEnty = this.mMemberToType.get(pConstructor);
        // Create member enty if it does not exists.
        if (!lConstructorEnty.has(pMember)) {
            lConstructorEnty.set(pMember, new member_type_information_1.MemberTypeInformation());
        }
        // Get member type information.
        const lMemberTypes = lConstructorEnty.get(pMember);
        // Set correct member type type.
        switch (pType) {
            case member_type_1.MemberType.Member:
                lMemberTypes.memberType = pTypes[0];
                break;
            case member_type_1.MemberType.Result:
                lMemberTypes.returnType = pTypes[0];
                break;
            case member_type_1.MemberType.Parameter:
                lMemberTypes.parameterTypeList = pTypes;
                break;
        }
    }
}
exports.TypeStorage = TypeStorage;
TypeStorage.mConstructorToType = new core_data_1.Dictionary();
TypeStorage.mMemberToType = new core_data_1.Dictionary();
//# sourceMappingURL=type-storage.js.map