const nextVisitSeries = async () => {
  const date =
    new Date().getFullYear().toString() +
    paddy(new Date().getMonth() + 1, 2).toString();
  const lastVisit = await db.visits.findOne({
    where: { name: { [Op.like]: `%${paddy(req.body.id_branch, 3)}${date}%` } },
    order: [["name", "DESC"]],
  });

  let isName = "";
  if (lastVisit) {
    let masterNumber = parseInt(
      lastVisit.name.substr(9, lastVisit.name.length)
    );

    isName =
      "VST" +
      paddy(req.body.id_branch, 3) +
      date +
      paddy(masterNumber + 1, 5).toString();
  } else {
    isName =
      "VST" + paddy(req.body.id_branch, 3) + date + paddy(1, 5).toString();
  }
  return isName;
};

module.exports = nextVisitSeries;
