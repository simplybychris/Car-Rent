const sql = require("./dbconn.js");

const Car = function (car) {
  (this.carId = car.carId),
    (this.date_from = car.date_from),
    (this.date_to = car.date_to);
};

Car.getAll = (result) => {
  sql.query("SELECT * FROM cars_rent", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    console.log("cars: ", res);
    result(null, res);
  });
};

Car.getById = function (id, result) {
  sql.query(
    "SELECT date_from, date_to FROM cars_rent where carId = ?",
    id,
    function (err, res) {
      if (err) {
        result(null, err);
        return;
      }

      if (res.length == 0) {
        result({}, null);
        return;
      }

      console.log("Found cars_rent: ", res);
      result(null, res);
    }
  );
};

Car.create = (newCar, result) => {
  sql.query("INSERT INTO cars_rent SET ?", newCar, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCar });
  });
};

Car.delete = (id, result) => {
  sql.query("DELETE FROM cars_rent WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted cars_rent with id: ", id);
    result(null, res);
  });
};

module.exports = Car;
