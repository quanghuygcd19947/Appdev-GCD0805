const traineeVerify = function (req, res, next) {
    if (!req.session.user) {
      res.redirect("/authentication");
    }
  
    const user = req.session.user;
    if (user.Role.name != "trainee") {
      res.redirect("/authentication");
    }
  
    next();
  };
  
  module.exports = { traineeVerify };