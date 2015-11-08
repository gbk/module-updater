# module-updater

---

Global npm module updater.

## Usage

```
var updater = require('module-updater');
updater.update('your-module', function(err, result) {
    // DO SOMETHING AFTER INSTALLING
});
```

## APIs

### update(module[, callback])

Install or update `module` to the latest version globally.

A callback is called after installing finished, the first argument of callback is error instance.

## History

### 2.0.2

- Grant permissions to NODE_PATH before install.

### 2.0.1

- Use install command to replace update command.
