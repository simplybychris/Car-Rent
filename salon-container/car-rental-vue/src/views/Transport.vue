<template>
  <div class="container">
    <header class="jumbotron">
      <h3 class="display-4">
        <center>{{ content }}</center>
      </h3>
    </header>
    <b-table :items="items" :fields="fields"></b-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Transport",
  data() {
    return {
      fields: [
        {
          key: "carId",
          label: "Car",
          class: "text-center",
          sortable: true,
        },
        {
          key: "date_from",
          label: "Transport date",
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
      content: "Transport",
    };
  },
  mounted() {},
  async created() {
    try {
      const res = await axios.get(
        process.env.VUE_APP_SALON_API +
          "/orders/transportOrders/" +
          process.env.VUE_APP_SALON_ID
      );
      console.log(res.data);
      let todayTransportList = [];
      for (let i = 0; i < res.data.length; i++) {
        let car = res.data;
        if (car.date_from == Date.now()) {
          todayTransportList.push(car);
        }
      }
      this.items = todayTransportList;
      console.log(todayTransportList);
      // this.items = res.data;
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    async acceptTransport() {
      await axios
        .post(process.env.VUE_APP_SALON_API + "/orders/addReservation", {
          clientId: this.$store.state.auth.user.id,
          workerId: "",
          returnSalonId: this.selectedSalon,
          statusId: "1",
          carsId: this.$route.params.id,
          date_from: this.selectedFrom,
          date_to: this.selectedTo,
        })
        .then((response) => {
          // redirect to new invoice
          console.log(response.data.id);
          this.$router.push({ path: "/myorders" });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>