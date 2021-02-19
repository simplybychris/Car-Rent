const sql = require("./dbconn.js");

const Order = function (order) {
  (this.clientId = order.clientId),
    (this.workerId = order.workerId),
    (this.pickupSalonId = order.pickupSalonId),
    (this.returnSalonId = order.returnSalonId),
    (this.statusId = order.statusId),
    (this.carsId = order.carsId);
};

//dodac metode update, poniewaz kierowcom beda sie dodawaly zamowienia
//bez kierowcy, oni sie beda przypisywac, dodatkowo zmiana statusu

Order.getAll = (result) => {
  sql.query(
    "SELECT orders.id, carId, date_from, date_to, returnSalonId, name FROM orders INNER JOIN cars_rent ON orders.carsId = cars_rent.id INNER JOIN status ON orders.statusId = status.id WHERE clientId != ''",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      }
      console.log("cars: ", res);
      result(null, res);
    }
  );
};

Order.updateById = (id, order, result) => {
  sql.query(
    "UPDATE orders SET clientId='" +
      order.clientId +
      "', workerId='" +
      order.workerId +
      "', returnSalonId='" +
      order.returnSalonId +
      "', statusId='" +
      order.statusId +
      "', carsId='" +
      order.carsId +
      "' WHERE id='" +
      id +
      "';",
    [order],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ error: "Customer not found" }, null);
        return;
      }

      console.log("updated customer: ", { id: id, ...order });
      result(null, { id: id, ...order });
    }
  );
};

Order.getCarsToTransport = function (salonId, result) {
  sql.query(
    "SELECT orders.id, carId, date_from, date_to, returnSalonId, name FROM orders INNER JOIN cars_rent ON orders.carsId = cars_rent.id INNER JOIN status ON orders.statusId = status.id WHERE clientId ='' AND returnSalonId ='" +
      salonId +
      "'",
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.length <= 0) {
        result({ error: "Order not found" }, null);
        return;
      }

      // console.log("Found orders: ", res);
      result(null, res);
    }
  );
};

Order.getById = function (id, result) {
  sql.query(
    "SELECT orders.id, carId, date_from, date_to, returnSalonId, name FROM orders INNER JOIN cars_rent ON orders.carsId = cars_rent.id INNER JOIN status ON orders.statusId = status.id WHERE clientId = ?",
    id,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.length <= 0) {
        result({ error: "Order not found" }, null);
        return;
      }

      console.log("Found orders: ", res);
      result(null, res);
    }
  );
};

Order.getByClientId = function (clientId, result) {
  sql.query(
    "SELECT * FROM orders where clientId = ?",
    clientId,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.length <= 0) {
        result({ error: "Client orders not found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

Order.add = (newOrder, result) => {
  sql.query("INSERT INTO orders SET ?", newOrder, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newOrder });
  });
};

Order.delete = (id, result) => {
  sql.query("DELETE FROM orders WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Deleted orders with id: ", id);
    result(null, res);
  });
};

Order.updateStatus = (id, statusId, result) => {
  sql.query(
    "UPDATE orders SET statusId='" + statusId + "' WHERE id = '" + id + "'",
    [id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("Updated order with id: ", id);
      result(null, "Updated order with id=" + id + ", status: " + statusId);
    }
  );
};

module.exports = Order;
