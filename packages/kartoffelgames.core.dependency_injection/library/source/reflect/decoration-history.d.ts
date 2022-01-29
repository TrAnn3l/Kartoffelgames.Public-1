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
     * Get the root constructor of decoration history.
     * @param pConstructor - Constructor with decorations.
     */
    static getRootOf(pConstructor: InjectionConstructor): InjectionConstructor;
}
//# sourceMappingURL=decoration-history.d.ts.map