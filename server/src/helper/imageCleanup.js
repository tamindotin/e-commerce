const cleanupImages = (arr) =>
  Promise.all(arr.map((id) => cloudinary.uploader.destroy(id)));

export default cleanupImages;
