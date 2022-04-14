const { converter } = require("./functions").default;
const prettier = require("prettier");


module.exports['default'] = {
    /**
     * 
     * @param {string} code 
     * @param {boolean} pretty 
     * @param {import("prettier").Options} options 
     * @returns { { prettied: boolean, code: string, convertTime:number } }
     */
    converter: function (code, pretty = false, options = { parser: "babel" }) {
        if(!code) {
            return {
                error: "you must provide a discord.js v12 code"
            }
        }
        let startTime = Date.now();

        let converted = converter(code);
        
        let prettied = false;
        
        if(pretty) {
            try{
                converted = prettier.format(converted, options);
                prettied = true;
            }catch(e){}
        }
        
        return {
            prettied,
            code: converted,
            convertTime: Date.now() - startTime,
        }
    }
}