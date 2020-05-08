const descriptions = require('../weightDescriptions.json');

const readDescriptionIRC = (lang, index) => descriptions[lang][index];

module.exports = class Patient {
    constructor(weight, height, patientInfo) {
        this.weight = weight;
        this.height = height;
        this.patientInfo = patientInfo;
    }

    // public methods

    computePotentialRisk(reductions, score) {
        let computedScore;
        let lowestScore;
        let reducedTotalScore = 0;
        if (score === 'ten') {
            computedScore = this.computeTenYearScore(this.patientInfo);
            lowestScore = this.computeLowestTenYear();
        } else {
            computedScore = this.computeLifetimeRisk(this.patientInfo);
            lowestScore = this.computeLowestLifetime();
        }
        for (let i = 0; i < reductions.length; i += 1) {
            if (reductions[i] === 'statin') {
                reducedTotalScore += (computedScore * 0.25);
            } else if (reductions[i] === 'sysBP') {
                const sysBPCalculation = computedScore - (computedScore *
                    (0.7 ** ((this.patientInfo.systolicBloodPressure - 140) / 10)));
                reducedTotalScore += sysBPCalculation;
            } else if (reductions[i] === 'aspirin') {
                reducedTotalScore += (computedScore * 0.1);
            } else if (reductions[i] === 'smoker') {
                reducedTotalScore += (computedScore * 0.15);
            }
        }
        if (Math.round((computedScore - reducedTotalScore) * 10) / 10 <= lowestScore) {
            return Math.round((computedScore - lowestScore) * 10) / 10;
        }
        return Math.round(reducedTotalScore * 10) / 10;
    }

    getIndexIRC(unit = 'imperial') {
        switch (unit) {
            case 'metric':
                if (typeof(this.weight) === 'number' && typeof(this.height) === 'number') {
                    return weight / (height * height);
                }
                break;
            case 'imperial':
                // length in inches
                // weight in pounds
                if (typeof(this.weight) === 'number' && typeof(this.height) === 'number') {
                    return this.weight * 703 / (this.height * this.height);
                }
                break;
            default:
                throw "Unit not allowed";
        }
    }

    static getDescriptionIRC(index, lang) {
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

    computeTenYearScore(patientInfo) {
        if (patientInfo.age < 40 || patientInfo.age > 79) { return null; }

        const lnAge = Math.log(patientInfo.age);
        const lnTotalChol = Math.log(patientInfo.totalCholesterol);
        const lnHdl = Math.log(patientInfo.hdl);
        const trlnsbp = patientInfo.relatedFactors.hypertensive ?
            Math.log(parseFloat(patientInfo.systolicBloodPressure)) : 0;
        const ntlnsbp = patientInfo.relatedFactors.hypertensive ?
            0 : Math.log(parseFloat(patientInfo.systolicBloodPressure));
        const ageTotalChol = lnAge * lnTotalChol;
        const ageHdl = lnAge * lnHdl;
        const agetSbp = lnAge * trlnsbp;
        const agentSbp = lnAge * ntlnsbp;
        const ageSmoke = patientInfo.relatedFactors.smoker ? lnAge : 0;

        const isAA = patientInfo.relatedFactors.race === 'aa';
        const isMale = patientInfo.gender === 'male';
        let s010Ret = 0;
        let mnxbRet = 0;
        let predictRet = 0;

        const calculateScore = () => {
            if (isAA && !isMale) {
                s010Ret = 0.95334;
                mnxbRet = 86.6081;
                predictRet = (17.1141 * lnAge) + (0.9396 * lnTotalChol) + (-18.9196 * lnHdl) +
                    (4.4748 * ageHdl) + (29.2907 * trlnsbp) + (-6.4321 * agetSbp) + (27.8197 * ntlnsbp) +
                    (-6.0873 * agentSbp) + (0.6908 * Number(patientInfo.relatedFactors.smoker)) +
                    (0.8738 * Number(patientInfo.relatedFactors.diabetic));
            } else if (!isAA && !isMale) {
                s010Ret = 0.96652;
                mnxbRet = -29.1817;
                predictRet = (-29.799 * lnAge) + (4.884 * (lnAge ** 2)) + (13.54 * lnTotalChol) +
                    (-3.114 * ageTotalChol) + (-13.578 * lnHdl) + (3.149 * ageHdl) + (2.019 * trlnsbp) +
                    (1.957 * ntlnsbp) + (7.574 * Number(patientInfo.relatedFactors.smoker)) +
                    (-1.665 * ageSmoke) + (0.661 * Number(patientInfo.relatedFactors.diabetic));
            } else if (isAA && isMale) {
                s010Ret = 0.89536;
                mnxbRet = 19.5425;
                predictRet = (2.469 * lnAge) + (0.302 * lnTotalChol) + (-0.307 * lnHdl) +
                    (1.916 * trlnsbp) + (1.809 * ntlnsbp) + (0.549 *
                        Number(patientInfo.relatedFactors.smoker)) +
                    (0.645 * Number(patientInfo.relatedFactors.diabetic));
            } else {
                s010Ret = 0.91436;
                mnxbRet = 61.1816;
                predictRet = (12.344 * lnAge) + (11.853 * lnTotalChol) + (-2.664 * ageTotalChol) +
                    (-7.99 * lnHdl) + (1.769 * ageHdl) + (1.797 * trlnsbp) + (1.764 * ntlnsbp) +
                    (7.837 * Number(patientInfo.relatedFactors.smoker)) + (-1.795 * ageSmoke) +
                    (0.658 * Number(patientInfo.relatedFactors.diabetic));
            }

            const pct = (1 - (s010Ret ** Math.exp(predictRet - mnxbRet)));
            return Math.round((pct * 100) * 10) / 10;
        };
        return calculateScore();
    }

    computeLifetimeRisk() {
        if (this.patientInfo.age < 20 || this.patientInfo.age > 59) { return null; }
        let ascvdRisk = 0;
        const params = {
            male: {
                major2: 69,
                major1: 50,
                elevated: 46,
                notOptimal: 36,
                allOptimal: 5,
            },
            female: {
                major2: 50,
                major1: 39,
                elevated: 39,
                notOptimal: 27,
                allOptimal: 8,
            },
        };

        const major = (this.patientInfo.totalCholesterol >= 240 ? 1 : 0) +
            ((this.patientInfo.systolicBloodPressure >= 160 ? 1 : 0) +
                (this.patientInfo.relatedFactors.hypertensive ? 1 : 0)) +
            (this.patientInfo.relatedFactors.smoker ? 1 : 0) +
            (this.patientInfo.relatedFactors.diabetic ? 1 : 0);
        const elevated = ((((this.patientInfo.totalCholesterol >= 200 &&
                    this.patientInfo.totalCholesterol < 240) ? 1 : 0) +
                ((this.patientInfo.systolicBloodPressure >= 140 &&
                    this.patientInfo.systolicBloodPressure < 160 &&
                    this.patientInfo.relatedFactors.hypertensive === false) ? 1 : 0)) >= 1 ? 1 : 0) *
            (major === 0 ? 1 : 0);
        const allOptimal = (((this.patientInfo.totalCholesterol < 180 ? 1 : 0) +
                ((this.patientInfo.systolicBloodPressure < 120 ? 1 : 0) *
                    (this.patientInfo.relatedFactors.hypertensive ? 0 : 1))) === 2 ? 1 : 0) *
            (major === 0 ? 1 : 0);
        const notOptimal = ((((this.patientInfo.totalCholesterol >= 180 &&
                    this.patientInfo.totalCholesterol < 200) ? 1 : 0) +
                ((this.patientInfo.systolicBloodPressure >= 120 &&
                    this.patientInfo.systolicBloodPressure < 140 &&
                    this.patientInfo.relatedFactors.hypertensive === false) ? 1 : 0)) *
            (elevated === 0 ? 1 : 0) * (major === 0 ? 1 : 0)) >= 1 ? 1 : 0;

        if (major > 1) { ascvdRisk = params[this.patientInfo.gender].major2; }
        if (major === 1) { ascvdRisk = params[this.patientInfo.gender].major1; }
        if (elevated === 1) { ascvdRisk = params[this.patientInfo.gender].elevated; }
        if (notOptimal === 1) { ascvdRisk = params[this.patientInfo.gender].notOptimal; }
        if (allOptimal === 1) { ascvdRisk = params[this.patientInfo.gender].allOptimal; }

        return ascvdRisk;
    }

    computeLowestTenYear() {
        const patientInfoCopy = Object.assign({}, this.patientInfo);
        patientInfoCopy.systolicBloodPressure = 90;
        patientInfoCopy.totalCholesterol = 130;
        patientInfoCopy.hdl = 100;
        const relatedFactorsCopy = Object.assign({}, this.patientInfo.relatedFactors);
        relatedFactorsCopy.diabetic = false;
        relatedFactorsCopy.smoker = false;
        relatedFactorsCopy.hypertensive = false;
        patientInfoCopy.relatedFactors = relatedFactorsCopy;
        return this.computeTenYearScore(patientInfoCopy);
    };



};