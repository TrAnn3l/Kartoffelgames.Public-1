import { BaseTree } from './base-tree';
/**
 * Tree with generic path.
 */
export declare class Tree<T> extends BaseTree<Tree<T>, T> {
    /**
     * Create new emtpy branch.
     */
    protected createNewBranch(_pBranchKey: T): Tree<T>;
}
//# sourceMappingURL=tree.d.ts.map