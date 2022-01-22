"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const base_tree_1 = require("./base-tree");
/**
 * Tree with generic path.
 */
class Tree extends base_tree_1.BaseTree {
    /**
     * Create new emtpy branch.
     */
    createNewBranch(_pBranchKey) {
        return new Tree();
    }
}
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map