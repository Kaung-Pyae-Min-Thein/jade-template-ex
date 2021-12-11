const { src, series, parallel, dest, watch, task} = require('gulp'),
babel = require('gulp-babel')

// gulp-plugin
clean = require('gulp-clean'),
pug = require('gulp-pug'),
scss = require('gulp-sass')(require('sass')),
server = require('gulp-connect'),
plumber = require('gulp-plumber')

const script = async () => {
    return src('./src/js/**/**.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest('dist/js'))
    .pipe(server.reload())
}

const template = async () => {
    return src('./src/template/**.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(dest('dist'))
    .pipe(server.reload())
}

const style = async () => {
    return src('./src/scss/**.scss')
    .pipe(scss().on('error', scss.logError))
    .pipe(dest('dist/css'))
    .pipe(server.reload())
}

const assets = async () => {
    return src('./src/assets/**/**.**')
    .pipe(dest('dist/assets'))
    .pipe(server.reload())
}

const runDev = async () => {
    watch('./src/js/**/**.js', script)
    watch('./src/template/**/**.pug', template)
    watch('./src/scss/**/**.scss', style)
    watch('./src/assets/**/**.**', assets)
}

const clear = async () => {
    return src('dist')
    .pipe(clean())
}

const liveserver = () => {
    server.server({
        root: 'dist',
        livereload: true
    })
}

const build = parallel(script, template, style, assets)

exports.clear = clear
exports.build = series(build)
exports.default = series(build, runDev, liveserver)
