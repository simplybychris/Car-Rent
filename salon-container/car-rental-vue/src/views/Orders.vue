<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <!-- Main table element -->
    <header class="jumbotron">
      <h3 class="display-4"><center>Orders</center></h3>
    </header>
    <b-table
      :items="items"
      striped
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
    >
    </b-table>

    <!-- Info modal -->
  </b-container>
</template>
<script>
import axios from "axios";
export default {
  name: "Orders",
  data() {
    return {
      items: [],
      fields: [
        {
          key: "id",
          label: "Order",
          sortable: true,
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
        },
      ],
    };
  },
  async created() {
    try {
      const res = await axios.get(process.env.VUE_APP_SALON_API + "/orders");
      console.log(res.data);
      this.items = res.data;
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>