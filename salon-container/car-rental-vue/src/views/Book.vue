<template>
  <div class="container">
    <header class="jumbotron">
      <h3 class="display-4">
        <center>{{ content }}</center>
      </h3>
      <b-form inline>
        <div class="w-50">
          <label class="text-left" for="datepicker_from">Pick-up date</label>
          <b-form-datepicker
            id="datepicker_from"
            v-model="selectedFrom"
            class="mb-2"
          ></b-form-datepicker>
        </div>
        <div class="w-50">
          <label class="text-left" for="datepicker_to">Drop-off date</label>
          <b-form-datepicker
            id="datepicker_to"
            v-model="selectedTo"
            class="mb-2"
          ></b-form-datepicker>
        </div>
      </b-form>
      <div class="w-50 mb-2">
        <label for="salon_picker">Salon to return</label>
        <b-form-select
          id="salon_picker"
          w-25
          v-model="selectedSalon"
          :options="salons"
        ></b-form-select>
      </div>
      <b-button @click="addOrder()" variant="success" size="lg"
        >Reserve</b-button
      >
    </header>
    <b-calendar :date-info-fn="dateClass" block locale="en-US"></b-calendar>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Book",
  data() {
    return {
      carId: this.$route.params.id,
      selectedFrom: null,
      selectedTo: null,
      selectedSalon: "select salon to return",
      salons: [],
      items: [],
      content: "Book car",
    };
  },
  mounted() {},
  async created() {
    try {
      const res = await axios.get(process.env.VUE_APP_AUTH_API + "/salons");
      let salonsList = res.data;
      this.salons = salonsList.map((item) => {
        let obj = {};
        console.log(obj);
        obj["value"] = item._id;
        obj["text"] = item.Name;
        return obj;
      });
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    dateClass(ymd) {
      let command = "";
      // console.log("date: ", day, ", ymd = ", ymd);
      let array = this.$store.state.auth.carsDate;
      console.log("array: ", array);
      // console.log("ofsset: ", offset);
      array.forEach(function (item) {
        // console.log("item date from: ", item.date_from);//
        let from = item.date_from;
        let date = new Date(from);
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - offset * 60 * 1000);
        from = date.toISOString().split("T")[0];

        let to = item.date_to;
        date = new Date(to);
        date = new Date(date.getTime() - offset * 60 * 1000);
        to = date.toISOString().split("T")[0];
        console.log("date from: ", from, "  date to: ", to);
        // console.log("FROM: ", from, "TO: ", to);
        if (ymd >= from && ymd <= to) {
          console.log("ymd: ", ymd, " == from:", from, " == to:", to);
          command = "table-warning";
        }
      });
      return command;
    },
    async addOrder() {
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
    // async initializeData() {
    //   try {
    //     const res = await axios.get(
    //       process.env.VUE_APP_SALON_API + "/cars/" + this.$route.params.id
    //     );
    //     console.log("res data: ", res.data);
    //     this.items = await res.data;
    //     console.log("items: ", this.items);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // },
  },
};
</script>