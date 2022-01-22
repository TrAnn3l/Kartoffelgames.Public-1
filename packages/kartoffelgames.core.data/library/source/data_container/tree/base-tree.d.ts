/**
 * BaseTree with generic path.
 */
export declare abstract class BaseTree<TBranch extends BaseTree<TBranch, TBranchValue>, TBranchValue> {
    private readonly mBranches;
    private mParent;
    /**
     * Get all child branches of branch.
     */
    get branchList(): Array<TBranch>;
    /**
     * Get parent branch.
     */
    get parent(): TBranch;
    /**
     * Constructor.
     * Basic initialization.
     */
    constructor();
    /**
     * Adds new branch to tree.
     * Does nothing if branch already exists.
     * Returns last added branch.
     * @param pBranchPath -  Branch to add.
     */
    addBranch(...pBranchPath: Array<TBranchValue>): TBranch;
    /**
     * Get all paths of tree.
     * @param pPath - Additional paths.
     */
    getAllPaths(): Array<Array<TBranchValue>>;
    /**
     * Get Tree by branch path. Return undefined if no branch was found.
     * @param pBranchPath - Branch path.
     */
    getBranch(...pBranchPath: Array<TBranchValue>): TBranch;
    /**
     * Check if path exists.
     * Path specifed path doesn't need to have values.
     * @param pBranchPath - Path to branch.
     */
    hasPath(...pBranchPath: Array<TBranchValue>): boolean;
    /**
     * Removes branch by path.
     * Returns undefined if branch does not exist.
     * @param pBranchPath - Path to branch.
     */
    removeBranch(...pBranchPath: Array<TBranchValue>): TBranch | undefined;
    /**
     * Extends specified path with all possible paths of current tree branches.
     * @param pStartingPath - Staring path.
     */
    private extendPath;
    /**
     * Create new branch element.
     */
    protected abstract createNewBranch(pBranchKey: TBranchValue): TBranch;
}
//# sourceMappingURL=base-tree.d.ts.map