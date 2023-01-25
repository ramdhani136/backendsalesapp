const { OperatorDb } = require("./operatorDb");

const GetFilter =  (filters) => {
  let finalfilter = [];
  if (filters.length > 0) {
    for (let filter of filters) {
      let data = {};
      data[filter[0]] = {
        [OperatorDb(filter[1])]:
          filter[1] === "like" || filter[1] === "notlike"
            ? `%${filter[2]}%`
            : `${filter[2]}`,
      };

      let isduplicate = finalfilter.filter((item) => item[`${filter[0]}`]);
      if (isduplicate.length === 0) {
        finalfilter.push(data);
      }
    }
  }
  return finalfilter;
};

module.exports = GetFilter;
