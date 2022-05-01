import { expect } from 'chai';
import { Tree } from '../../../source/data_container/tree/tree';

describe('Tree', () => {
    it('Method: addBranch', () => {
        // Setup.
        const lTree: Tree<string> = new Tree<string>();
        const lPath: Array<string> = ['Branch1', 'Branch1.1', 'Branch1.1.1'];

        // Process.
        lTree.addBranch(...lPath);

        // Evaluation.
        expect(lTree.hasPath(...lPath)).to.be.true;
    });

    describe('Property: parent', () => {
        it('-- Read: Has parent', () => {
            // Setup.
            const lTree: Tree<string> = new Tree<string>();
            const lPath: Array<string> = ['Branch1', 'Branch1.1', 'Branch1.1.1'];
            const lBranch: Tree<string> = lTree.addBranch(...lPath);

            // Process.
            const lParentBranch: Tree<string> | null = lBranch.parent;

            // Evaluation.
            expect(lParentBranch?.branchList[0]).to.equals(lBranch);
        });

        it('-- Read: Has no parent', () => {
            // Setup.
            const lTree: Tree<string> = new Tree<string>();

            // Process.
            const lParentBranch: Tree<string> | null = lTree.parent;

            // Evaluation.
            expect(lParentBranch).to.be.null;
        });
    });

    it('Property: branchList', () => {
        // Setup.
        const lTree: Tree<string> = new Tree<string>();
        const lBranch1: Tree<string> = lTree.addBranch('Branch1');
        const lBranch2: Tree<string> = lTree.addBranch('Branch2');

        // Process.
        const lBranchList: Array<Tree<string>> = lTree.branchList;

        // Evaluation.
        expect(lBranchList).to.have.members([lBranch1, lBranch2]);
    });

    it('Method: getAllPaths', () => {
        // Setup.
        const lTree: Tree<string> = new Tree<string>();
        lTree.addBranch('Branch1', 'Branch1.1', 'Branch1.1.1');
        lTree.addBranch('Branch1', 'Branch1.2');
        lTree.addBranch('Branch2', 'Branch2.1');
        lTree.addBranch('Branch3');

        // Process.
        const lAllPathList: Array<Array<string>> = lTree.getAllPaths();

        // Evaluation.
        expect(lAllPathList).to.have.deep.members([
            ['Branch1'],
            ['Branch1', 'Branch1.1'],
            ['Branch1', 'Branch1.1', 'Branch1.1.1'],
            ['Branch1', 'Branch1.2'],
            ['Branch2'],
            ['Branch2', 'Branch2.1'],
            ['Branch3'],
        ]);
    });

    describe('Method: getBranch', () => {
        it('-- Get correct branch', () => {
            // Setup.
            const lBranchPath: Array<string> = ['Branch1', 'Branch1.1', 'Branch1.1.1'];
            const lTree: Tree<string> = new Tree<string>();
            const lBranch: Tree<string> = lTree.addBranch(...lBranchPath);

            // Process.
            const lFoundBranch: Tree<string> | undefined = lTree.getBranch(...lBranchPath);

            // Evaluation.
            expect(lFoundBranch).to.equal(lBranch);
        });

        it('-- Get undefined branch', () => {
            // Setup.
            const lTree: Tree<string> = new Tree<string>();
            lTree.addBranch('Branch1', 'Branch1.1', 'Branch1.1.1');

            // Process.
            const lFoundBranch: Tree<string> | undefined = lTree.getBranch('Branch2');

            // Evaluation.
            expect(lFoundBranch).to.be.undefined;
        });

        it('-- Get same branch', () => {
            // Setup.
            const lTree: Tree<string> = new Tree<string>();

            // Process.
            const lFoundBranch: Tree<string> | undefined = lTree.getBranch();

            // Evaluation.
            expect(lFoundBranch).to.equal(lTree);
        });
    });

    describe('Method: hasBranch', () => {
        it('-- Check for existing path', () => {
            // Setup.
            const lBranchPath: Array<string> = ['Branch1', 'Branch1.1', 'Branch1.1.1'];
            const lTree: Tree<string> = new Tree<string>();
            lTree.addBranch(...lBranchPath);

            // Process.
            const lHasBranch: boolean = lTree.hasPath(...lBranchPath);

            // Evaluation.
            expect(lHasBranch).to.be.true;
        });

        it('-- Check none existing path', () => {
            // Setup.
            const lTree: Tree<string> = new Tree<string>();
            lTree.addBranch('Branch1', 'Branch1.1', 'Branch1.1.1');

            // Process.
            const lHasBranch: boolean = lTree.hasPath('Branch2');

            // Evaluation.
            expect(lHasBranch).to.be.false;
        });
    });

    describe('Method: removeBranch', () => {
        it('-- Remove existing branch', () => {
            // Setup.
            const lTree: Tree<string> = new Tree<string>();
            const lBranch: Tree<string> = lTree.addBranch('Branch1');

            // Process.
            const lRemovedBranch: Tree<string> | undefined = lTree.removeBranch('Branch1');

            // Evaluation.
            expect(lRemovedBranch).to.equal(lBranch);
        });

        it('-- Remove existing deep branch', () => {
            // Setup.
            const lBranchPath: Array<string> = ['Branch1', 'Branch1.1'];
            const lTree: Tree<string> = new Tree<string>();
            const lBranch: Tree<string> = lTree.addBranch(...lBranchPath);

            // Process.
            const lRemovedBranch: Tree<string> | undefined = lTree.removeBranch(...lBranchPath);

            // Evaluation.
            expect(lRemovedBranch).to.equal(lBranch);
        });

        it('-- Remove none existing branch', () => {
            // Setup.
            const lTree: Tree<string> = new Tree<string>();
            lTree.addBranch('Branch1');

            // Process.
            const lRemovedBranch: Tree<string> | undefined = lTree.removeBranch('Branch2');

            // Evaluation.
            expect(lRemovedBranch).to.be.undefined;
        });

        it('-- Remove self', () => {
            // Setup.
            const lTree: Tree<string> = new Tree<string>();
            lTree.addBranch('Branch1');

            // Process.
            const lRemovedBranch: Tree<string> | undefined = lTree.removeBranch();

            // Evaluation.
            expect(lRemovedBranch).to.be.undefined;
        });
    });
});