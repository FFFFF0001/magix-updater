let fs = require('fs');
let tmpl = `
    (function(){
        Inc('variable');
        Inc('tmpl');
        Inc('partial');
        Inc('updater');
        window.Updater=Updater;
    })();
`;
tmpl = tmpl.replace(/\bInc\('([^\)]+)'\);?/g, (match, name) => {
    return fs.readFileSync('../src/' + name + '.js') + '';
});
fs.writeFileSync('../dist/index.js', tmpl);