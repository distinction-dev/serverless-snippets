const fs = require("fs")
const path = require("path")


/**
 * 
 * @param {Array<fs.PathLike>} snippets 
 * @param {string} outFile
 * @param {string} [scope]
 */
function compileSnippets(snippets, outFile, scope) {
    let result = {}
    snippets.map(s => JSON.parse(fs.readFileSync(s).toString())).forEach(s => {
        if (scope) {
            Object.keys(s).forEach(k => {
                s[k].scope = scope
            })
        }
        result = {
            ...result,
            ...s
        }
    })
    fs.writeFileSync(path.join(__dirname, "snippets", outFile), JSON.stringify(result, null, 4))
    fs.writeFileSync(
        path.join(__dirname, ".vscode", `${outFile}.code-snippets`),
        JSON.stringify(result, null, 4)
    )
}

/**
 * This function scans the yaml directory in snippets directory and combines them into a single json file
 */
function buildYaml() {
    const files = fs.readdirSync(path.join(__dirname, "snippets", "yaml"))
        .map(f => path.join(__dirname, "snippets", "yaml", f))
    compileSnippets(files, "yaml.json", "yaml")
    // copy to .vscode as well
}

function run() {
    buildYaml()
}

if (require.main === module) {
    run()
}
