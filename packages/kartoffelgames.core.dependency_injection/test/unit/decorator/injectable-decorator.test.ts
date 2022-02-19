import { expect } from 'chai';
import { InjectableDecorator } from '../../../source/decorator/injectable-decorator';
import { Injection } from '../../../source/injection/injection';


describe('InjectableDecorator', () => {
    it('Decorator: Injectable', () => {
        // Process.
        @InjectableDecorator
        class TestA { }

        // Process. Create object.
        const lCreatedObjectOne: TestA = Injection.createObject(TestA);
        const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

        // Evaluation.
        expect(lCreatedObjectOne).to.be.instanceOf(TestA);
        expect(lCreatedObjectOne).to.not.equal(lCreatedObjectTwo);
    });
});