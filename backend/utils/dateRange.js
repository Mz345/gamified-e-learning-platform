exports.getRangeStart = (type) => {
  const now = new Date();
  if (type === "daily") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (type === "weekly") {
    const day = now.getDay(); // Sunday = 0
    return new Date(now.setDate(now.getDate() - day));
  }
  if (type === "monthly") return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(0); // default: return earliest possible
};
