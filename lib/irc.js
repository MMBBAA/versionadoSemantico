module.exports = {
    getIndexIRC: function getIndexIRC(weight, height, unit = 'imperial') {
        switch (unit) {
            case 'metric':

                if (typeof(weight) === 'number' && typeof(height) === 'number') {
                    return weight / (height * height);
                }
                break;
            case 'imperial':
                // length in inches

                // weight in pounds
                if (typeof(weight) === 'number' && typeof(height) === 'number') {
                    return weight * 703 / (height * height);
                }
                break;
        }
    },

    getDescriptionIRC: function getDescriptionIRC(index, lang) {
        if (index < 16) {
            return readDescriptionIRC(lang, 0);
        } else if (index < 17) {
            return readDescriptionIRC(lang, 1);
        } else if (index < 18.5) {
            return readDescriptionIRC(lang, 2);
        } else if (index < 25.0) {
            return readDescriptionIRC(lang, 3);
        } else if (index < 30.0) {
            return readDescriptionIRC(lang, 4);
        } else if (index < 35) {
            return readDescriptionIRC(lang, 5);
        } else if (index < 40) {
            return readDescriptionIRC(lang, 6);
        } else {
            return readDescriptionIRC(lang, 7);
        }
    }
};

function readDescriptionIRC(lang, index) {
    var descriptions = require('../weightDescriptions.json');

    return descriptions[lang][index];
}