// Load dependencies.
const gPath = require('path');
const gFilereader = require('fs');

/**
 * Clear build directory.
 */
const gCleanBuild = () => {
    const lLibraryPath = gPath.resolve("./library");
    const lLibraryExists = gFilereader.existsSync(lLibraryPath);
    const lLibraryStatus = lLibraryExists && gFilereader.statSync(lLibraryPath);
    const lLibraryIsDirectory = lLibraryExists && lLibraryStatus.isDirectory();

    // Start delete.
    if (lLibraryIsDirectory) {

        // Copy each item into new directory.
        for (const lChildItemName of gFilereader.readdirSync(lLibraryPath)) {
            const lRemovePath = gPath.join(lLibraryPath, lChildItemName);
            const lRemoveFileStatus = gFilereader.statSync(lRemovePath);

            // Remove file or directory.
            if (lRemoveFileStatus.isDirectory()) {
                // Delete everything except the build directory.
                if (lChildItemName.toLowerCase() !== 'build') {
                    gFilereader.rmdirSync(lRemovePath, { recursive: true, force: true });
                }
            } else {
                gFilereader.rmSync(lRemovePath);
            }
        }
    }
};

module.exports.cleanBuild = gCleanBuild;