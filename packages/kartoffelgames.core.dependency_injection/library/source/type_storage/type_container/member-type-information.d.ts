import { InjectionConstructor } from '../../type';
export declare class MemberTypeInformation {
    private mMemberType;
    private mParameterTypeList;
    private mReturnType;
    /**
     * Get type of member.
     */
    get memberType(): InjectionConstructor;
    /**
     * Get type of member.
     */
    set memberType(pType: InjectionConstructor);
    /**
     * Get types of function parameter.
     */
    get parameterTypeList(): Array<InjectionConstructor>;
    /**
     * Set types of function parameter.
     */
    set parameterTypeList(pTypeList: Array<InjectionConstructor>);
    /**
     * Get return type of function member.
     */
    get returnType(): InjectionConstructor;
    /**
     * Set return type of function member.
     */
    set returnType(pType: InjectionConstructor);
}
//# sourceMappingURL=member-type-information.d.ts.map