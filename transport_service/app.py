from flask import Flask, Response
import json
import pip._vendor.requests
from pip._vendor import requests
import os
app = Flask(__name__)

auth = os.environ['auth_service_url']

# Base route


@app.route("/")
def base():
    return Response(response=json.dumps({"Status": "Server is up"}),
                    status=200,
                    mimetype='application/json')


# Transport car
@app.route("/transport/<car_id>/<salon_id>", methods=["PUT"])
def transportCar(car_id, salon_id):
    req = requests.put(str(auth)+"/cars/" +
                       str(car_id)+"/"+str(salon_id))
    return req.content


if __name__ == '__main__':
    app.run(debug=True, port=5001, host='localhost')
