import { InjectionConstructor } from '../type';
export declare class DecorationHistory {
    private static readonly mBackwardHistory;
    /**
     * Add an decoration history.
     * @param pFromConstructor - Previous constructor.
     * @param pToConstructor - Changed / next construtor.
     */
    static addHistory(pFromConstructor: InjectionConstructor, pToConstructor: InjectionConstructor): void;
    /**
     * The a history starting from the specified constructor and ending on the original undecorated constructor.
     * @param pConstructor - Constructor where the search should begin.
     */
    static getBackwardHistoryOf(pConstructor: InjectionConstructor): Array<InjectionConstructor>;
}
//# sourceMappingURL=decoration-history.d.ts.map