const moment = require('moment');

const isDate = (value) => {
    if (!value) return false;
    return moment(value).isValid();
};

module.exports = { isDate };
