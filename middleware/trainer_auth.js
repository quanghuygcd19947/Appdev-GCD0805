const trainerVerify = function (req, res, next) {
    if (!req.session.user) {
      res.redirect("/authentication");
    }
  
    const user = req.session.user;
    if (user.Role.name != "trainer") {
      res.redirect("/authentication");
    }
  
    next();
  };
  
  module.exports = { trainerVerify };