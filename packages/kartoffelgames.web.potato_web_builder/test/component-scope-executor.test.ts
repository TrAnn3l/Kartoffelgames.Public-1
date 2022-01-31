import { assert } from 'chai';
import { ComponentValues } from '../source/component/component-values';
import { ComponentScopeExecutor } from '../source/module/execution/component-scope-executor';

describe('ComponentScopeExecutor', () => {
    it('Basic execution', () => {
        const lValues: ComponentValues = new ComponentValues(<any>{
            abc: 1,
            abcd: {
                abcde: {
                    abcdef: '1234'
                }
            }
        });

        const lInputElement: HTMLInputElement = document.createElement('input');
        lInputElement.value = 'Yes';

        lValues.setTemporaryValue('INPUT', <any>lInputElement);

        assert.equal(ComponentScopeExecutor.execute('1 + 1', lValues), 2);
        assert.equal(ComponentScopeExecutor.execute('3 * 3', lValues), 9);
        assert.equal(ComponentScopeExecutor.execute('this.abc + 1', lValues), 2);
        assert.equal(ComponentScopeExecutor.execute('this.abcd.abcde.abcdef + 5', lValues), '12345');
        assert.equal(ComponentScopeExecutor.execute('this.abcd.abcde.abcdef + INPUT.value', lValues), '1234Yes');
    });

    it('Boolean read', () => {
        const lValues: ComponentValues = new ComponentValues(<any>{
            abc: 1,
            abcd: {
                abcde: {
                    abcdef: '1234'
                }
            }
        });

        const lResult = ComponentScopeExecutor.execute('true !== false', lValues);
        assert.equal(lResult, true);
    });

    it('Window access', () => {
        const lValues: ComponentValues = new ComponentValues(<any>{});
        const lResult = ComponentScopeExecutor.execute('window', lValues);

        assert.equal(lResult, window);
    });

    it('Inner Array', () => {
        const lValues: ComponentValues = new ComponentValues(<any>{});
        const lResult = ComponentScopeExecutor.execute('[1, 2, "go"]', lValues);

        assert.deepEqual(lResult, [1, 2, 'go']);
    });

    it('Assignment operator', () => {
        const lObject = { a: 2 };
        const lValues: ComponentValues = new ComponentValues(<any>lObject);

        ComponentScopeExecutor.execute('this.a = 33;', lValues);

        assert.deepEqual(lObject.a, 33);
    });

    it('Referenced value', () => {
        const lValues: ComponentValues = new ComponentValues(<any>{});
        lValues.setTemporaryValue('myValue', 124);
        const lResult = ComponentScopeExecutor.execute('[1, 2, myValue]', lValues);

        assert.deepEqual(lResult, [1, 2, 124]);
    });

    it('Reference Twice', () => {
        const lValues: ComponentValues = new ComponentValues(<any>{});
        lValues.setTemporaryValue('myValue', 124);
        const lResult = ComponentScopeExecutor.execute('myValue + myValue', lValues);
        assert.deepEqual(lResult, 248);
    });

    it('Fails', () => {
        const lValues: ComponentValues = new ComponentValues(<any>{
            abc: 1,
            abcd: {
                abcde: {
                    abcdef: '1234'
                }
            }
        });

        assert.throws(() => {
            ComponentScopeExecutor.execute('NotThere.shouldFail', lValues);
        });

        assert.throws(() => {
            // no this accessor and abc is a const. 
            ComponentScopeExecutor.execute('abc = 1', lValues);
        });
    });
});