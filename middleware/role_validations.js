export const isKasir = async (req, res, next) => {
  const roleUser = req.users.role;
  if (roleUser == "Kasir") {
    next();
  } else {
    res.status(406).json({
      Succes: false,
      Authorize: false,
      Information: "You Are Not Kasir!",
    });
  }
};
export const isAdmin = async (req, res, next) => {
  const roleUser = req.users.role;
  if (roleUser == "Admin") {
    next();
  } else {
    res.status(406).json({
      Succes: false,
      Authorize: false,
      Information: "You Are Not Admin!",
    });
  }
};
