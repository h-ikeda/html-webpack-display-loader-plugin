"use strict";
const uuid = require("uuid/v4");

module.exports = class {

    constructor(options) {
        this.options = options || {};
    }

    apply(compiler) {
        compiler.plugin("compilation", compilation => {
            compilation.plugin("html-webpack-plugin-after-html-processing", (htmlPluginData, callback) => {
                const loader = this.createLoader();
                if (loader.css) {
                    htmlPluginData.html = htmlPluginData.html.replace(/<\/head>/, "<style>" + loader.css + "</style>$&")
                }
                if (loader.html) {
                    htmlPluginData.html = htmlPluginData.html.replace(/<body[^>]*>/, "$&" + loader.html);
                }
                callback(null, htmlPluginData);
            });
        });
    }
    
    createLoader() {
        let css = "", html = "";
        switch (this.options.type) {
            default:
                const scopeAttr = "data-hwdlp-" + uuid();
                const rootClass = this.options.class ? " class=\"" + this.options.class + "\"": "";
                const rootId = this.options.id ? " id=\"" + this.options.id + "\"": "";
                css = `
                    [${scopeAttr}], [${scopeAttr}] .hwdlp-loader, [${scopeAttr}] .hwdlp-loader__content {
                        /* 画面いっぱいに表示 */
                        position: fixed;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                    }
                    [${scopeAttr}] .hwdlp-loader {
                        /* ロード画面の背景 */
                        background: #e0e0e0;
                    }
                    [${scopeAttr}] .hwdlp-loader__content {
                        /* 上下左右中央に配置 */
                        width: min-content;
                        height: min-content;
                        margin: auto;
                    }
                    [${scopeAttr}] .hwdlp-loader-blink {
                        animation: hwdlp-${scopeAttr} 1.5s ease-out 0s infinite;
                    }
                    @keyframes hwdlp-${scopeAttr} {
                        from, to {opacity: 0;}
                        75% {opacity: 1;}
                    }
                `;
                html = `
                    <div${rootClass}${rootId} ${scopeAttr}>
                        <div class="hwdlp-loader">
                            <div class="hwdlp-loader__content">
                                <p class="hwdlp-loader-blink">Loading...</p>
                            </div>
                        </div>
                    </div>
                `;
        }
        return {
            css,
            html
        }
    }
};
