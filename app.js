var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cors = require('cors')

//Database setup
var db = mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/contentstore", { safe: true })
var Schema = mongoose.Schema
var contentSchema = new Schema({
    main_header : String,
    main_content : String
});
var contentModel = mongoose.model("content", contentSchema)
//End Database setup

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//RouteSetup
app.get('/load', function(req, res, next){
    if(req.query && req.query.id){
        contentModel.findById(req.query.id , function(err, doc){
            if(err || !doc){
                res.status(404).send("not found");        
            }else{
                res.status(200).send(doc);
            }
        })
    }else{
        res.status(404).send("no id informed");
    }
})

app.get('/list', function(req, res, next){
    contentModel.find({}, { _id : true }, function(err, docs){
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(docs);
        }
    })
})

app.post('/save', function(req, res, next){
    if(req.body.id){
        contentModel.findById(req.body.id , function(err, doc){
            if(err || !doc){
                res.status(404).send("not found");        
            }else{
                doc.main_header = req.body.main_header || doc.main_header
                doc.main_content = req.body.main_content || doc.main_content
                doc.save(function(){
                    res.status(200).send(doc._id.toString())  
                })
            }
        })
    }else{
        var newone = new contentModel()
        newone.main_header = req.body.main_header
        newone.main_content = req.body.main_content 
        newone.save(function(){
            res.status(200).send(newone._id.toString())  
        })
    }
})
//End RouteSetup

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
