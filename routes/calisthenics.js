var express = require("express");
var router  = express.Router();
var Calisthenics = require("../models/calisthenics");
var middleware = require("../middleware");

router.get('/calisthenics', function(req,res){
	Calisthenics.find({}, function(err, moves){
		if (err){
			res.redirect('/');
		} else{
			res.render('calisthenics/index', {moves:moves});
		}
	})
})

//new route
router.get('/calisthenics/new', middleware.isLoggedIn, function(req,res){
	res.render('calisthenics/new')
})
//create route
router.post('/calisthenics', function(req,res){
	var title = req.body.calisthenics.title;
	var video = req.body.calisthenics.video;
	var desc = req.body.calisthenics.description;
	var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCalis = {title: title, video: video, description: desc, author: author}
	Calisthenics.create(newCalis, function(err, newMove){
		if(err){
			res.render('calisthenics/new');
		} else{
			console.log(req.body);
			res.redirect('/calisthenics');
		}
	})
})

//show route
router.get('/calisthenics/:id', function(req,res){
	Calisthenics.findById(req.params.id).populate('comments').exec(function(err, foundMove){
		if(err){
			res.redirect('/calisthenics');
		} else{
			console.log(foundMove);
			res.render('calisthenics/show', {move:foundMove});
		}
	})
})

//edit route
router.get('/calisthenics/:id/edit', function(req, res){
	Calisthenics.findById(req.params.id, function(err, foundMove){
		if(err){
			res.redirect('/calisthenics');
		} else{
			res.render('calisthenics/edit', {move:foundMove})
		}
	});
});

//update route
router.put('/calisthenics/:id', function(req,res){
	Calisthenics.findByIdAndUpdate(req.params.id, req.body.calisthenics, function(err,updatedMove){
		if(err){
			res.redirect('/calisthenics');
		} else{
			res.redirect('/calisthenics/'+req.params.id);
		}
	});
});

//delete route
router.delete('/calisthenics/:id', function(req,res){
	Calisthenics.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/calisthenics');
		} else{
			res.redirect('/calisthenics');
		}
	});
});

module.exports = router;
