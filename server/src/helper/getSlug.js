const slugify = require("slugify");

const getSlug = (name) => {
  return slugify(name, {
    strict: true,
    lower: true,
  });
};

module.exports = getSlug;
