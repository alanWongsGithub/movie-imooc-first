
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('underscore');

const Movie = require('./models/movie');


const port = process.env.PORT || 3001;

const app = express();

const dir = path.join(__dirname, './app/views/pages/');

// 连接数据库
var db = mongoose.connect('mongodb://localhost/imooc');

db.connection.on("error", (error) => { 
  console.log("数据库连接失败：" + error); 
}); 

db.connection.on("open", () => { 
  console.log("——数据库连接成功！——"); 
});


// 使用html模板，需增加  app.engine('html', require('ejs').__express);使用EJS或jade模板，不用配置该项。

app.set('views', dir);// 设置模板相对路径(相对当前目录)
app.set('view engine', 'jade');// 设置模板引擎

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/*通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了。
注意：express 4.x版本之后值保留了express.static这个方法，其他方法都分为中间件另外安装引入
*/
app.use(express.static(path.join(__dirname, 'public')));

// 首页 
app.get('/', (req, res)=>{
  // 查询数据
  Movie.fetch((err, movies) => {
    if (err) console.log(err);

    res.render('index', {// 调用当前路径下的 test.jade 模板
      title: '电影网站首页',
      movies: movies
    });
    
  });

});

// 详情页
app.get('/movie/:id', (req, res)=>{
  let id = req.params.id;
  // 根据id查询数据
  Movie.findById(id, (err, movie) => {
    res.render('detail', {
      title: movie.title,
      movie: movie
    });
  }); 
});

// 后台录入页 
app.get('/admin/movie', (req, res)=>{
  res.render('admin', {
    title: '电影录入',
    movie: {
      title: '',
      director: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  });
});

// 电影录入post过来的数据
app.post('/admin/movie/new', (req, res) => {
  let movieObj = req.body.movie,
      id = movieObj._id,
      _movie;

      // 更新数据。
  if ('undefined' !== id) { 
    Movie.findById(id, (err, movie) => {
       if (err) console.log(err);

       _movie = _.extend(movie, movieObj);
       _movie.save((err, movie) => {
          if (err) console.log(err);

          // 添加成功，从定向到详情页显示详情
          res.redirect(`/movie/${movie._id}`);
       });
    });

  } else {  // 插入数据
    _movie = new Movie({
      director: movieObj.director,
      title: movieObj.title,
      country: movieObj.country,
      year: movieObj.year,
      poster: movieObj.poster,
      flash: movieObj.flash,
      summary: movieObj.summary,
      language: movieObj.language
    });
    _movie.save((err, movie) => {
       if (err) console.log(err);
       
       res.redirect(`/movie/${movie._id}`);
    });
  }
});


// 列表页
app.get('/admin/list', (req, res)=>{

  Movie.fetch((err, movies) => {
    if (err) console.log(err);

    res.render('list', {
      title: '电影列表',
      movies: movies
    });
    
  });
});

// 将数据初始化到表单中

app.get('/admin/update/:id', (req, res) => {
  let id = req.params.id;

  if (id) {
    Movie.findById(id, (err, movie) => {
      if (err) console.log(err);

      res.render('admin', {
        title: '电影修改',
        movie: movie
      });
    });   
  } 

});

// 删除数据
app.delete('/admin/list', (req, res) => {
  let id = req.query.id;

    if (id) {
      Movie.remove({_id: id}, (err, movie) => {
        if (err) console.log(err);

        res.json({success: true});
    });   
  } 

});


app.listen(port)
console.log('Servet started on port ' + port)