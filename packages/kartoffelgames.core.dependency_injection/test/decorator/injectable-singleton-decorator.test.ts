import { expect } from 'chai';
import { InjectableSingletonDecorator } from '../../source/decorator/injectable-singleton-decorator';
import { Injection } from '../../source/injection/injection';


describe('InjectableSingletonDecorator', () => {
    it('Decorator: InjectableSingleton', () => {
        // Process.
        @InjectableSingletonDecorator
        class TestA { }

        // Process. Create object.
        const lCreatedObjectOne: TestA = Injection.createObject(TestA);
        const lCreatedObjectTwo: TestA = Injection.createObject(TestA);

        // Evaluation.
        expect(lCreatedObjectOne).to.be.instanceOf(TestA);
        expect(lCreatedObjectOne).to.equal(lCreatedObjectTwo);
    });
});