<template>
  <b-container fluid>
    <header class="jumbotron">
      <b-container class="search-box">
        <b-form class="search" @submit.stop.prevent="onSubmit">
          <h3 class="display-4">
            <center>{{ content }}</center>
          </h3>
          <b-form inline>
            <div class="w-50 p-2">
              <label class="text-left" for="datepicker_from"
                >Pick-up date</label
              >
              <b-form-datepicker
                id="datepicker_from"
                name="datepicker_from"
                v-model="form.date_from"
                v-validate="{ required: true }"
                class="mb-2"
                :min="date"
                :state="validateState('datepicker_from')"
                aria-describedby="datepicker_from"
                ata-vv-as="Pick-up date"
              ></b-form-datepicker>
              <b-form-invalid-feedback id="datepicker_from">{{
                veeErrors.first("datepicker_from")
              }}</b-form-invalid-feedback>
            </div>
            <div class="w-50 p-2">
              <label class="text-left" for="datepicker_to">Drop-off date</label>
              <b-form-datepicker
                id="datepicker_to"
                name="datepicker_to"
                v-model="form.date_to"
                v-validate="{ required: true }"
                class="mb-2"
                :min="date"
                :state="validateState('datepicker_to')"
                aria-describedby="datepicker_to"
                ata-vv-as="Drop-off date"
              ></b-form-datepicker>
              <b-form-invalid-feedback id="datepicker_to">{{
                veeErrors.first("datepicker_to")
              }}</b-form-invalid-feedback>
            </div>
          </b-form>
          <b-form inline>
            <div class="w-50 p-2">
              <label class="text-left" for="salon_picker">Pick-up salon</label>
              <b-form-select
                id="salon_picker"
                name="salon_picker"
                v-model="form.pickupSalonId"
                v-validate="{ required: true }"
                :options="salons"
                class="mb-2"
                :state="validateState('salon_picker')"
                aria-describedby="salon_picker"
                ata-vv-as="Pick-up salon"
              ></b-form-select>
              <b-form-invalid-feedback id="salon_picker">{{
                veeErrors.first("salon_picker")
              }}</b-form-invalid-feedback>
            </div>
            <div class="w-50 p-2">
              <label class="text-left" for="salon_picker2">Return salon</label>
              <b-form-select
                id="salon_picker2"
                name="salon_picker2"
                v-model="form.returnSalonId"
                v-validate="{ required: true }"
                :options="salons"
                class="mb-2"
                :state="validateState('salon_picker2')"
                aria-describedby="salon_picker2"
                ata-vv-as="Return salon"
              ></b-form-select>
              <b-form-invalid-feedback id="salon_picker2">{{
                veeErrors.first("salon_picker2")
              }}</b-form-invalid-feedback>
            </div>
          </b-form>
          <b-button type="submit" variant="success" size="lg"
            ><b>Find Car</b></b-button
          >
        </b-form>
      </b-container>
    </header>
    <!-- User Interface controls -->
    <b-row v-if="carsFound">
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Sort"
          label-for="sort-by-select"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
          v-slot="{ ariaDescribedby }"
        >
          <b-input-group size="sm">
            <b-form-select
              id="sort-by-select"
              v-model="sortBy"
              :options="sortOptions"
              :aria-describedby="ariaDescribedby"
              class="w-75"
            >
              <template #first>
                <option value="">-- none --</option>
              </template>
            </b-form-select>

            <b-form-select
              v-model="sortDesc"
              :disabled="!sortBy"
              :aria-describedby="ariaDescribedby"
              size="sm"
              class="w-25"
            >
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Initial sort"
          label-for="initial-sort-select"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="initial-sort-select"
            v-model="sortDirection"
            :options="['asc', 'desc', 'last']"
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      v-if="carsFound"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
    >
      <template #cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template #cell(actions)="row">
        <b-button
          size="sm"
          class="mr-1"
          @click="addOrder(row.item)"
          variant="success"
        >
          Reserve
        </b-button>
        <!-- <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button> -->
      </template>

      <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">
              {{ key }}: {{ value }}
            </li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <!-- Info modal -->
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      items: [],
      salons: [],
      carsFound: 0,
      date: new Date(),
      form: {
        date_from: null,
        date_to: null,
        pickupSalonId: null,
        returnSalonId: null,
      },
      fields: [
        {
          key: "Brand",
          label: "Brand",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "Model",
          label: "Model",
          sortable: true,
        },
        {
          key: "Year",
          label: "Year",
          sortable: true,
        },
        {
          key: "Capacity",
          label: "Capacity",
          sortable: true,
        },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: "Show a lot",
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      content: "Search car",
    };
  },
  async created() {
    try {
      const res = await axios.get(process.env.VUE_APP_AUTH_API + "/salons");
      let salonsList = res.data;
      this.salons = salonsList.map((item) => {
        let obj = {};
        obj["value"] = item._id;
        obj["text"] = item.Name;
        return obj;
      });
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
    let dateNew = new Date();
    dateNew.setDate(dateNew.getDate() + 1);
    this.date = dateNew;
  },
  methods: {
    validateState(ref) {
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].dirty || this.veeFields[ref].validated)
      ) {
        return !this.veeErrors.has(ref);
      }
      return null;
    },
    onSubmit() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }

        this.searchCar();
      });
    },
    async searchCar() {
      let one = process.env.VUE_APP_BROWSER_API + "/cars";
      let two = process.env.VUE_APP_SALON_API + "/cars";

      const requestOne = axios.get(one);
      const requestTwo = axios.get(two);

      try {
        const res = await axios.all([requestOne, requestTwo]).then(
          axios.spread((...responses) => {
            let responseOne = responses[0]["data"];
            const responseTwo = responses[1]["data"];

            // use/access the results
            function renameKey(obj, oldKey, newKey) {
              obj[newKey] = obj[oldKey];
              delete obj[oldKey];
            }

            const arr = responseOne;
            arr.forEach((obj) => renameKey(obj, "_id", "carId"));
            responseOne = arr;

            for (let i = 0; i < responseOne.length; i++) {
              responseOne[i]["reservation_date"] = [];
              for (let j = 0; j < responseTwo.length; j++) {
                if (responseOne[i].carId == responseTwo[j].carId) {
                  responseOne[i]["reservation_date"].push(responseTwo[j]);
                }
              }
            }
            let isReserved;
            let selectedCars = [];
            //iterate through cars
            for (let i = 0; i < responseOne.length; i++) {
              let car = responseOne[i];
              //iterate through reservation dates
              isReserved = false;
              if (car["reservation_date"].length != 0) {
                for (
                  let j = 0;
                  j < responseOne[i]["reservation_date"].length;
                  j++
                ) {
                  let carsDateFrom =
                    responseOne[i]["reservation_date"][j]["date_from"];
                  let date = new Date(carsDateFrom);
                  const offset = date.getTimezoneOffset();
                  date = new Date(date.getTime() - offset * 60 * 1000);
                  let formatedDateFrom = date.toISOString().split("T")[0];

                  let carsDateTo =
                    responseOne[i]["reservation_date"][j]["date_to"];
                  date = new Date(carsDateTo);
                  date = new Date(date.getTime() - offset * 60 * 1000);
                  let formatedDateTo = date.toISOString().split("T")[0];
                  if (
                    this.form.date_from <= formatedDateTo &&
                    this.form.date_to >= formatedDateFrom
                  ) {
                    isReserved = true;
                    break;
                  } else {
                    if (
                      selectedCars.filter((e) => e.carId === car.carId).length >
                      0
                    ) {
                      console.log("auto juz dodane");
                      isReserved = true;
                      break;
                    }
                  }
                  console.log("nie weszlo w breaka");
                }
                if (!isReserved) {
                  selectedCars.push(responseOne[i]);
                  isReserved = false;
                }
              } else {
                console.log("=nie ma rezerwacji");
                selectedCars.push(responseOne[i]);
              }
            }

            return selectedCars;
          })
        );
        this.items = res;
        this.carsFound = 1;
      } catch (e) {
        this.carsFound = 0;
        console.error(e);
      }
    },
    run(id) {
      this.$store.dispatch("auth/setCarsDate", id).then(
        () => {
          this.$router.push("/book/" + id);
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    },
    async addOrder(car) {
      await axios
        .post(process.env.VUE_APP_SALON_API + "/orders/addReservation", {
          clientId: this.$store.state.auth.user.id,
          workerId: "",
          pickupSalonId: this.form.pickupSalonId,
          returnSalonId: this.form.returnSalonId,
          statusId: "1",
          carsId: car.carId,
          carSalonId: car.SalonId,
          date_from: this.form.date_from,
          date_to: this.form.date_to,
        })
        .then((response) => {
          // redirect to new invoice
          this.$router.push({ path: "/orders" });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
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

<style>
header {
  background-image: url("../assets/car-background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.search-box {
  margin: auto 0;
  padding: 10px 120px !important;
}
.search .b-form-datepicker,
.search .custom-select {
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
}

.jumbotron {
  border-radius: 0 0 5px 5px !important;
}

.search {
  background-color: #fad130;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
}

#salon_picker,
#salon_picker2 {
  width: 100%;
  padding-left: 10px;
}
</style>