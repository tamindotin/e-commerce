const checkDuplicate = async (model, field, response, id) => {
  const exist = await model.findOne({
    [field]: response,
    _id: { $ne: id },
  });

  if (exist) {
    const error = new Error(
      `A ${model.modelName.toLowerCase()} with this ${field} exists. `,
    );
    error.status = 409;
    throw error;
  }
};

export default checkDuplicate;
