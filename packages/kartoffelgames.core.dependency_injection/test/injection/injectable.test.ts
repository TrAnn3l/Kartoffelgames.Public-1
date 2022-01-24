import { expect } from 'chai';
import { Injectable } from '../../source/injection/injectable';
import { InjectionRegister } from '../../source/injection/injection-register';


describe('Injectable', () => {
    it('Decorator: Injectable', () => {
        // Process.
        @Injectable
        class TestA { }

        // Process. Create object.
        const lCreatedObjectOne: TestA = InjectionRegister.createObject(TestA);
        const lCreatedObjectTwo: TestA = InjectionRegister.createObject(TestA);

        // Evaluation.
        expect(lCreatedObjectOne).to.be.instanceOf(TestA);
        expect(lCreatedObjectOne).to.not.equal(lCreatedObjectTwo);
    });
});