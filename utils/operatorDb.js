const { Op } = require("sequelize");
const OperatorDb = (op) => {
  let operator;
  switch (`${op}`) {
    case "=":
      operator = Op.eq;
      break;
    case "!=":
      operator = Op.not;
      break;
    case "like":
      operator = Op.like;
      break;
    case "notlike":
      operator = Op.notLike;
      break;
    case ">":
      operator = Op.gt;
      break;
    case ">=":
      operator = Op.gte;
      break;
    case "<":
      operator = Op.lt;
      break;
    case "<=":
      operator = Op.lte;
      break;
    default:
      operator = Op.eq;
  }
  return operator;
};

module.exports = { OperatorDb };
