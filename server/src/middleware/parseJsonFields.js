import parseToJson from "../helper/parseToJson.js";

const parseProductFields = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (req.body[field]) {
      req.body[field] = parseToJson(req.body[field]);
    }
  }
  next();
};

export default parseProductFields;
