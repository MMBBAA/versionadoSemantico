const Patient = require('../lib/Patient');
module.exports = function(req, res) {

    const reductions = ['statin', 'sysBP', 'aspirin', 'smoker'];
    const score = 'ten';

    const patient = new Patient(
        req.weight,
        req.height,
        setPatientInfo(
            req.query.gender,
            req.query.age,
            req.query.totCholesterol,
            req.query.hdl,
            req.query.sysBP,
            req.query.smoker,
            req.query.hypertensive,
            req.query.race,
            req.query.diabetic
        )
    );

    res.json({ potencialRisk: patient.computePotentialRisk(reductions, score) });

};




const setPatientInfo = (gender, age, totCholesterol, hdl, sysBP, smoker, hypertensive, race, diabetic) => {
    const patientInfo = {};

    const thisDate = new Date();

    patientInfo.gender = gender;
    patientInfo.age = age;

    patientInfo.totalCholesterol = totCholesterol;
    patientInfo.hdl = hdl;
    patientInfo.systolicBloodPressure = sysBP;

    const relatedFactors = {};
    relatedFactors.smoker = smoker;
    relatedFactors.hypertensive = hypertensive;
    relatedFactors.race = race;
    relatedFactors.diabetic = diabetic;
    patientInfo.relatedFactors = relatedFactors;

    return patientInfo;
};