

class UserscriptHeaderPlugin {
    constructor(options) {
        if (!options.filename) {
            throw new Error("Usesrcipt 'filename' not specified.");
        }
        this.filename = options.filename;

        if (typeof this.filename === 'string') {
            this.testFileName = (s) => s.indexOf(this.filename) !== -1;
        } else {
            this.testFileName = (s) => this.filename.test(s);
        }
    }

    apply(compiler) {
        const filename = this.filename;


        compiler.hooks.compilation.tap("UserscriptHeaderPlugin", compilation => {
            compilation.hooks.buildModule.tap("UserscriptHeaderPlugin", modules => {
                console.log(module.filename);
            });

            compilation.hooks.optimizeChunkAssets.tap("UserscriptHeaderPlugin", chunks => {
                for (const chunk of chunks) {
                    if (!chunk.canBeInitial())
                        continue;

                    for (const filename of chunk.files) {
                        if (this.testFileName(filename)) {

                        }
                    }
                }
            })
        });
    }
}

module.exports = UserscriptHeaderPlugin;