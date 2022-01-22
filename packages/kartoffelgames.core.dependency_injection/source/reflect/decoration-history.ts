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
     * The a history starting from the specified constructor and ending on the original undecorated constructor.
     * @param pConstructor - Constructor where the search should begin.
     */
    public static getBackwardHistoryOf(pConstructor: InjectionConstructor): Array<InjectionConstructor> {
        // Create history and add starting constructor.
        const lHistory: Array<InjectionConstructor> = new Array<InjectionConstructor>();
        lHistory.push(pConstructor);

        // Iterate over history as long as history can't go back.
        let lNextEntry: InjectionConstructor = pConstructor;
        while(typeof (lNextEntry = DecorationHistory.mBackwardHistory.get(lNextEntry)) !== 'undefined'){
            lHistory.push(lNextEntry);
        }

        return lHistory;
    }
}