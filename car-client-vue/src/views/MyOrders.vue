<template>
  <div class="container-fluid bg-red">
    <header class="jumbotron">
      <h3 class="display-4">
        <center>{{ content }}</center>
      </h3>
    </header>
    <b-table :items="items" striped :fields="fields"></b-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Drivers",
  data() {
    return {
      fields: [
        {
          key: "id",
          label: "Order no",
        },
        {
          key: "carId",
          label: "Car",
          class: "text-center",
          sortable: true,
        },
        {
          key: "date_from",
          label: "Date from",
          class: "text-center",
          formatter: (value) => {
            let date = new Date(value);
            const offset = date.getTimezoneOffset();
            date = new Date(date.getTime() - offset * 60 * 1000);
            return date.toISOString().split("T")[0];
          },
          sortable: true,
        },
        {
          key: "date_to",
          label: "Date to",
          class: "text-center",
          formatter: (value) => {
            let date = new Date(value);
            const offset = date.getTimezoneOffset();
            date = new Date(date.getTime() - offset * 60 * 1000);
            return date.toISOString().split("T")[0];
          },
          sortable: true,
        },
        {
          key: "returnSalonId",
          label: "Return Salon",
          class: "text-center",
        },
        {
          key: "name",
          label: "Status",
          class: "text-center",
        },
      ],
      items: [],
      content: "Your orders",
    };
  },
  mounted() {},
  async created() {
    try {
      let one =
        process.env.VUE_APP_SALON_API +
        "/orders/" +
        this.$store.state.auth.user.id;
      let two = process.env.VUE_APP_AUTH_API + "/cars";
      let three = process.env.VUE_APP_AUTH_API + "/salons";

      const requestOne = axios.get(one);
      const requestTwo = axios.get(two);
      const requestThree = axios.get(three);

      const res = await axios.all([requestOne, requestTwo, requestThree]).then(
        axios.spread((...responses) => {
          let responseOne = responses[0]["data"];
          const responseTwo = responses[1]["data"];
          const responseThree = responses[2]["data"];

          console.log("responseTwo: ", responseTwo);

          for (let i = 0; i < responseOne.length; i++) {
            for (let j = 0; j < responseTwo.length; j++) {
              if (responseOne[i].carId === responseTwo[j]._id) {
                responseOne[i].carId =
                  responseTwo[j].Brand +
                  " " +
                  responseTwo[j].Model +
                  ", " +
                  responseTwo[j].Year;
              }
            }

            for (let k = 0; k < responseThree.length; k++) {
              if (responseOne[i].returnSalonId === responseThree[k]._id) {
                responseOne[i].returnSalonId = responseThree[k].Name;
              }
            }
          }

          console.log("response: ", responseOne);
          return responseOne;
        })
      );
      this.items = res;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>