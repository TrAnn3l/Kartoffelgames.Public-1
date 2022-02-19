import { expect } from 'chai';
import { EnumUtil } from '../../../source/util/enum-util';

describe('EnumUtil', () => {
    it('Static Method: enumNamesToArray', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 3,
            Five = 5,
        }

        // Process.
        const lNameArray: Array<string> = EnumUtil.enumNamesToArray(TestEnum);

        // Evaluation.
        expect(lNameArray).to.be.deep.equal(['One', 'Two', 'Three', 'Five']);
    });

    it('Static Method: enumValuesToArray', () => {
        // Setup.
        enum TestEnum {
            One = 1,
            Two = 2,
            Three = 3,
            Five = 5,
        }

        // Process.
        const lValueArray: Array<string> = EnumUtil.enumValuesToArray(TestEnum);

        // Evaluation.
        expect(lValueArray).to.be.deep.equal([1, 2, 3, 5]);
    });
});