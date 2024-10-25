// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// my script
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('extension.createWebpackProject', async function() {
		const folderUrl = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: 'Select folder for new Webpack project'
		});

		if(!folderUrl){
			vscode.window.showErrorMessage('Folder not selected!');
			return;
		}

		const projectPath = folderUrl[0].fsPath;
		vscode.window.showInformationMessage(`Creating Webpack at: ${projectPath}`);

		// membuat file dan folder
		fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
			name: 'webpack-project',
			version: '1.0.0',
			Script: {
				build:  'webpack --node production',
				start: 'webpack serve --node development'
			},
			devDependencies: {
				'webpack': '^5.88.0',
				'webpack-cli': '^5.1.4',
				'webpack-dev-server': '^4.15.0'
			},
		 }, null, 2));

		 fs.writeFileSync(path.join(projectPath, 'webpack.config.js'),`
		 	const path= require('path');

			module.exports = {
		 		entry: './src/index.js',
				output: {
		 			filename: 'bundle.js',
					path: path.resolve(_dirname, 'dist'),
				},
				mode: 'development',
			};
		 
		 `);

		 fs.mkdirSync(path.join(projectPath, 'src'));
		 fs.writeFileSync(path.join(projectPath, 'src/index.js'), `
		 	console.log('hello world');
		 `);

		//  menjalankan 'npm install'
		exec('npm install', { cwd: projectPath }, (error, stdout, stderr) => {
			if(error){
				vscode.window.showErrorMessage(`Error: ${stderr}`);
				return;
			}

			vscode.window.showInformationMessage('Webpack project created and depedencies installed.');
		});

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
