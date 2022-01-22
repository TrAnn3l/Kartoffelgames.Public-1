// Toggle between local and git dependencies for all packages located in this repository.
// Get remote from git information and branch from current activated branch.

// Check everything is local. :: Boolan
// Check everything is remote. :: Boolean
// Toggle everything to local.
// Toggle everything to remote.

// Load dependencies.
const gPath = require('path');
const gFilereader = require('fs');
const gChildProcess = require('child_process');

// Global paths.
const gPackageFolderPath = gPath.resolve(__dirname, '../../packages');

/**
 * Get all file paths of given file name.
 * @param pStartDestination - Starting destination of search.
 * @param pFileName - File name that should be searched.
 * @param pSearchDepth - How deep should be searched.
 */
const gGetAllFilesOfName = (pStartDestination, pFileName, pSearchDepth) => {
    const lAbsoulteStartDestination = gPath.resolve(pStartDestination);

    // Check start directory existence.
    if (!gFilereader.existsSync(lAbsoulteStartDestination)) {
        throw `"${lAbsoulteStartDestination}" does not exists.`;
    }

    // Check if start directory is a directory.
    let lDirectoryStatus = gFilereader.statSync(lAbsoulteStartDestination);
    if (!lDirectoryStatus.isDirectory()) {
        throw `"${lAbsoulteStartDestination}" is not a directory.`;
    }

    const lResultPathList = new Array();

    // Check every file.
    // Copy each item into new directory.
    for (const lChildItemName of gFilereader.readdirSync(pStartDestination)) {
        const lItemPath = gPath.join(lAbsoulteStartDestination, lChildItemName);
        const lItemStatus = gFilereader.statSync(lItemPath);

        // Check if file or directory. Only search for files in found directory if depth is available.
        // Add item path to results if file name matches seached file name.
        if (lItemStatus.isDirectory() && (pSearchDepth - 1) > -1) {
            // Search for files in  directory.
            lResultPathList.push(...gGetAllFilesOfName(lItemPath, pFileName, pSearchDepth - 1));
        } else if (lChildItemName.toLowerCase() === pFileName.toLowerCase()) {
            lResultPathList.push(lItemPath);
        }
    }

    return lResultPathList;
};

/**
 * Change all local dependencies to callbacks return value.
 * @param pCallback - Callback(ThisPackageInformation, ReplacementpackageInformation) => string.
 */
const gChangeLocalDependenciesTo = (pCallback) => {
    // Get all package.json files.
    const lPackageFileList = gGetAllFilesOfName(gPackageFolderPath, 'package.json', 1);

    // Map each package.json with its path.
    const lPackageInformations = {}; // PackageName : {path, json, changed}
    for (const lPackageFilePath of lPackageFileList) {
        const lFileText = gFilereader.readFileSync(lPackageFilePath, { encoding: 'utf8' });
        const lPackageJson = JSON.parse(lFileText);

        // Map package information.
        lPackageInformations[lPackageJson['name']] = {
            path: gPath.dirname(lPackageFilePath),
            json: lPackageJson,
            changed: false
        };
    }

    // Replace local dependencies.
    for (const lLocalPathName in lPackageInformations) {
        const lPackageInformation = lPackageInformations[lLocalPathName];
        const lPackageJson = lPackageInformation['json'];

        // Devlopment and productive dependencies.
        const lDependencyTypeList = ['devDependencies', 'dependencies'];
        for (const lDependencyType of lDependencyTypeList) {
            // Replace dependencies.
            if (lDependencyType in lPackageJson) {
                for (const lDependencyName in lPackageJson[lDependencyType]) {
                    // On local package exists.
                    if (lDependencyName in lPackageInformations) {
                        const lOldDependency = lPackageJson[lDependencyType][lDependencyName];
                        const lNewDependency = pCallback(lPackageInformation, lPackageInformations[lDependencyName]);

                        if (lNewDependency !== null && lNewDependency !== lOldDependency) {
                            lPackageJson[lDependencyType][lDependencyName] = lNewDependency;
                            lPackageInformation['changed'] = true;
                        }
                    }
                }
            }
        }
    }

    // Replace json files with altered jsons.
    for (const lLocalPathName in lPackageInformations) {
        const lPackageInformation = lPackageInformations[lLocalPathName];
        if (lPackageInformation['changed']) {
            const lPackageJsonText = JSON.stringify(lPackageInformation['json'], null, 4);
            const lPackageFilePath = gPath.resolve(lPackageInformation['path'], 'package.json');;

            // Write altered data to package.json.
            gFilereader.writeFileSync(lPackageFilePath, lPackageJsonText, { encoding: 'utf8' });
        }
    }
};

/**
 * Toggle all local available dependencies to remote files.
 */
const gUpdateDependencyVersions = () => {
    gChangeLocalDependenciesTo((_pThispackageInformation, pReplacementPackageInformation) => {
        return `^${pReplacementPackageInformation['json']['version']}`;
    });
};

// Export.
module.exports.updateDependencyVersions = gUpdateDependencyVersions;