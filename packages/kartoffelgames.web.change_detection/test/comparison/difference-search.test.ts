import { expect } from 'chai';
import { ChangeState, DifferenceSearch, HistoryItem } from '../../source/comparison/difference-search';

describe('DifferenceSearch', () => {
    it('Method: differencesOf', () => {
        // Setup. Initialize DifferentSearch.
        const lDifferentReference: DifferenceSearch<string, string> = new DifferenceSearch((pValueOne: string, pValueTwo: string) => {
            return pValueOne === pValueTwo;
        });

        // Setup. Values.
        const lValueOne: string = 'abcdef';
        const lValueTwo: string = 'axcefx';

        // Process.
        const lChanges: Array<HistoryItem<string, string>> = lDifferentReference.differencesOf(lValueOne.split(''), lValueTwo.split(''));

        // Evaluation.
        expect(lChanges).to.deep.equal([
            { changeState: ChangeState.Keep, item: 'a' },
            { changeState: ChangeState.Remove, item: 'b' },
            { changeState: ChangeState.Insert, item: 'x' },
            { changeState: ChangeState.Keep, item: 'c' },
            { changeState: ChangeState.Remove, item: 'd' },
            { changeState: ChangeState.Keep, item: 'e' },
            { changeState: ChangeState.Keep, item: 'f' },
            { changeState: ChangeState.Insert, item: 'x' }
        ]);
    });
});