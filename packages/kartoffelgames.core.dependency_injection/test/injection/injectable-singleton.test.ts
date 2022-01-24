import { expect } from 'chai';
import { InjectableSingleton } from '../../source/injection/injectable-singleton';
import { InjectionRegister } from '../../source/injection/injection-register';


describe('InjectableSingleton', () => {
    it('Decorator: InjectableSingleton', () => {
        // Process.
        @InjectableSingleton
        class TestA { }

        // Process. Create object.
        const lCreatedObjectOne: TestA = InjectionRegister.createObject(TestA);
        const lCreatedObjectTwo: TestA = InjectionRegister.createObject(TestA);

        // Evaluation.
        expect(lCreatedObjectOne).to.be.instanceOf(TestA);
        expect(lCreatedObjectOne).to.equal(lCreatedObjectTwo);
    });
});