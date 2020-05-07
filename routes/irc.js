var irc = require('../lib/irc'); //var bmi = require('../lib/bmi');

const patient = new patientClass(160, 72); //creación del objeto
module.exports = function(req, res, next) {
    return res.json({
        result: {
            bmi: patient.getIndexIRC(req.height, req, weight, req.unit), //con objeto
            // bmi: irc.getIndexIRC(req.weight, req.height, req.unit), // bmi: bmi.getIndex(req.weight, req.height, req.unit),
            description: patientClass.getDescriptionIRC(patient.getIndexIRC(height, weight), lang) //con metodo estatico y objeto
                // description: irc.getDescriptionIRC(irc.getIndexIRC(req.weight, req.height, req.unit), req.lang) //description: bmi.getDescription(bmi.getIndex(req.weight, req.height, req.unit), req.lang)

        }
    });
};