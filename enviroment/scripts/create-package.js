// Load dependencies.
const gPath = require('path');
const gFilereader = require('fs');
const gReadline = require("readline");

/**
 * Copy directory with all files into destination
 * and replace text in files.
 * @param pSource - The path to the thing to copy.
 * @param pDestination - The path to the new copy.
 */
const gCopyDirectory = (pSource, pDestination, pOverride, pReplacementMap) => {
    const lSourceItem = gPath.resolve(pSource);
    const lDestinationItem = gPath.resolve(pDestination);

    let lSourceExists = gFilereader.existsSync(lSourceItem);
    let lDestinationExists = gFilereader.existsSync(lDestinationItem);
    let lFileStatus = lSourceExists && gFilereader.statSync(lSourceItem);
    let lSourceIsDirectory = lSourceExists && lFileStatus.isDirectory();

    if (lSourceIsDirectory) {
        // Create destination directory.
        if (!lDestinationExists) {
            gFilereader.mkdirSync(lDestinationItem);
        }

        // Copy each item into new directory.
        for (const lChildItemName of gFilereader.readdirSync(lSourceItem)) {
            gCopyDirectory(gPath.join(lSourceItem, lChildItemName), gPath.join(lDestinationItem, lChildItemName), pOverride, pReplacementMap);
        }
    } else if (!lDestinationExists || pOverride) {
        gFilereader.copyFileSync(lSourceItem, lDestinationItem);

        // Read file text.
        const lFileText = gFilereader.readFileSync(lDestinationItem, { encoding: 'utf8' });

        // Replace each replacement pattern.
        let lAlteredFileText = lFileText;
        for (const lReplacement in pReplacementMap) {
            const lReplacementRegex = pReplacementMap[lReplacement];
            lAlteredFileText = lAlteredFileText.replace(lReplacementRegex, lReplacement);
        }

        // Update file with altered file text.
        gFilereader.writeFileSync(lDestinationItem, lAlteredFileText, { encoding: 'utf8' });
    }
};

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
 * Open promt and validate answer.
 * @param pQuestion = Input question. 
 * @param pValidationRegex - Validation for input.
 */
const gPromt = async(pQuestion, pValidationRegex) => {
    // Initialize readline.
    const lReadLine = gReadline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Async.
    const lAnswer = await new Promise((pResolve) => {
        let lInput = '';

        lReadLine.question(pQuestion, (pAnswer) => {
            lInput = pAnswer;
            lReadLine.close();
        });

        // Resolve promise on input close.
        lReadLine.on("close", () => {
            pResolve(lInput);
        });
    });

    // Validate answer.
    if (pValidationRegex && !pValidationRegex.test(lAnswer)) {
        // Output error message and retry promt.
        console.log(`Answer musst match ${pValidationRegex.toString()}`);
        return await gPromt(pQuestion, pValidationRegex);
    } else {
        return lAnswer;
    }
};


module.exports.createPackage = async() => {
    console.log('//// Create Project ////');

    // Needed questions.
    const lProjectName = await gPromt('Project Name: ', /^[a-zA-Z\_\.]+$/);
    const lPackageName = await gPromt('Package Name: ', /^(@[a-z]+\/)?[a-z\.\-]+$/);
    const lProjectFolder = lProjectName.toLowerCase();

    try {
        // Create paths.
        const lPackagePath = gPath.resolve(__dirname, '../../packages', lProjectFolder);
        const lBlueprintPath = gPath.resolve(__dirname, '../project_blueprint');
        const lPackageFolderPath = gPath.resolve(__dirname, '../../packages');

        // Get all package.json files.
        const lPackageFileList = gGetAllFilesOfName(lPackageFolderPath, 'package.json', 1);

        // Read files and convert json.
        for (const lPackageFile of lPackageFileList) {
            const lFileText = gFilereader.readFileSync(lPackageFile, { encoding: 'utf8' });
            const lFileJson = JSON.parse(lFileText);

            // Check dublicate project name and package name.
            if (lFileJson['name'].toLowerCase() === lPackageName.toLowerCase()) {
                console.error('Package name already exists.');
                return;
            } else if (lFileJson['projectName'] && lFileJson['projectName'].toLowerCase() === lProjectName.toLowerCase()) {
                console.error('Project name already exists.');
                return;
            }
        }

        console.log('');
        console.log('Create project');

        // Check if project directory already exists.
        if (gFilereader.existsSync(lPackagePath)) {
            console.error('Project directory already exists.');
            return;
        } else {
            // Create package folder.
            gFilereader.mkdirSync(lPackagePath);
        }

        // Copy all files from blueprint folder.
        gCopyDirectory(lBlueprintPath, lPackagePath, false, {
            [lProjectName]: /{{PROJECT_NAME}}/g,
            [lPackageName]: /{{PACKAGE_NAME}}/g,
            [lProjectFolder]: /{{PROJECT_FOLDER}}/g,
        });

        console.log('Project successfull created.', `Call "npm install -w ${lPackageName}" to initialize this project`);

    } catch (e) {
        console.error(e);
    }
};;