"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberTypeInformation = void 0;
class MemberTypeInformation {
    /**
     * Get type of member.
     */
    get memberType() {
        return this.mMemberType;
    }
    /**
     * Get type of member.
     */
    set memberType(pType) {
        this.mMemberType = pType;
    }
    /**
     * Get types of function parameter.
     */
    get parameterTypeList() {
        return this.mParameterTypeList;
    }
    /**
     * Set types of function parameter.
     */
    set parameterTypeList(pTypeList) {
        this.mParameterTypeList = pTypeList;
    }
    /**
     * Get return type of function member.
     */
    get returnType() {
        return this.mReturnType;
    }
    /**
     * Set return type of function member.
     */
    set returnType(pType) {
        this.mReturnType = pType;
    }
}
exports.MemberTypeInformation = MemberTypeInformation;
//# sourceMappingURL=member-type-information.js.map