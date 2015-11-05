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