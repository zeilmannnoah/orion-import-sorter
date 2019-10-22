const { commands, workspace }  = require('vscode');
const { sortImports, randomizeImports, sortImportsOnSave } = require('./ImportSorter');

function activate(context) {
	const sortSubscription = commands.registerCommand('orion.sortSelectedImports', sortImports),
		randomizeSubscription = commands.registerCommand('orion.randomizeSelectedImports', randomizeImports),
		onSaveSortSubscription = workspace.onWillSaveTextDocument(sortImportsOnSave);

	context.subscriptions.push(sortSubscription);
	context.subscriptions.push(randomizeSubscription);
	context.subscriptions.push(onSaveSortSubscription);
}

function deactivate() {}

exports.activate = activate;
module.exports = {
	activate,
	deactivate
}
