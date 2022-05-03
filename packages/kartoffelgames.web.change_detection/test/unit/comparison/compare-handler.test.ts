import { expect } from 'chai';
import { CompareHandler } from '../../../source/comparison/compare-handler';

describe('CompareHandler', () => {
    describe('Method: Compare', () => {
        it('-- Objects are equal', () => {
            // Setup.
            const lFunction = () => { return; };
            const lObjectOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
            const lObjectTwo = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
            const lCompareHandler: CompareHandler<any> = new CompareHandler(lObjectOne);

            // Process.
            const lIsEqual: boolean = lCompareHandler.compare(lObjectTwo);

            // Evaluation.
            expect(lIsEqual).to.be.true;
        });

        it('-- Objects are not equal on string', () => {
            // Setup.
            const lFunction = () => { return; };
            const lObjectOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
            const lObjectTwo = { string: '2', number: 1, object: { a: 1 }, array: [1], function: lFunction };
            const lCompareHandler: CompareHandler<any> = new CompareHandler(lObjectOne);

            // Process.
            const lIsEqual: boolean = lCompareHandler.compare(lObjectTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Objects are not equal on number', () => {
            // Setup.
            const lFunction = () => { return; };
            const lObjectOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
            const lObjectTwo = { string: '1', number: 2, object: { a: 1 }, array: [1], function: lFunction };
            const lCompareHandler: CompareHandler<any> = new CompareHandler(lObjectOne);

            // Process.
            const lIsEqual: boolean = lCompareHandler.compare(lObjectTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Objects are not equal on object with different key', () => {
            // Setup.
            const lFunction = () => { return; };
            const lObjectOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
            const lObjectTwo = { string: '1', number: 1, object: { b: 1 }, array: [1], function: lFunction };
            const lCompareHandler: CompareHandler<any> = new CompareHandler(lObjectOne);

            // Process.
            const lIsEqual: boolean = lCompareHandler.compare(lObjectTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Objects are not equal on array', () => {
            // Setup.
            const lFunction = () => { return; };
            const lObjectOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
            const lObjectTwo = { string: '1', number: 1, object: { a: 1 }, array: [2], function: lFunction };
            const lCompareHandler: CompareHandler<any> = new CompareHandler(lObjectOne);

            // Process.
            const lIsEqual: boolean = lCompareHandler.compare(lObjectTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Objects are not equal on function', () => {
            // Setup.
            const lObjectOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: () => { return; } };
            const lObjectTwo = { string: '1', number: 1, object: { a: 1 }, array: [1], function: () => { return; } };
            const lCompareHandler: CompareHandler<any> = new CompareHandler(lObjectOne);

            // Process.
            const lIsEqual: boolean = lCompareHandler.compare(lObjectTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Objects are not equal on different type', () => {
            // Setup.
            const lFunction = () => { return; };
            const lObjectOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
            const lObjectTwo = { string: 1, number: 1, object: { a: 1 }, array: [2], function: lFunction };
            const lCompareHandler: CompareHandler<any> = new CompareHandler(lObjectOne);

            // Process.
            const lIsEqual: boolean = lCompareHandler.compare(lObjectTwo);

            // Evaluation.
            expect(lIsEqual).to.be.false;
        });

        it('-- Compare null and undefined values', () => {
            // Setup.
            const lCompareHandler: CompareHandler<any> = new CompareHandler(null);

            // Process.
            const lIsNotEqual: boolean = lCompareHandler.compare(undefined);

            // Evaluation.
            expect(lIsNotEqual).to.be.false;
        });

        it('-- Ignore HTMLElements', () => {
            // Setup.
            // Create HTMLElements.
            const lDivOne = document.createElement('div');
            const lDiveTwo = document.createElement('div');

            // Wrap HTMLElements 
            const lInnerHtmlElementOne = { html: lDivOne };
            const lInnerHtmlElementTwo = { html: lDivOne };
            const lInnerHtmlElementThree = { html: lDiveTwo };

            // Create Handler.
            const lSameReferenceHandler: CompareHandler<any> = new CompareHandler(lInnerHtmlElementOne);
            const lDifferentReferenceHandler: CompareHandler<any> = new CompareHandler(lInnerHtmlElementThree);

            // Process.
            const lSameReference: boolean = lSameReferenceHandler.compare(lInnerHtmlElementTwo);
            const lDifferentReference: boolean = lDifferentReferenceHandler.compare(lInnerHtmlElementTwo);

            // Evaluation.
            expect(lSameReference, 'Has same reference').to.be.true;
            expect(lDifferentReference, 'Has different reference').to.be.false;
        });

        describe('-- Inner recursive objects', () => {
            it('-- Compare same object', () => {
                // Setup.
                // Create recursive object.
                const lRecursiveObject: { a: object; } = { a: {} };
                lRecursiveObject.a = lRecursiveObject;

                // Create handler.
                const lHandler: CompareHandler<any> = new CompareHandler(lRecursiveObject);

                // Process.
                const lEqual: boolean = lHandler.compare(lRecursiveObject);

                // Evaluation.
                expect(lEqual).to.true;
            }).timeout(1000);

            it('-- Compare same array', () => {
                // Setup.
                // Create recursive object.
                const lRecursiveArray: Array<any> = [];
                lRecursiveArray.push(lRecursiveArray);

                // Create handler.
                const lHandler: CompareHandler<any> = new CompareHandler(lRecursiveArray);

                // Process.
                const lEqual: boolean = lHandler.compare(lRecursiveArray);

                // Evaluation.
                expect(lEqual).to.true;
            }).timeout(1000);
        });

        it('-- Compare array with different length', () => {
            // Setup.
            const lHandler: CompareHandler<Array<number>> = new CompareHandler([1]);

            // Process.
            const lNotEqual: boolean = lHandler.compare([1, 2]);

            // Evaluation.
            expect(lNotEqual).to.be.false;
        });

        it('-- Compare array with different key count', () => {
            // Setup.
            const lHandler: CompareHandler<object> = new CompareHandler({ a: 1 });

            // Process.
            const lNotEqual: boolean = lHandler.compare({ a: 1, b: 1 });

            // Evaluation.
            expect(lNotEqual).to.be.false;
        });

        it('-- Compare array with different type', () => {
            // Setup.
            const lHandler: CompareHandler<object> = new CompareHandler({ a: 1 });

            // Process.
            const lNotEqual: boolean = lHandler.compare([1]);

            // Evaluation.
            expect(lNotEqual).to.be.false;
        });

        it('-- Compare object with array type', () => {
            // Setup.
            const lHandler: CompareHandler<object> = new CompareHandler([1]);

            // Process.
            const lNotEqual: boolean = lHandler.compare({ a: 1 });

            // Evaluation.
            expect(lNotEqual).to.be.false;
        });

        describe('-- Compare depth restriction', () => {
            it('-- On objects', () => {
                // Setup.
                const lObjectOne = { depthOne: { depthTwo: { depthThree: { wrongValue: 1 } } } };
                const lObjectTwo = { depthOne: { depthTwo: { depthThree: { wrongValue: 2 } } } };
                const lHandlerRestricted: CompareHandler<object> = new CompareHandler(lObjectOne, 3);
                const lHandlerUnrestricted: CompareHandler<object> = new CompareHandler(lObjectOne, 4);

                // Process.
                const lEqualWithRestriction: boolean = lHandlerRestricted.compare(lObjectTwo);
                const lEqualWithoutRestriction: boolean = lHandlerUnrestricted.compare(lObjectTwo);

                // Evaluation.
                expect(lEqualWithRestriction).to.be.true;
                expect(lEqualWithoutRestriction).to.be.false;
            });

            it('-- On array', () => {
                // Setup.
                const lArrayOne = [[[[1]]]];
                const lArrayTwo = [[[[2]]]];
                const lHandlerRestricted: CompareHandler<object> = new CompareHandler(lArrayOne, 3);
                const lHandlerUnrestricted: CompareHandler<object> = new CompareHandler(lArrayOne, 4);

                // Process.
                const lEqualWithRestriction: boolean = lHandlerRestricted.compare(lArrayTwo);
                const lEqualWithoutRestriction: boolean = lHandlerUnrestricted.compare(lArrayTwo);

                // Evaluation.
                expect(lEqualWithRestriction).to.be.true;
                expect(lEqualWithoutRestriction).to.be.false;
            });
        });

        it('-- Compare null values', () => {
            // Setup.
            const lNullValueHandler: CompareHandler<any> = new CompareHandler(null);
            const lObjectValueHandler: CompareHandler<any> = new CompareHandler({});

            // Process.
            const lNullToNumber: boolean = lNullValueHandler.compare({});
            const lNumberToNull: boolean = lObjectValueHandler.compare(null);

            // Evaluation.
            expect(lNullToNumber).to.be.false;
            expect(lNumberToNull).to.be.false;
        });
    });

    it('Method: CompareAndUpdate', () => {
        // Setup.
        const lFunction = () => { return; };
        const lValueOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
        const lValueTwo = 'Everything different';
        const lCompareHandler: CompareHandler<any> = new CompareHandler(lValueOne);

        // Process.
        lCompareHandler.compareAndUpdate(lValueTwo);
        const lValueIsUpdated: boolean = lCompareHandler.compareAndUpdate(lValueTwo);

        // Evaluation.
        expect(lValueIsUpdated).to.be.true;
    });

    it('Method: update', () => {
        // Setup.
        const lFunction = () => { return; };
        const lValueOne = { string: '1', number: 1, object: { a: 1 }, array: [1], function: lFunction };
        const lValueTwo = 'Everything different';
        const lCompareHandler: CompareHandler<any> = new CompareHandler(lValueOne);

        // Process.
        lCompareHandler.update(lValueTwo);
        const lValueIsUpdated: boolean = lCompareHandler.compareAndUpdate(lValueTwo);

        // Evaluation.
        expect(lValueIsUpdated).to.be.true;
    });
});