import { BaseTree } from './base-tree';
/**
 * Tree with additional item list.
 */
export declare class ListTree<TKey, TValue> extends BaseTree<ListTree<TKey, TValue>, TKey> {
    private readonly mItemList;
    /**
     * Get item of this branch
     */
    get itemList(): Array<TValue>;
    /**
     * Get all items of this branch and all of its childs.
     */
    get deepItemList(): Array<TValue>;
    /**
     * Initialise list.
     */
    constructor();
    /**
     * Add items to branch.
     * @param pItemList - Item list.
     */
    addItem(...pItemList: Array<TValue>): this;
    /**
     * Creates new branch.
     * @param pBranchKey - Branch key for new branch.
     */
    protected createNewBranch(_pBranchKey: TKey): ListTree<TKey, TValue>;
    /**
     * Get all listed items on branch and its childs.
     */
    private getDeepItemList;
}
//# sourceMappingURL=list-tree.d.ts.map