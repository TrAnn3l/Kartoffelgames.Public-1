"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTree = void 0;
const base_tree_1 = require("./base-tree");
const list_1 = require("../list/list");
/**
 * Tree with additional item list.
 */
class ListTree extends base_tree_1.BaseTree {
    /**
     * Initialise list.
     */
    constructor() {
        super();
        this.mItemList = new list_1.List();
    }
    /**
     * Get item of this branch
     */
    get itemList() {
        return this.mItemList.clone();
    }
    /**
     * Get all items of this branch and all of its childs.
     */
    get deepItemList() {
        return this.getDeepItemList();
    }
    /**
     * Add items to branch.
     * @param pItemList - Item list.
     */
    addItem(...pItemList) {
        this.mItemList.push(...pItemList);
        return this;
    }
    /**
     * Creates new branch.
     * @param pBranchKey - Branch key for new branch.
     */
    createNewBranch(_pBranchKey) {
        return new ListTree();
    }
    /**
     * Get all listed items on branch and its childs.
     */
    getDeepItemList() {
        const lFoundItems = list_1.List.newListWith(...this.mItemList);
        // Find all items recurive.
        for (const lBranch of this.branchList) {
            lFoundItems.push(...lBranch.getDeepItemList());
        }
        return lFoundItems;
    }
}
exports.ListTree = ListTree;
//# sourceMappingURL=list-tree.js.map