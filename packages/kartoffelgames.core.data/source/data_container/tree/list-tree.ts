import { BaseTree } from './base-tree';
import { List } from '../list/list';

/**
 * Tree with additional item list.
 */
export class ListTree<TKey, TValue> extends BaseTree<ListTree<TKey, TValue>, TKey>{
    private readonly mItemList: List<TValue>;

    /**
     * Get all items of this branch and all of its childs.
     */
    public get deepItemList(): Array<TValue> {
        return this.getDeepItemList();
    }

    /**
     * Get item of this branch
     */
    public get itemList(): Array<TValue> {
        return this.mItemList.clone();
    }

    /**
     * Initialise list.
     */
    public constructor() {
        super();
        this.mItemList = new List<TValue>();
    }

    /**
     * Add items to branch.
     * @param pItemList - Item list.
     */
    public addItem(...pItemList: Array<TValue>): this {
        this.mItemList.push(...pItemList);
        return this;
    }

    /**
     * Creates new branch.
     * @param pBranchKey - Branch key for new branch.
     */
    protected createNewBranch(_pBranchKey: TKey): ListTree<TKey, TValue> {
        return new ListTree<TKey, TValue>();
    }

    /**
     * Get all listed items on branch and its childs.
     */
    private getDeepItemList(): Array<TValue> {
        const lFoundItems: List<TValue> = List.newListWith(...this.mItemList);

        // Find all items recurive.
        for (const lBranch of this.branchList) {
            lFoundItems.push(...(<ListTree<TKey, TValue>>lBranch).getDeepItemList());
        }

        return lFoundItems;
    }
}