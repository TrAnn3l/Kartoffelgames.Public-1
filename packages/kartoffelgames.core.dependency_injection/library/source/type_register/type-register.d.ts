import { MemberType } from '../enum/member-type';
import { InjectionConstructor } from '../type';
export declare class TypeRegister {
    private static readonly mConstructorToType;
    private static readonly mMemberToType;
    /**
     * Get all types the constructor needs for construction in order.
     * @param pConstructor - Constructor.
     */
    static getConstructorParameterTypes(pConstructor: InjectionConstructor): Array<InjectionConstructor>;
    /**
     * Get typeinformation of a member.
     * @param pConstructor - Constructor.
     * @param pMember - Member of constructor.
     * @param pType - Member type type.
     */
    static getMemberTypes(pConstructor: InjectionConstructor, pMember: string | symbol, pType: MemberType): Array<InjectionConstructor>;
    /**
     * Set types of constructor.
     * @param pConstructor - Constructor.
     * @param pTypes - Types of constructor.
     */
    static setConstructorTypes(pConstructor: InjectionConstructor, pTypes: Array<InjectionConstructor>): void;
    /**
     * Get typeinformation of a member.
     * @param pConstructor - Constructor.
     * @param pMember - Member of constructor.
     * @param pType - Member type type.
     */
    static setMemberTypes(pConstructor: InjectionConstructor, pMember: string | symbol, pType: MemberType, ...pTypes: Array<InjectionConstructor>): void;
}
//# sourceMappingURL=type-register.d.ts.map