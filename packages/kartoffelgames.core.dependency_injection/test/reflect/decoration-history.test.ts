import { expect } from 'chai';
import { DecorationHistory, InjectionConstructor } from '../../source';

describe('DecorationHistory', () => {
    it('Static Method: addHistory', () => {
        // Setup. Create classes.
        class TestLayer1 { }
        class TestLayer2 { }
        class TestLayer3 { }

        // Process. Add history and read hisory.
        DecorationHistory.addHistory(TestLayer1, TestLayer2);
        DecorationHistory.addHistory(TestLayer2, TestLayer3);
        const lHistoryList: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(TestLayer3);

        // Evaluation.
        expect(lHistoryList).to.have.ordered.members([TestLayer3, TestLayer2, TestLayer1]);
    });

    it('Static Method: getBackwardHistoryOf', () => {
        // Setup. Create classes.
        class TestLayer1 { }
        class TestLayer2 { }
        class TestLayer3 { }

        // Setup. Add history.
        DecorationHistory.addHistory(TestLayer1, TestLayer2);
        DecorationHistory.addHistory(TestLayer2, TestLayer3);

        // Process.    
        const lHistoryList: Array<InjectionConstructor> = DecorationHistory.getBackwardHistoryOf(TestLayer3);

        // Evaluation.
        expect(lHistoryList).to.have.ordered.members([TestLayer3, TestLayer2, TestLayer1]);
    });
});