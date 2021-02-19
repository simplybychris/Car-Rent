const sql = require("./dbconn.js");

const Status = function (status) {
    (this.name = status.name);
};

Status.getAll = (result) => {
  sql.query("SELECT * FROM status", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    console.log("statuss: ", res);
    result(null, res);
  });
};

Status.getById = function (id, result) {
  sql.query("SELECT * FROM status where id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length <= 0) {
      result({ error: "Status not found" }, null);
      return;
    }

    console.log("Found status: ", res[0]);
    result(null, res[0]);

    console.log("status_rent: ", res);
    result(null, res);
  });
};

Status.add = (newStatus, result) => {
  sql.query("INSERT INTO status SET ?", newStatus, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newStatus });
  });
};

Status.delete = (id, result) => {
  sql.query("DELETE FROM status WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted status with id: ", id);
    result(null, res);
  });
};

module.exports = Status;
