"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTree = void 0;
const dictionary_1 = require("../dictionary/dictionary");
const list_1 = require("../list/list");
/**
 * BaseTree with generic path.
 */
class BaseTree {
    /**
     * Constructor.
     * Basic initialization.
     */
    constructor() {
        this.mBranches = new dictionary_1.Dictionary();
    }
    /**
     * Get all child branches of branch.
     */
    get branchList() {
        return list_1.List.newListWith(...this.mBranches.values());
    }
    /**
     * Get parent branch.
     */
    get parent() {
        return this.mParent ?? null;
    }
    /**
     * Adds new branch to tree.
     * Does nothing if branch already exists.
     * Returns last added branch.
     * @param pBranchPath -  Branch to add.
     */
    addBranch(...pBranchPath) {
        // If new branch can be added.
        if (pBranchPath.length !== 0) {
            const lCurrentBranchKey = pBranchPath.splice(0, 1)[0];
            // Create new branch if not created.
            if (!this.mBranches.has(lCurrentBranchKey)) {
                // Set this as new branch parent.
                const lNewBranch = this.createNewBranch(lCurrentBranchKey);
                lNewBranch.mParent = this;
                this.mBranches.add(lCurrentBranchKey, lNewBranch);
            }
            // Add next branch path.
            return this.mBranches.get(lCurrentBranchKey).addBranch(...pBranchPath);
        }
        return this;
    }
    /**
     * Get all paths of tree.
     * @param pPath - Additional paths.
     */
    getAllPaths() {
        return this.extendPath(new list_1.List());
    }
    /**
     * Get Tree by branch path. Return undefined if no branch was found.
     * @param pBranchPath - Branch path.
     */
    getBranch(...pBranchPath) {
        // If no path was specified. Return this tree.
        if (pBranchPath.length === 0) {
            return this;
        }
        // Check if this tree has branch
        if (this.mBranches.has(pBranchPath[0])) {
            // remove first item in branch and safe.
            const lCurrentLocation = pBranchPath.splice(0, 1)[0];
            // Seach branch in next tree with modified path.
            return this.mBranches.get(lCurrentLocation).getBranch(...pBranchPath);
        }
        // No branch found.
        return undefined;
    }
    /**
     * Check if path exists.
     * Path specifed path doesn't need to have values.
     * @param pBranchPath - Path to branch.
     */
    hasPath(...pBranchPath) {
        return !!this.getBranch(...pBranchPath);
    }
    /**
     * Removes branch by path.
     * Returns undefined if branch does not exist.
     * @param pBranchPath - Path to branch.
     */
    removeBranch(...pBranchPath) {
        const lFoundBranch = this.getBranch(...pBranchPath);
        // Check if parameter or branch exists.
        if (pBranchPath.length === 0 || !lFoundBranch) {
            return undefined;
        }
        else if (pBranchPath.length === 1) {
            // Remove branch if path has only one level.
            // Does not throw if no element was found.
            const lRemovedBranch = this.mBranches.get(pBranchPath[0]);
            this.mBranches.delete(pBranchPath[0]);
            // Remove parent and return.
            lRemovedBranch.mParent = undefined;
            return lRemovedBranch;
        }
        // Get Parent and remove branch last path element.
        return lFoundBranch.parent.removeBranch(pBranchPath.pop());
    }
    /**
     * Extends specified path with all possible paths of current tree branches.
     * @param pStartingPath - Staring path.
     */
    extendPath(pStartingPath) {
        const lExtendedPaths = new Array();
        // Get extended path of all branches.
        for (const lBranchKey of this.mBranches.keys()) {
            const lBranchPath = list_1.List.newListWith(...pStartingPath, lBranchKey);
            // Add path to current branch.
            lExtendedPaths.push(lBranchPath);
            // Get all paths of branch.
            const lBranch = this.mBranches.get(lBranchKey);
            lExtendedPaths.push(...lBranch.extendPath(lBranchPath));
        }
        return lExtendedPaths;
    }
}
exports.BaseTree = BaseTree;
//# sourceMappingURL=base-tree.js.map