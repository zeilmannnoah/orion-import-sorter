# Orion Import Sorter
This is a simple extension for sorting ES6 imports.

## Features
### Sort Imports on Save
This feature is disabled automatically. To enable it open your _settings.json_, and add the following property:

    "orion.sortImportsOnSave": true

### Sort Selected Imports
To use this feature press the follow keys:

    Windows\Linux: Ctrl + Shift + P
    Mac OS: Command + Shift + p
Then search and select the command:

    Orion - Sort Selected Imports
    
### Randomize Selected Imports
To use this feature press the follow keys:

    Windows\Linux: Ctrl + Shift + P
    Mac OS: Command + Shift + p
Then search and select the command:

    Orion - Randomize Selected Imports

## Issues
There is a known issue with this plugin where if you have the ESlint plugin installed with autofix on save enabled, it can cause conflicts. Currently to resolve this, you will have to disable the eslint rule _import/order_.

Please log any issues you experience so this extension can be improved.
[New Issue - Orion Import Sorter](https://github.com/zeilmannnoah/orion-import-sorter/issues/new)