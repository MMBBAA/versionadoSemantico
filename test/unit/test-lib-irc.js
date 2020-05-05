var assert = require('assert');
var irc = require('../../lib/irc');

// irc.getIndex tests
exports.it_should_return_number = function(done) {

    var result = irc.getIndexIRC(30, 1.6, 'metric');
    assert.ok(result === 30 / Math.pow(1.6, 2));
    return done();
};
//modificado
exports.it_should_calculate_irc_correct = function(done) {
    var result = irc.getIndexIRC(30, 1.6, 'metric');
    assert.ok(result === 30 / Math.pow(1.6, 2));
    return done();
};
//modificado
exports.it_should_calculate_imperial_irc_correct = function(done) {
    var result = irc.getIndexIRC(118, 60);
    assert.ok(result === (118 * 703 / Math.pow(60, 2)));
    return done();
};
//modificado
exports.it_should_reject_strings = function(done) {
    var result = irc.getIndexIRC('kg', 'cm');
    assert.ok(!result);
    return done();
};

// irc.getDescription tests
//modificado
exports.it_should_return_correct_string_in_finnish_depending_on_the_irc = function(done) {
    var ircUnder16 = irc.getDescriptionIRC(11.7, "fi");
    var ircUnder16Border = irc.getDescriptionIRC(15.9, "fi");
    assert.ok(ircUnder16 === 'Vaikea alipaino' && ircUnder16Border === 'Vaikea alipaino');

    var ircFrom16To17Border = irc.getDescriptionIRC(16.0, "fi");
    var ircFrom16To17 = irc.getDescriptionIRC(16.5, "fi");
    assert.ok(ircFrom16To17Border === 'Merkittävä alipaino' && ircFrom16To17 === 'Merkittävä alipaino');

    var ircFrom17To18AndAHalfBorder = irc.getDescriptionIRC(17.0, "fi");
    var ircFrom17To18AndAHalf = irc.getDescriptionIRC(18.2, "fi");
    assert.ok(ircFrom17To18AndAHalfBorder === 'Lievä alipaino' && ircFrom17To18AndAHalf === 'Lievä alipaino');

    var ircFrom25To30Border = irc.getDescriptionIRC(25, "fi");
    var ircFrom25To30 = irc.getDescriptionIRC(28.7, "fi");
    assert.ok(ircFrom25To30Border === 'Lievä lihavuus' && ircFrom25To30 === 'Lievä lihavuus');

    var ircFrom30To35Border = irc.getDescriptionIRC(30, "fi");
    var ircFrom30To35 = irc.getDescriptionIRC(32.3, "fi");
    assert.ok(ircFrom30To35Border === 'Merkittävä lihavuus' && ircFrom30To35 === 'Merkittävä lihavuus');

    var ircFrom35To40Border = irc.getDescriptionIRC(35, "fi");
    var ircFrom35To40 = irc.getDescriptionIRC(36.4, "fi");
    assert.ok(ircFrom35To40Border === 'Vaikea lihavuus' && ircFrom35To40 === 'Vaikea lihavuus');

    var ircOver40Border = irc.getDescriptionIRC(40, "fi");
    var ircOver40 = irc.getDescriptionIRC(100, "fi");
    assert.ok(ircOver40Border === 'Sairaalloinen lihavuus' && ircOver40 === 'Sairaalloinen lihavuus');

    return done();
};
//modificado
exports.it_should_return_correct_string_in_english_depending_on_the_irc = function(done) {

    var ircInEnglishUnder16 = irc.getDescriptionIRC(11.7, "en");
    var ircInEnglishUnder16Border = irc.getDescriptionIRC(15.9, "en");
    assert.ok(ircInEnglishUnder16 === 'Severe underweight' && ircInEnglishUnder16Border === 'Severe underweight');

    var ircInEnglishFrom16To17Border = irc.getDescriptionIRC(16.0, "en");

    var ircInEnglishFrom16To17 = irc.getDescriptionIRC(16.5, "en");
    assert.ok(ircInEnglishFrom16To17Border === 'Significant underweight' && ircInEnglishFrom16To17 === 'Significant underweight');

    var ircInEnglishFrom17To18AndAHalfBorder = irc.getDescriptionIRC(17.0, "en");
    var ircInEnglishFrom17To18AndAHalf = irc.getDescriptionIRC(18.2, "en");
    assert.ok(ircInEnglishFrom17To18AndAHalfBorder === 'Mild underweight' && ircInEnglishFrom17To18AndAHalf === 'Mild underweight');

    var ircInEnglishFrom18AndAHalfTo25Border = irc.getDescriptionIRC(18.5, "en");
    var ircInEnglishFrom18AndAHalfTo25 = irc.getDescriptionIRC(22.56, "en");
    assert.ok(ircInEnglishFrom18AndAHalfTo25Border === 'Normal weight' && ircInEnglishFrom18AndAHalfTo25 === 'Normal weight');

    var ircInEnglishFrom25To30Border = irc.getDescriptionIRC(25, "en");
    var ircInEnglishFrom25To30 = irc.getDescriptionIRC(28.7, "en");
    assert.ok(ircInEnglishFrom25To30Border === 'Slight obesity' && ircInEnglishFrom25To30 === 'Slight obesity');

    var ircInEnglishFrom30To35Border = irc.getDescriptionIRC(30, "en");
    var ircInEnglishFrom30To35 = irc.getDescriptionIRC(32.3, "en");
    assert.ok(ircInEnglishFrom30To35Border === 'Significant obesity' && ircInEnglishFrom30To35 === 'Significant obesity');

    var ircInEnglishFrom35To40Border = irc.getDescriptionIRC(35, "en");
    var ircInEnglishFrom35To40 = irc.getDescriptionIRC(36.4, "en");
    assert.ok(ircInEnglishFrom35To40Border === 'Severe obesity' && ircInEnglishFrom35To40 === 'Severe obesity');

    var ircInEnglishOver40Border = irc.getDescriptionIRC(40, "en");
    var ircInEnglishOver40 = irc.getDescriptionIRC(100, "en");
    assert.ok(ircInEnglishOver40Border === 'Patient obesity' && ircInEnglishOver40 === 'Patient obesity');

    return done();
};