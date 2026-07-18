import slugify from "slugify";

const getSlug = (name) => {
  return slugify(name, {
    strict: true,
    lower: true,
  });
};

export default getSlug;
