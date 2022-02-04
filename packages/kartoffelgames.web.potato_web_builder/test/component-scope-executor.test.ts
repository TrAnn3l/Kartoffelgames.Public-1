import { assert } from 'chai';
import { LayerValues } from '../source/component/values/layer-values';
import { ComponentScopeExecutor } from '../source/module/execution/component-scope-executor';

describe('ComponentScopeExecutor', () => {
    it('Basic execution', () => {
        const lValues: LayerValues = new LayerValues(<any>{
            abc: 1,
            abcd: {
                abcde: {
                    abcdef: '1234'
                }
            }
        });

        const lInputElement: HTMLInputElement = document.createElement('input');
        lInputElement.value = 'Yes';

        lValues.setLayerValue('INPUT', <any>lInputElement);

        assert.equal(ComponentScopeExecutor.execute('1 + 1', lValues), 2);
        assert.equal(ComponentScopeExecutor.execute('3 * 3', lValues), 9);
        assert.equal(ComponentScopeExecutor.execute('this.abc + 1', lValues), 2);
        assert.equal(ComponentScopeExecutor.execute('this.abcd.abcde.abcdef + 5', lValues), '12345');
        assert.equal(ComponentScopeExecutor.execute('this.abcd.abcde.abcdef + INPUT.value', lValues), '1234Yes');
    });

    it('Boolean read', () => {
        const lValues: LayerValues = new LayerValues(<any>{
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
        const lValues: LayerValues = new LayerValues(<any>{});
        const lResult = ComponentScopeExecutor.execute('window', lValues);

        assert.equal(lResult, window);
    });

    it('Inner Array', () => {
        const lValues: LayerValues = new LayerValues(<any>{});
        const lResult = ComponentScopeExecutor.execute('[1, 2, "go"]', lValues);

        assert.deepEqual(lResult, [1, 2, 'go']);
    });

    it('Assignment operator', () => {
        const lObject = { a: 2 };
        const lValues: LayerValues = new LayerValues(<any>lObject);

        ComponentScopeExecutor.execute('this.a = 33;', lValues);

        assert.deepEqual(lObject.a, 33);
    });

    it('Referenced value', () => {
        const lValues: LayerValues = new LayerValues(<any>{});
        lValues.setLayerValue('myValue', 124);
        const lResult = ComponentScopeExecutor.execute('[1, 2, myValue]', lValues);

        assert.deepEqual(lResult, [1, 2, 124]);
    });

    it('Reference Twice', () => {
        const lValues: LayerValues = new LayerValues(<any>{});
        lValues.setLayerValue('myValue', 124);
        const lResult = ComponentScopeExecutor.execute('myValue + myValue', lValues);
        assert.deepEqual(lResult, 248);
    });

    it('Fails', () => {
        const lValues: LayerValues = new LayerValues(<any>{
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