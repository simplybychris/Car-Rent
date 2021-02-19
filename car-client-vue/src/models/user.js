export default class User {
  constructor(first_name, last_name, email, password, address, PESEL) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.address = address;
    this.pesel = PESEL;
  }
}
