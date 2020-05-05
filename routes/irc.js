var irc = require('../lib/irc'); //var bmi = require('../lib/bmi');
module.exports = function(req, res, next) {
    return res.json({
        result: {
            bmi: irc.getIndexIRC(req.weight, req.height, req.unit), // bmi: bmi.getIndex(req.weight, req.height, req.unit),
            description: irc.getDescriptionIRC(irc.getIndexIRC(req.weight, req.height, req.unit), req.lang) //description: bmi.getDescription(bmi.getIndex(req.weight, req.height, req.unit), req.lang)
        }
    });
};