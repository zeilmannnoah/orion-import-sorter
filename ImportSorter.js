const { window, workspace } = require('vscode');
const importRegex = new RegExp(/import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/, 'mg'),
    importBlockRegex = /(import[\s\S]+(?:from|)\s(?:'|"|`)[\w-\.\/]+(?:'|"|`);)([\s\S]+)/,
    localFileRegex = /\.+\/(?:.+\/|)(\w+)/;

const sortImports = () => {
    if (!window.activeTextEditor || !window.activeTextEditor.document) {
        return;
    }

    try {
        const selectionRange = window.activeTextEditor.selection.with(),
            text = importBlockRegex.exec(window.activeTextEditor.document.getText(selectionRange)),
            importBlock = text[1],
            additionalText = text[2];

        window.activeTextEditor.edit(textEditor => {
            const sortedImports = extractImports(importBlock).sort(compareImports);

            textEditor.replace(selectionRange, `${sortedImports.map(statement => statement.line).join('\n')}${additionalText}`);
        });
        
        window.showInformationMessage('Imports sorted!');
    } catch (error) {
        window.showErrorMessage(`Orion import sorter failed with error - ${error.message}`);
    }
}

const randomizeImports = () => {
    if (!window.activeTextEditor || !window.activeTextEditor.document) {
        return;
    }

    try {
        const selectionRange = window.activeTextEditor.selection.with(),
            text = importBlockRegex.exec(window.activeTextEditor.document.getText(selectionRange)),
            importBlock = text[1],
            additionalText = text[2];

        window.activeTextEditor.edit(textEditor => {
            const randomizedImports = shuffle(extractImports(importBlock));

            textEditor.replace(selectionRange, `${randomizedImports.map(statement => statement.line).join('\n')}${additionalText}`);
        });
        window.showInformationMessage('Imports randomized!');
    } catch (error) {
        window.showErrorMessage(`Orion import sorter failed with error - ${error.message}`);
    }
}

const sortImportsOnSave = () => {
    if(workspace.getConfiguration('orion').get('sortImportsOnSave')) {
        if (!window.activeTextEditor || !window.activeTextEditor.document) {
            return;
        }
    
        try {
            const selectionRange = window.activeTextEditor.visibleRanges[0],
                text = importBlockRegex.exec(window.activeTextEditor.document.getText(selectionRange)),
                importBlock = text[1],
                additionalText = text[2];
                
            window.activeTextEditor.edit(textEditor => {
                const imports = extractImports(importBlock),
                    sortedImports = [...imports].sort(compareImports);
                    
                if (!importsEqual(imports, sortedImports)) {
                    textEditor.replace(selectionRange, `${sortedImports.map(statement => statement.line).join('\n')}${additionalText}`);
                    window.showInformationMessage('Imports sorted!');
                }
            });

        } catch (error) {
            window.showErrorMessage(`Orion import sorter failed with error - ${error.message}`);
        }
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

    // Handle Local files
    if (importA.moduleType === 'local') {
        return -1
    }

    if (importB.moduleType ==='local') {
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
                fileName = fileName[1]
                moduleType = importedName === 'style ' ? 'style' : 'local';
            }
            else {
                moduleType = 'npm';
            }

            importStatements.push({moduleName, moduleType, fileName, importedName, line});
        }
    } while (importCapture);

    return importStatements;

}

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const importsEqual = (importA, importB) => {
    return Object.keys(importA).length === Object.keys(importB).length && Object.keys(importA).every(p => importA[p] === importB[p]);
}

module.exports = {
    sortImports,
    randomizeImports,
    sortImportsOnSave
};