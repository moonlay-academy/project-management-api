'use strict';
const schema = require("./test.json");
const app = require('../../server/server');

module.exports = function (Test) {
    var mssql = app.dataSources.mssql;
    mssql.createModel(schema.name, schema.properties, schema.options);

    mssql.automigrate(function () {
        mssql.discoverModelProperties(schema.name, function (err, props) {
            console.log(props);
        });
    });

    Test.validate = function (context) {
        return Promise.resolve(context);
    }
};
