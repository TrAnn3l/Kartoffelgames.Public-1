import { expect } from 'chai';
import { TypeUtil } from '../../source/util/type-util';

describe('TypeUtil', () => {
    it('Static Method: nameOf', () => {
        // Setup.
        class TestClass {
            public testMethod(): void {/** Empty */ }
        }

        // Process.
        const lMethodName: string = TypeUtil.nameOf<TestClass>('testMethod');

        // Evaluation.
        expect(lMethodName).to.be.equal('testMethod');
    });
});