const db = require('../db') //this is required

const Survey = require('../db/models/survey');
const Question = require('../db/models/question');

module.exports= {
  findAll: function(req, res, next) {
    Survey.findAll({
      attributes:{ exclude: ['created_at', 'updated_at'] }
    })
    .then(result => {
        res.status(200).send(result);
    })
    .catch(next);
  },

  findOne: function(req, res, next){
    Survey.find({ where: {id:req.params.id}, include: [Question], order: [[Question, 'id']]})
    .then((survey) => {
      if(!survey) res.status(404).send({id:-1});
      else {
        res.status(200).send(survey)
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  },

  findByAuthor: function (req, res, next){
    Survey.findAll({ where: {author:req.params.author}})
    .then((survey) => {
      res.status(200).send(survey)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  },

  findBySurveyID: function(req, res, next){
    Survey.find({ where: {surveyId:req.params.id}, include: [Question]})
    .then((survey) => {
      if(!survey) res.status(404).send({id:-1});
      else {
        res.status(200).send(survey)
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  },

  create: function(req, res, next) {
    Survey.create({
      surveyName: req.body.surveyName,
      details: req.body.details,
      author: req.body.author
    })
    .then((survey) => {
      res.status(200).send(survey);
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  },

  increment: function(req, res, next) {
      Survey.findOne({where: {id: req.params.id}, include: [Question]})
      .then((survey) => {
        if(survey){
          survey.increment('responseCount')
          .then((updatedSurvey) => {
            res.status(200).send(survey);
          })
        } else {
          res.status(404).send();
        }
      })
      .catch((err)=> {
        console.log(err);
        res.status(500).send(err);
      });
  },

  update: function(req, res, next){
    Survey.findOne({where: {id: req.params.id}})
    .then((survey) => {
      if(survey){
        survey.update({
          surveyName: req.body.surveyName,
          details: req.body.details,
          author: req.body.author
        })
        .then((updatedSurvey) => {
          res.status(200).send(survey);
        })
      } else {
        res.status(404).send();
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).send(err);
    })
  },

  cancel: function(req, res, next){
    Survey.findOne({where: {id: req.params.id}})
    .then((survey) => {
      if(survey){
        survey.destroy()
        .then(() => {
          res.status(200).send();
        })
      } else
        res.status(404).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  }

}
