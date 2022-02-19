import { expect } from 'chai';
import { Exception } from '../../../source/exception/exception';

describe('Exception', () => {
    it('Property: target', () => {
        // Setup.
        const lTarget: string = 'Target';
        const lException: Exception<string> = new Exception('Message', lTarget);

        // Process.
        const lExceptionTarget: string = lException.target;

        // Evaluation.
        expect(lException.target).to.be.equal(lExceptionTarget);
    });
});