let { genSalt, hash, compare } = require("bcryptjs");
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.hash = password => {
    return genSalt().then(salt => {
        return hash(password, salt);
    });
};

module.exports.compare = (password, hash) => {
    console.log("bcrypt compare");
    return compare(password, hash).then(bool => {
        if (!bool) {
            throw new Error("error in compare");
        }
    });
};
