// import { parallel,series } from "gulp";
import gulp,{src} from "gulp";
import gulpsass from "gulp-sass";
import dartSass from "sass";
import path from 'node:path';
import { Transform } from 'stream';
import cssnano from "cssnano";//css压缩
import postcss from "postcss";//css抽象语法树
import type Vinly from "vinyl";
import consola from "consola";

//压缩css
const comilessCss = ()=>{
    const postcsser = postcss([
        cssnano({
            preset: ['default',{}]
        })
    ])
return new Transform({
    objectMode:true,
    transform(chunk,encoding,callback){
        // const result=chunk.toString().replace(/\/\*.+?\*\//g,'')
        // callback(null,result)
        const file =chunk as Vinly
        const cssstring = file.contents!.toString()
        postcsser.process(cssstring,{from:file.path}).then((result)=>{
            const name = path.basename(file.path)
            //result.css 压缩之后的内容
            file.contents = Buffer.from(result.css)
            consola.success(`minfy ${name}${cssstring.length / 1024}-> ${result.css.length / 1024} 压缩成功`)
        })
        callback(null,chunk)
    }
})
}
const buildThemeBunle=()=>{
    const sass = gulpsass(dartSass)
    //编译src 下面的scss
    return src(path.resolve(__dirname,'src/*.scss'))
    .pipe(sass.sync()) // 同步执行
    .pipe(comilessCss())
    .pipe(gulp.dest(path.resolve(__dirname,'dist')))
}
gulp.task('sass',()=>{
    console.log('编译')
})
gulp.task('watch',()=>{
    //文件发生变化就编译
    gulp.watch('src/**/*.scss',gulp.series('sass'))
})

export default buildThemeBunle