<template>
  <div class="container">
    <header class="jumbotron">
      <h3 class="display-4">
        <center>{{ content }}</center>
      </h3>
    </header>
    <b-table :items="items" striped :fields="fields">
      <template #cell(actions)="row">
        <b-button
          v-if="
            new Date(row.item.date_from).getDate() == new Date().getDate() &&
            row.item.name === 'To transport'
          "
          size="sm"
          class="mr-1"
          variant="primary"
          @click="acceptTransport(row.item)"
        >
          Accept
        </b-button>
      </template>
    </b-table>
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
        { key: "actions", label: "Actions" },
      ],
      items: [],
      content: "Drivers",
    };
  },
  async created() {
    try {
      const res = await axios.get(
        process.env.VUE_APP_SALON_API +
          "/orders/transportOrders/" +
          process.env.VUE_APP_SALON_ID
      );
      console.log(res.data);
      this.items = res.data;
    } catch (e) {
      console.error(e);
    }
  },
  mounted() {},
  methods: {
    async acceptTransport(order) {
      try {
        const res = await axios.post(
          process.env.VUE_APP_SALON_API + "/orders/" + order.id + "/status/" + 5
        );

        console.log(res.data);
      } catch (e) {
        console.error(e);
      }

      try {
        const res2 = await axios.post(
          process.env.VUE_APP_AUTH_API + order.carId + "/" + order.returnSalonId
        );
        console.log(res2.data);
        this.$router.go(this.$router.currentRoute);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>