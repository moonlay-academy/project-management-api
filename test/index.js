function test(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe('#project-management-api', function (done) {
    this.timeout(2 * 60000);
    test("project", "./project")
});
