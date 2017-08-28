'use strict';
var schema = require('./backlog.json');
var app = require('../../server/server');
var shortId = require('shortid');

module.exports = function (Backlog) {
  Backlog.validatesUniquenessOf('code', { message: 'code already exists' });

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

  Backlog.validate = function (context) {
    return Promise.resolve(context);
  }

  Backlog.observe('before save', (context, next) => {
    var Project = app.models.Project;
    var data = context.instance || context.data;

    if (context.isNewInstance)
      data.code = shortId.generate();

    Project.findById(data.projectId, (err, project) => {
      if (err)
        return next(err);
      data.projectId = project.id;
      next();
    })
  })
};
