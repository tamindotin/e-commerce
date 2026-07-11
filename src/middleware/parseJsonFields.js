const parseToJson = require("../helper/parseToJson")

const parseProductFields = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (req.body[field]) {
      req.body[field] = parseToJson(req.body[field]);
    }
  }
  next()
}

module.exports = parseProductFields
