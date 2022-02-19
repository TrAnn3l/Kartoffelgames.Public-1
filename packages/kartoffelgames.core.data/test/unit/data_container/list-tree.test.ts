import { expect } from 'chai';
import { ListTree } from '../../../source/data_container/tree/list-tree';

describe('ListTree', () => {
    it('Method: addItem', () => {
        // Setup.
        const lTree: ListTree<string, number> = new ListTree<string, number>();
        const lItems: Array<number> = [1, 2, 4, 8];
        const lBranch: ListTree<string, number> = lTree.addBranch('Branch1');

        // Process.
        lBranch.addItem(...lItems);

        // Evaluation.
        expect(lBranch.itemList).to.deep.equal(lItems);
    });

    it('Property: deepItemList', () => {
        // Setup.
        const lTree: ListTree<string, number> = new ListTree<string, number>().addItem(1, 2, 3);
        lTree.addBranch('Branch1').addItem(4, 5, 6);
        const lBranch3: ListTree<string, number> = lTree.addBranch('Branch2').addItem(7, 8, 9);
        lBranch3.addBranch('Branch3.1').addItem(10, 11, 12);

        // Proceess
        const lItemList: Array<number> = lTree.deepItemList;

        // Evaluation.
        expect(lItemList).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
});