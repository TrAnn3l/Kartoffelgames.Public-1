import { Dictionary, List } from '@kartoffelgames/core.data';
import { MemberType } from '../enum/member-type';
import { DecorationHistory } from '../reflect/decoration-history';
import { InjectionConstructor } from '../type';
import { MemberTypeInformation } from './type_container/member-type-information';

export class TypeRegister {
    private static readonly mConstructorToType: Dictionary<InjectionConstructor, Array<InjectionConstructor>> = new Dictionary<InjectionConstructor, Array<InjectionConstructor>>();
    private static readonly mMemberToType: Dictionary<InjectionConstructor, Dictionary<string | symbol, MemberTypeInformation>> = new Dictionary<InjectionConstructor, Dictionary<string | symbol, MemberTypeInformation>>();

    /**
     * Get all types the constructor needs for construction in order.
     * @param pConstructor - Constructor.
     */
    public static getConstructorTypes(pConstructor: InjectionConstructor): Array<InjectionConstructor> {
        // Search for types in complete decoration history.
        for (const lConstructor of DecorationHistory.getBackwardHistoryOf(pConstructor)) {
            const lParameterTypeList: Array<InjectionConstructor> = this.mConstructorToType.get(lConstructor);

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
    public static getMemberTypes(pConstructor: InjectionConstructor, pMember: string | symbol, pType: MemberType): Array<InjectionConstructor> {
        for (const lConstructor of DecorationHistory.getBackwardHistoryOf(pConstructor)) {
            // Try to get constructors member information.
            const lConstructorMember: Dictionary<string | symbol, MemberTypeInformation> = this.mMemberToType.get(lConstructor);

            // Check if constructor has member information.
            if (typeof lConstructorMember !== 'undefined') {
                const lMemberTypes: MemberTypeInformation = lConstructorMember.get(pMember);
                let lResultTypes: InjectionConstructor | Array<InjectionConstructor>;

                // Check if member has type information.
                if (typeof lMemberTypes !== 'undefined') {
                    // Set result type information by MemberType.
                    switch (pType) {
                        case MemberType.Member:
                            lResultTypes = lMemberTypes.memberType;
                            break;
                        case MemberType.Result:
                            lResultTypes = lMemberTypes.returnType;
                            break;
                        case MemberType.Parameter:
                            lResultTypes = lMemberTypes.parameterTypeList;
                            break;
                    }

                    // Check if type information exists.
                    if (typeof lResultTypes !== 'undefined') {
                        // Convert single type to list.
                        if (!Array.isArray(lResultTypes)) {
                            lResultTypes = List.newListWith(lResultTypes);
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
    public static setConstructorTypes(pConstructor: InjectionConstructor, pTypes: Array<InjectionConstructor>): void {
        // Set constructor types.
        this.mConstructorToType.set(pConstructor, pTypes);
    }

    /**
     * Get typeinformation of a member.
     * @param pConstructor - Constructor.
     * @param pMember - Member of constructor.
     * @param pType - Member type type.
     */
    public static setMemberTypes(pConstructor: InjectionConstructor, pMember: string | symbol, pType: MemberType, ...pTypes: Array<InjectionConstructor>): void {
        // Create constructor enty if it does not exist.
        if (!this.mMemberToType.has(pConstructor)) {
            this.mMemberToType.set(pConstructor, new Dictionary<string | symbol, MemberTypeInformation>());
        }

        // Get all members of constructor.
        const lConstructorEnty: Dictionary<string | symbol, MemberTypeInformation> = this.mMemberToType.get(pConstructor);

        // Create member enty if it does not exists.
        if (!lConstructorEnty.has(pMember)) {
            lConstructorEnty.set(pMember, new MemberTypeInformation());
        }

        // Get member type information.
        const lMemberTypes: MemberTypeInformation = lConstructorEnty.get(pMember);

        // Set correct member type type.
        switch (pType) {
            case MemberType.Member: lMemberTypes.memberType = pTypes[0]; break;
            case MemberType.Result: lMemberTypes.returnType = pTypes[0]; break;
            case MemberType.Parameter: lMemberTypes.parameterTypeList = pTypes; break;
        }
    }
}