// Moved validation to Schema
const phoneValidation = (num) => {
    return /\d{2,3}-?\d{6,7}\d*/.test(num);
}

module.exports = phoneValidation