import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';

export class DecorationHistory {
    private static readonly mBackwardHistory: Dictionary<InjectionConstructor, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();

    /**
     * Add an decoration history.
     * @param pFromConstructor - Previous constructor.
     * @param pToConstructor - Changed / next construtor.
     */
    public static addHistory(pFromConstructor: InjectionConstructor, pToConstructor: InjectionConstructor): void {
        DecorationHistory.mBackwardHistory.add(pToConstructor, pFromConstructor);
    }

    /**
     * Get the root constructor of decoration history.
     * @param pConstructor - Constructor with decorations.
     */
    public static getRootOf(pConstructor: InjectionConstructor): InjectionConstructor {
        // Iterate over history as long as history can't go back.
        let lNextEntry: InjectionConstructor = pConstructor;
        while (DecorationHistory.mBackwardHistory.has(lNextEntry)) {
            lNextEntry = DecorationHistory.mBackwardHistory.get(lNextEntry);
        }

        return lNextEntry;
    }
}