
exports.slugify = function(str) {
    return str.replace(/\s/g, '-',);
}

exports.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }