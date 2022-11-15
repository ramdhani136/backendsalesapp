const jwt = require("jsonwebtoken");

const PermissionData = (req, res, next) => {
  const authHeader = req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.username = decoded.username;
    const role = decoded.role;
    req.userId = decoded.userId;
    const relate = [];
    for (let i = 0; i < role.length; i++) {
      if (role[i].roleprofile.status) {
        const ada = role[i].roleprofile.rolelist.filter((role) => {
          switch (req.baseUrl) {
            case "/visit":
              return role.doc == "visit";
              break;
            case "/callsheet":
              return role.doc == "callsheet";
              break;
            case "/branch":
              return role.doc == "branch";
              break;
            case "/customer":
              return role.doc == "customer";
              break;
            case "/customergroup":
              return role.doc == "customerGroup";
              break;
            case "/device":
              return role.doc == "device";
              break;
            case "/roleprofile":
              return role.doc == "roleprofile";
              break;
            case "/users":
              return role.doc == "user";
              break;
            case "/rolelist":
              return role.doc == "rolelist";
              break;
            case "/roleuser":
              return role.doc == "roleuser";
              break;
            case "/permission":
              return role.doc == "permission";
            case "/contact":
              return role.doc == "contact";
            case "/notif":
              return role.doc == "notif";
              break;
          }
        });

        if (ada.length > 0) {
          relate.push(ada[0]);
        }
      }
    }

    const isValid = relate.filter((valid) => {
      switch (req.method) {
        case "POST":
          return valid.create;
          break;
        case "GET":
          return valid.read;
          break;
        case "PUT":
          return valid.update;
          break;
        case "DELETE":
          return valid.delete;
          break;
        default:
          res
            .status(403)
            .json({ status: false, message: "Permission denied." });
          break;
      }
    });
    if (isValid.length > 0) {
      next();
    } else {
      res.status(403).json({ status: false, message: "Permission denied." });
    }
  });
};

module.exports = { PermissionData };
