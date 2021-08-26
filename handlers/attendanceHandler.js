exports.GET_attendance = function (req, res) {
    res.render('attendance.hbs', { csrf: 'CSRF token goes here'});
}

exports.api = {
    POST_attendance : function (req, res) {
        console.log('CSRF token: ', req.body._csrf);
        console.log('Full name: ', req.body.fullName);
        console.log('age: ', req.body.age);
        console.log('Professional Status: ', req.body.professionalStatus);
        console.log('Institution: ', req.body.institution);
        console.log('Course: ', req.body.course);
        res.send({ result: "Success" });
    }
}
