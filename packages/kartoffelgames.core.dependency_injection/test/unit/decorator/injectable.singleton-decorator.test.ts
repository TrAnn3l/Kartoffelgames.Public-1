import { expect } from 'chai';
import { InjectableSingleton } from '../../../source/decorator/injectable-singleton.decorator';
import { Injection } from '../../../source/injection/injection';


describe('InjectableSingleton', () => {
    it('Decorator: InjectableSingleton', () => {
        // Process.
        @InjectableSingleton
        class TestA { }

        // Process. Create object.
        const lCreatedObjectOne: TestA = Injection.createObject(TestA);
        const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

        // Evaluation.
        expect(lCreatedObjectOne).to.be.instanceOf(TestA);
        expect(lCreatedObjectOne).to.equal(lCreatedObjectTwo);
    });
});