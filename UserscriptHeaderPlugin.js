const fs = require('fs');
const { ConcatSource } = require('webpack-sources');


// [^\S\r\n] matches whitespace which is not a line break.
// Need to match both \r and \n newlines...
/** Should match a userscript header block. */
const userscriptHeaderRegex = /^\/\/[^\S\r\n]*==userscript==[^\S\r\n]*\r?\n?(\/\/[^\r\n]*\r?\n?)+\/\/[^\S\r\n]*==\/userscript==/i;

class UserscriptHeaderPlugin {
    constructor(options) {
        if (!options.inputFile) {
            throw new Error("Usesrcipt header 'inputFile' not specified.");
        }
        if (options.test) {
            this.testRegex = options.test;
        } else {
            this.testRegex = /\.[tj]sx?$/;
        }
        this.filename = options.inputFile;
        this.header = '';

        let content = fs.readFileSync(this.filename, {encoding: 'utf-8'});
        let match = userscriptHeaderRegex.exec(content);
        if (match) {
            this.header = match[0];
        }
    }

    apply(compiler) {
        const filename = this.filename;
        const testRegex = this.testRegex;

        compiler.hooks.compilation.tap("UserscriptHeaderPlugin", compilation => {
            compilation.hooks.optimizeChunkAssets.tap("UserscriptHeaderPlugin", chunks => {
                for (const chunk of chunks) {
                    if (!chunk.canBeInitial())
                        continue;

                    for (const filename of chunk.files) {
                        if (testRegex.test(filename)) {
                            compilation.assets[filename] = new ConcatSource(
                                this.header,
                                '\n\n',
                                compilation.assets[filename]
                            );
                        }
                    }
                }
            })
        });
    }
}

module.exports = UserscriptHeaderPlugin;