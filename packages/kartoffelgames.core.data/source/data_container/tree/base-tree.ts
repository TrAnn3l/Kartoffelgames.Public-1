import { Dictionary } from '../dictionary/dictionary';
import { List } from '../list/list';

/**
 * BaseTree with generic path.
 */
export abstract class BaseTree<TBranch extends BaseTree<TBranch, TBranchValue>, TBranchValue> {
    private readonly mBranches: Dictionary<TBranchValue, TBranch>;
    // eslint-disable-next-line @typescript-eslint/prefer-readonly
    private mParent: TBranch | null;

    /**
     * Get all child branches of branch.
     */
    public get branchList(): Array<TBranch> {
        return List.newListWith(...this.mBranches.values());
    }

    /**
     * Get parent branch.
     */
    public get parent(): TBranch | null {
        return this.mParent;
    }

    /**
     * Constructor.
     * Basic initialization.
     */
    public constructor() {
        this.mBranches = new Dictionary<TBranchValue, TBranch>();
        this.mParent = null;
    }

    /**
     * Adds new branch to tree.
     * Does nothing if branch already exists.
     * Returns last added branch.
     * @param pBranchPath -  Branch to add.
     */
    public addBranch(...pBranchPath: Array<TBranchValue>): TBranch {
        // If new branch can be added.
        if (pBranchPath.length !== 0) {
            const lCurrentBranchKey: TBranchValue = pBranchPath.splice(0, 1)[0];

            // Create new branch if not created.
            if (!this.mBranches.has(lCurrentBranchKey)) {
                // Set this as new branch parent.
                const lNewBranch: TBranch = this.createNewBranch(lCurrentBranchKey);
                lNewBranch.mParent = <TBranch><any>this;

                this.mBranches.add(lCurrentBranchKey, lNewBranch);
            }

            // Add next branch path.
            const lCurrentBranch: TBranch = <TBranch>this.mBranches.get(lCurrentBranchKey);
            return lCurrentBranch.addBranch(...pBranchPath);
        }

        return <TBranch><any>this;
    }

    /**
     * Get all paths of tree.
     * @param pPath - Additional paths.
     */
    public getAllPaths(): Array<Array<TBranchValue>> {
        return this.extendPath(new List<TBranchValue>());
    }

    /**
     * Get Tree by branch path. Return undefined if no branch was found.
     * @param pBranchPath - Branch path.
     */
    public getBranch(...pBranchPath: Array<TBranchValue>): TBranch | undefined {
        // If no path was specified. Return this tree.
        if (pBranchPath.length === 0) {
            return <TBranch><any>this;
        }

        // Check if this tree has branch
        if (this.mBranches.has(pBranchPath[0])) {
            // remove first item in branch and safe.
            const lCurrentLocationBranchValue: TBranchValue = pBranchPath.splice(0, 1)[0];
            const lCurrentLocationBranch: TBranch = <TBranch>this.mBranches.get(lCurrentLocationBranchValue);

            // Seach branch in next tree with modified path.
            return lCurrentLocationBranch.getBranch(...pBranchPath);
        }

        // No branch found.
        return undefined;
    }

    /**
     * Check if path exists.
     * Path specifed path doesn't need to have values.
     * @param pBranchPath - Path to branch.
     */
    public hasPath(...pBranchPath: Array<TBranchValue>): boolean {
        return !!this.getBranch(...pBranchPath);
    }

    /**
     * Removes branch by path.
     * Returns undefined if branch does not exist.
     * @param pBranchPath - Path to branch.
     */
    public removeBranch(...pBranchPath: Array<TBranchValue>): TBranch | undefined {
        const lFoundBranch: TBranch | undefined = this.getBranch(...pBranchPath);

        // Check if parameter or branch exists.
        if (pBranchPath.length === 0 || !lFoundBranch) {
            return undefined;
        } else if (pBranchPath.length === 1) {
            const lFirstBranchPathValue: TBranchValue = pBranchPath[0];

            // Remove branch if path has only one level.
            // Does not throw if no element was found.
            const lRemovedBranch: TBranch = <TBranch>this.mBranches.get(lFirstBranchPathValue);
            this.mBranches.delete(lFirstBranchPathValue);

            // Remove parent and return.
            lRemovedBranch.mParent = null;
            return lRemovedBranch;
        }

        // Get parent and remove branch last path element. Parent of child is always set.
        const lParentBranch: TBranch = <TBranch>lFoundBranch.parent;
        return lParentBranch.removeBranch(<TBranchValue>pBranchPath.pop());
    }

    /**
     * Extends specified path with all possible paths of current tree branches.
     * @param pStartingPath - Staring path.
     */
    private extendPath(pStartingPath: List<TBranchValue>): Array<Array<TBranchValue>> {
        const lExtendedPaths: Array<Array<TBranchValue>> = new Array<Array<TBranchValue>>();

        // Get extended path of all branches.
        for (const lBranchKey of this.mBranches.keys()) {
            const lBranchPath: List<TBranchValue> = List.newListWith(...pStartingPath, lBranchKey);

            // Add path to current branch.
            lExtendedPaths.push(lBranchPath);

            // Get all paths of branch.
            const lBranch: TBranch = <TBranch>this.mBranches.get(lBranchKey);
            lExtendedPaths.push(...lBranch.extendPath(lBranchPath));
        }

        return lExtendedPaths;
    }

    /**
     * Create new branch element.
     */
    protected abstract createNewBranch(pBranchKey: TBranchValue): TBranch;
}