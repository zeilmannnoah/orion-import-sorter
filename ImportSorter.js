const {
    window, 
} = require('vscode');

const importRegex = new RegExp(/import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/, 'mg'),
    localFileRegex = /.+\/(\w+)$/;

const sortImports = () => {
    if (!window.activeTextEditor || !window.activeTextEditor.document) {
        return;
    }

    try {
        const selectionRange = window.activeTextEditor.selection.with(),
            text = window.activeTextEditor.document.getText(selectionRange);

        window.activeTextEditor.edit(textEditor => {
            const sortedImported = extractImports(text).sort(compareImports);

            textEditor.replace(selectionRange, sortedImported.map(statement => statement.line).join('\n'));
        });
    } catch (error) {
        window.showErrorMessage(`Orion import sorter failed with error - ${error.message}`);
    }
}

const compareImports = (importA, importB) => {
    // Handle common module types
    if (importA.moduleType === importB.moduleType) {
        if (importA.fileName) {
            return importA.fileName.localeCompare(importB.fileName);
        }
        else {
            return importA.moduleName.localeCompare(importB.moduleName);
        }
    }

    // Handle React
    if (importA.moduleType === 'react') {
        return -1;
    }

    if (importB.moduleType === 'react') {
        return 1;
    }

    // Handle NPM imports
    if (importA.moduleType === 'npm') {
        return -1;
    }

    if (importB.moduleType === 'npm') {
        return 1;
    }

    // Handle Terra
    if (importA.moduleType === 'terra') {
        return -1
    }

    if (importB.moduleType ==='terra') {
        return 1
    }

    if (importA.moduleType === 'terra') {
        return -1
    }

    if (importB.moduleType ==='terra') {
        return 1
    }
}

const extractImports = (textContent) => {
    const importStatements = [];
    let importCapture;

    do {
        let moduleName,
            fileName,
            line,
            importedName,
            moduleType;

        importCapture = importRegex.exec(textContent);

        if (importCapture) {
            line = importCapture[0];
            importedName = importCapture[1];
            moduleName = importCapture[2];
            fileName = localFileRegex.exec(moduleName);
            localFileRegex.lastIndex = 0;

            if (moduleName == 'react') {
                moduleType = 'react';
            }
            else if (moduleName.startsWith('terra')) {
                moduleType = 'terra';
            }
            else if (fileName) {
                moduleType = 'local';
                fileName = fileName[1]
            }
            else {
                moduleType = 'npm';
            }

            importStatements.push({moduleName, moduleType, fileName, importedName, line});
        }
    } while (importCapture);

    return importStatements;
}

module.exports = {
    sortImports
};