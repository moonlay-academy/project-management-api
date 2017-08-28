'use strict';
var schema = require('./project.json');
var app = require('../../server/server');

module.exports = function (Project) {
  Project.validatesUniquenessOf('code');

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

  Project.validate = function (context) {
    return Promise.resolve(context);
  }
};
