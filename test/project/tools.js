var shortid = require("shortid");
var app = require("../../server/server");

function getDraft() {
    var uid = shortid.generate();
    var draft = {
        "code": uid,
        "name": `TEST-PROJECT[${uid}]`,
        "description": `some description for TEST-PROJECT[${uid}]`,
        "status": "new"
    };
    return Promise.resolve(draft);
}

function newData() {
    return new Promise((resolve, reject) => {
        getDraft().then(draft => {
            app.models.Project.create(draft, function (err, result) {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    });
}

module.exports.getDraft = getDraft;
module.exports.newData = newData;