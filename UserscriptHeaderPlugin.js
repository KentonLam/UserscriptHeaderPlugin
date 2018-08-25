const fs = require('fs');


// [^\S\r\n] matches whitespace which is not a line break.
/** Should match a userscript header block. */
const userscriptHeaderRegex = /^\/\/[^\S\r\n]*==userscript==[^\S\r\n]*\n(\/\/[^\r\n]*\n)+\/\/[^\S\r\n]*==\/userscript==/i;

class UserscriptHeaderPlugin {
    constructor(options) {
        if (!options.filename) {
            throw new Error("Usesrcipt 'filename' not specified.");
        }
        this.filename = options.filename;
        this.headers = {};

        if (typeof this.filename === 'string') {
            this.testFileName = (s) => s.indexOf(this.filename) !== -1;
        } else {
            this.testFileName = (s) => this.filename.test(s);
        }
    }

    apply(compiler) {
        const filename = this.filename;

        compiler.hooks.compilation.tap("UserscriptHeaderPlugin", compilation => {
            compilation.hooks.buildModule.tap("UserscriptHeaderPlugin", (module) => {
                if (this.testFileName(module.resource)) {
                    console.log("Matched file: "+ module.resource);
                    let content = fs.readFileSync(module.resource, {encoding: 'utf-8'});
                    console.log(content);
                    console.log(userscriptHeaderRegex.exec(content));
                }
            });

            compilation.hooks.optimizeChunkAssets.tap("UserscriptHeaderPlugin", chunks => {
                for (const chunk of chunks) {
                    if (!chunk.canBeInitial())
                        continue;

                    for (const filename of chunk.files) {
                            console.log(compilation.assets[filename]);
                    }
                }
            })
        });
    }
}

module.exports = UserscriptHeaderPlugin;