const ParcelHTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');

class HTMLAsset extends ParcelHTMLAsset {
    collectDependencies() {
        super.collectDependencies();
        this.ast.walk(node => {
            if (node.tag === 'hn-route' && node.attrs) {
                for (let attr in node.attrs) {
                    if (attr === 'module') {
                        node.attrs[attr] = super.collectSrcSetDependencies(node.attrs[attr]);
                        this.isAstDirty = true;
                        continue;
                    }
                }
            }

            return node;
        });
    }
}

module.exports = HTMLAsset;
