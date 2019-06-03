const ParcelHTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');

class HTMLAsset extends ParcelHTMLAsset {
    collectDependencies() {
        super.collectDependencies();
        this.ast.walk(node => {
            if (node.tag === 'hn-route' && node.attrs) {
                for (let attr in node.attrs) {
                    if (attr === 'module') {
                        node.attrs[attr] = super.processSingleDependency(
                            node.attrs[attr]
                        );
                        this.isAstDirty = true;
                        continue;
                    }
                }
            }

            return node;
        });
    }

    // async generate() {
    //     const parts = await super.generate();

    //     if (this.ast) {
    //         this.ast.walk(node => {
    //             if (node.tag === 'script' && node.attrs.type === 'module') {
    //                 const type = node.attrs.type;
    //                 let value = node.content && node.content.join('').trim();
    //                 if (value) {
    //                     parts.push({
    //                         type,
    //                         value,
    //                         inlineHTML: true,
    //                         meta: {
    //                             type: 'tag',
    //                             node
    //                         }
    //                     });
    //                 }
    //             }
    //         });
    //     }

    //     return parts;
    // }
}

module.exports = HTMLAsset;
