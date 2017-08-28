var app = require('../../server/server');
var assert = require('assert');
var tools = require("./tools");

it("create", function (done) {
    tools.newData()
        .then(result => {
            assert.notEqual(result, null);
            done();
        })
        .catch(err => {
            done(err);
        });
});

it('counts initially 0 student', function (done) {
    app.models.Project.validate(10)
        .then(ctx => {
            assert.equal(ctx, 10);
            done();
        })
        .catch(err => {
            done(err);
        });
}); 