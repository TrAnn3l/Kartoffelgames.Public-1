import { InjectionConstructor } from '../../type';

export class MemberTypeInformation {
    private mMemberType: InjectionConstructor;
    private mParameterTypeList: Array<InjectionConstructor>;
    private mReturnType: InjectionConstructor;

    /**
     * Get type of member.
     */
    public get memberType(): InjectionConstructor {
        return this.mMemberType;
    }

    /**
     * Get type of member.
     */
    public set memberType(pType: InjectionConstructor) {
        this.mMemberType = pType;
    }

    /**
     * Get types of function parameter.
     */
    public get parameterTypeList(): Array<InjectionConstructor> {
        return this.mParameterTypeList;
    }

    /**
     * Set types of function parameter.
     */
    public set parameterTypeList(pTypeList: Array<InjectionConstructor>)  {
        this.mParameterTypeList = pTypeList;
    }

    /**
     * Get return type of function member.
     */
    public get returnType(): InjectionConstructor {
        return this.mReturnType;
    }

    /**
     * Set return type of function member.
     */
    public set returnType(pType: InjectionConstructor)  {
        this.mReturnType = pType;
    }
}