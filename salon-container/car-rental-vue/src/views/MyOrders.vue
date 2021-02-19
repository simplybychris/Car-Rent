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
      const res = await axios.get(
        process.env.VUE_APP_SALON_API +
          "/orders/" +
          this.$store.state.auth.user.id
      );
      console.log(res.data);
      this.items = res.data;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>