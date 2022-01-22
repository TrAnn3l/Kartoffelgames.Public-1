// Load dependencies.
const gPath = require('path');
const gFilereader = require('fs');

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
 * Initialize Scratchpad files.
 * @param pProjectRootDirectory - Project root directory.
 */
const gInitializeScratchpadFiles = (pProjectName) => {
    // Copy scratchpad blueprint into scratchpad directory.
    gCopyDirectory(gPath.resolve(__dirname, '../project_blueprint/scratchpad'), './scratchpad', false, {
        [pProjectName]: /{{PROJECT_NAME}}/g
    });
};

/**
 * Initialize Test files.
 */
const gInitializeTextFiles = () => {
    // Copy scratchpad blueprint into scratchpad directory.
    gCopyDirectory(gPath.resolve(__dirname, '../project_blueprint/Test'), './test', false, {});
};

/**
 * Load default loader from module declaration file.
 */
const gGetDefaultFileLoader = () => {

    // Read module declaration file.
    const lDeclarationFilepath = gPath.resolve(__dirname, '..', '..', 'declaration', 'module-declaration.d.ts');
    const lFileContent = gFilereader.readFileSync(lDeclarationFilepath, 'utf8');

    const lFileExtensionRegex = /declare\s+module\s+(?:"|')\*([.a-zA-Z0-9]+)(?:"|')\s*{.*?\/\*\s*LOADER::([a-zA-Z-]+)\s*\*\/.*?}/gms;

    // Get all declaration informations by reading the extension and the loader information from the comment.
    const lDefaultLoader = [];
    let lMatch;
    while (lMatch = lFileExtensionRegex.exec(lFileContent)) {
        const lExtension = lMatch[1];
        const lLoaderType = lMatch[2];

        // Create regex from extension.
        const lExtensionRegex = new RegExp(lExtension.replace('.', '\\.') + '$');

        // Add loader config.
        lDefaultLoader.push({
            test: lExtensionRegex,
            use: lLoaderType
        });
    }

    return lDefaultLoader;
};

/**
 * Get default loader for typescript files. 
 * @param pIncludeCoverage - Include coverage loader.
 */
const gGetDefaultTypescriptLoader = (pIncludeCoverage) => {
    const lTsLoader = new Array();

    // KEEP LOADER-ORDER!!!

    // Add coverage loader if coverage is enabled.
    if (pIncludeCoverage) {
        lTsLoader.push({ loader: 'istanbul-instrumenter-loader' });
    }

    // Add default typescript loader.
    lTsLoader.push({
        loader: 'babel-loader',
        options: {
            plugins: ['@babel/plugin-transform-async-to-generator'],
            presets: [
                ['@babel/preset-env', { targets: { esmodules: true } }]
            ]
        }
    });
    lTsLoader.push({
        loader: 'ts-loader',
    });

    return lTsLoader;
};

/**
 * Get project name.
 * @param pProjectRootDirectory - Project root directory.
 */
const gGetProjectName = () => {
    const lFilePath = gPath.resolve('package.json');
    const lFileContent = gFilereader.readFileSync(lFilePath, 'utf8');
    const lFileJson = JSON.parse(lFileContent);

    return lFileJson.projectName;
};

/**
 * Get webpack config.
 * @param pEnviroment - { buildType: 'release' | 'debug' | 'test' | 'scratchpad'; coverage: boolan; }
 */
module.exports = (pEnviroment) => {
    const lProjectName = gGetProjectName();

    // Set variable configuration default values.
    let lEntryFile = '';
    let lBuildMode = 'none';
    let lFileName = 'script.js';
    let lOutputDirectory = './library/build';

    switch (pEnviroment.buildType) {
        case 'release':
            lEntryFile = './source/index.ts';
            lBuildMode = 'production';
            lFileName = `${lProjectName}.js`;
            lOutputDirectory = './library/build';
            break;

        case 'debug':
            lEntryFile = './source/index.ts';
            lBuildMode = 'development';
            lFileName = `${lProjectName}.debug.js`;
            lOutputDirectory = './library/build';
            break;

        case 'test':
            gInitializeTextFiles();
            lEntryFile = './test/index.ts';
            lBuildMode = 'development';
            lFileName = `${lProjectName}.test.js`;
            lOutputDirectory = './library/build';
            break;

        case 'scratchpad':
            gInitializeScratchpadFiles(lProjectName);
            lEntryFile = './scratchpad/source/index.ts';
            lBuildMode = 'development';
            lFileName = `${lProjectName}.scratchpad.js`;
            lOutputDirectory = './scratchpad/build';
            break;
    }

    return {
        devtool: 'source-map',
        target: 'web',
        entry: lEntryFile,
        mode: lBuildMode,
        output: {
            filename: `../${lOutputDirectory}/${lFileName}` // ".." because Dist is the staring directory.
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        context: gPath.resolve('./'),
        module: {
            rules: [{
                    test: /\.ts?$/,
                    use: gGetDefaultTypescriptLoader(!!pEnviroment.coverage)
                },
                ...gGetDefaultFileLoader()
            ]
        },
        watch: false,
        watchOptions: {
            aggregateTimeout: 1000,
            ignored: /node_modules/,
            poll: 1000
        }
    };
};