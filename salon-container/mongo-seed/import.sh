#! /bin/bash
mongoimport --host mongodb --db cluster0 --collection cars --type json --file /mongo-seed/cars.json --jsonArray
mongoimport --host mongodb --db cluster0 --collection users --type json --file /mongo-seed/users.json --jsonArray
mongoimport --host mongodb --db cluster0 --collection salons --type json --file /mongo-seed/salons.json --jsonArray
mongoimport --host mongodb --db cluster0 --collection workers --type json --file /mongo-seed/workers.json --jsonArray