const glob = require('glob');
const path = require('path');

var indexFiles = glob.sync(
    path.join(app.get('root'), 'features') + '/**/*[i|I]ndex.js'
);
indexFiles.forEach(function(file) {
    require(file)(app);
});