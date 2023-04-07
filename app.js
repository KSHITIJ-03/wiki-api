const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"))
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true})

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const article = new mongoose.model("article", articleSchema)

app.listen(3000, ()=>{
  console.log("server started at port 3000");
})

app.route("/articles").get((req, res)=>{
  article.find({}).then((data)=>{
    console.log(data)
    res.send(data)
  })
}).post((req, res)=>{
  const title = req.body.title;
  const content = req.body.content;
  console.log(title);
  console.log(content);
  const newArticle = new article({
    title: req.body.title,
    content: req.body.content
  })
  newArticle.save().then(post =>{
    res.json({post});
    console.log("successfully saved");
  }).catch(err => res.json(err));
}).delete((req, res)=>{
  article.deleteMany().then((data)=>{
    console.log("deleted all the data");
    res.send("delete all the articles")
  }).catch((err)=>{
    res.json(err);
  })
})

app.route("/articles/:articleTitle")
.get((req, res)=>{
  article.findOne({title: req.params.articleTitle}).then((data)=>{
    if(data){
      res.json(data)
      console.log(data);
    }
    else{
      console.log("no data found");
      res.write("No data found")
      res.send();
    }
  }).catch((err)=>{
    res.json(err);
  })
}).put((req, res)=>{
  article.updateOne({title: req.params.articleTitle}, {$set: { content: req.body.content}}, {overwrite: true}).then((data)=>{
    res.send("successfully updated");
  }).catch((err)=>{
    res.send(err);
  })
}).patch((req, res)=>{
  article.updateOne({title: req.params.articleTitle}, {$set: req.body}).then((data)=>{
    res.send("succefully updated article")
  }).catch((err)=>{
    res.json(err)
  })
}).delete((req, res)=>{
  article.deleteOne({title: req.params.articleTitle}).then((data)=>{
    res.send("deleted successfully")
  }).catch((err)=>{
    res.send(err)
  })
})
