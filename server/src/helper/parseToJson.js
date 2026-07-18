const parseToJson = (field) => {
  try {
    return typeof field === "string" ? JSON.parse(field) : field;
  } catch {
    const error = new Error(`Invalid ${field} format.`);
    error.status = 400;
    throw error;
  }
};

export default parseToJson;
