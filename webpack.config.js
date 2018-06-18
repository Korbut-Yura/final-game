let path = require("path");

let conf = {
    entry: './src/index.js',
    output: {
        path: path.resolve( __dirname, './dist' ),
        filename: 'main.js',
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 
                    'style-loader',
                    'css-loader'
                    ]
            },
            { 
                test: /\.(woff|woff2|eot|ttf|otf)$/, 
                loader: 'url-loader?limit=100000' 
            },
            {
                test: /\.(png|svg|jpg|wav|gif|ogg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options:  {
                            name: 'assets/[name].[ext]'
                        }
                    }
                ]   
            }   
        ]
    }
}

module.exports = (env, options) =>  {
    let production = options.mode ==='production';
    conf.devtool = production ? false : 'eval-sourcemap'
    return conf;
};