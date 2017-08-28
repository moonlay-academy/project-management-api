'use strict';
var schema = require('./task.json');
var app = require('../../server/server');
var shortId = require('shortid');

module.exports = function (Task) {
  Task.validatesUniquenessOf('code', { message: 'code already exists' });

  var mssql = app.dataSources.mssql;
  mssql.createModel(schema.name, schema.properties, schema.options);
  mssql.autoupdate(function (err, result) {
    if (err) {
      mssql.automigrate(function () {
        mssql.discoverModelProperties(schema.name, function (err, props) {
          console.log(props);
        });
      });
    }
    else
      mssql.discoverModelProperties(schema.name, function (err, props) {
        console.log(props);
      });
  });

  Task.validate = function (context) {
    return Promise.resolve(context);
  }

  Task.observe('before save', (context, next) => {
    var Backlog = app.models.Backlog;
    var data = context.instance || context.data;

    if (context.isNewInstance) {
      data.code = shortId.generate();
      Backlog.findById(data.backlogId, (err, backlog) => {
        if (err)
          return next(err);
        data.backlogId = backlog.id;
        data.projectId = backlog.projectId;
      })
    }
    next();
  })
};
