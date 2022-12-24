<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <template v-if="!isLoading">
    <div class="card mb-3">
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col d-flex">
            <h4 class="mb-0">
              <span class="text-muted">{{ pagination.total }} Countries</span>
            </h4>
          </div>
          <div class="col-lg-5 align-items-center">
            <div class="d-flex items-center">
              <input
                class="px-2 border form-control form-search-control bg-white"
                v-model="inputSearch"
                v-on:keyup.enter="
                  loadCountries({
                    searchBy: 'name',
                    searchParam: inputSearch,
                  })
                "
              />
              <button
                class="px-3 border bg-primary rounded-right"
                @click="
                  loadCountries({
                    searchBy: 'name',
                    searchParam: inputSearch,
                  })
                "
              >
                <i class="fa fa-search text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-responsive table-sm">
        <base-table thead-classes="thead-light" :data="countries">
          <template v-slot:columns>
            <th class="col-1">Flags</th>
            <th class="cursor-pointer" @click="onSort()">
              Name<i
                class="fa ml-3"
                :class="sortedbyASC ? 'fa-chevron-down' : 'fa-chevron-up'"
                @click="onSort()"
              ></i>
            </th>
            <th class="col-1">cca2</th>
            <th class="col-1">cca3</th>
            <th class="col-1">Native Country Name</th>
            <th class="col-3">Alternative Country Name</th>
            <th class="col-2">Country Calling Codes</th>
          </template>
          <template v-slot:default="row">
            <th
              scope="row"
              class="align-middle cursor-pointer"
              @click="openDetailModal(row.item.name.official)"
            >
              <img
                :src="row.item.flags.png"
                :alt="row.item.name.official"
                width="40"
              />
            </th>
            <td
              class="cursor-pointer"
              @click="openDetailModal(row.item.name.official)"
            >
              <span class="font-weight-700">{{ row.item.name.official }}</span>
            </td>
            <td>
              {{ row.item.cca2 }}
            </td>
            <td>
              {{ row.item.cca3 }}
            </td>
            <td>
              {{
                row.item.name.nativeName && row.item.name.nativeName.zho
                  ? row.item.name.nativeName.zho.official
                  : "-"
              }}
            </td>
            <td>{{ row.item.altSpellings ? row.item.altSpellings : "-" }}</td>
            <td>{{ row.item.idd ? row.item.idd : "-" }}</td>
          </template>
        </base-table>
      </div>
      <div v-if="pagination.total === 0" class="text-center p-5">
        Empty Data
      </div>
    </div>
    <div v-if="pagination && pagination.total_pages !== 1">
      <base-pagination
        :total="pagination.total"
        :perPage="pagination.pageSize"
        :value="current_page"
        @input="onPaginationClicked"
        align="center"
        size="sm"
      ></base-pagination>
    </div>
  </template>
  <modal
    v-model:show="detailModal"
    gradient="secondary"
    modal-classes="modal-secondary modal-dialog-centered"
  >
    <template v-slot:header>
      <h4 class="modal-title" id="modal-title-notification">Info</h4>
    </template>
    <div class="country-details">
      <img
        class="country-details-img mr-3"
        :src="countryDetail.flags?.svg"
        alt=""
      />
      <div class="country-info">
        <h3 class="primary-title">{{ countryDetail.name?.common }}</h3>
        <p class="primary-message">
          <span class="highLight">Official name:</span
          >{{ countryDetail.name?.official }}
        </p>
        <p class="primary-message">
          <span class="highLight">Population:</span
          >{{ countryDetail.population }}
        </p>
        <p class="primary-message">
          <span class="highLight">Region:</span>{{ countryDetail.region }}
        </p>
        <p class="primary-message">
          <span class="highLight">Sub region:</span
          >{{ countryDetail.subregion }}
        </p>
        <p class="primary-message">
          <span class="highLight">Capital:</span>{{ countryDetail.capital }}
        </p>
      </div>
    </div>
    <div class="card card-body mt-3">
      <pre><code>{{ countryDetail }}</code></pre>
    </div>
    <template v-slot:footer>
      <base-button type="link" class="ml-auto" @click="detailModal = false">
        Close
      </base-button>
    </template>
  </modal>
</template>

<script>
import CountryService from "../../services/country.service.js";

export default {
  name: "countries-table",
  components: {},
  data() {
    return {
      countries: [],
      countryDetail: {},
      pagination: {},
      current_page: 1,
      isLoading: true,
      sortedbyASC: false,
      detailModal: false,
      inputSearch: "",
    };
  },
  mounted() {
    this.loadCountries();
  },
  methods: {
    openDetailModal(value) {
      CountryService.getCountryByName(value, { fullText: true }).then(
        (item) => {
          this.countryDetail = item.data[0];
          this.detailModal = true;
        }
      );
    },
    onPaginationClicked(page) {
      this.current_page = page;
      this.countries = JSON.parse(localStorage.getItem("countryList"))
        .map((country, i) => ({ id: i + 1, ...country }))
        .slice(
          (page - 1) * this.pagination.pageSize,
          (page - 1) * this.pagination.pageSize + this.pagination.pageSize
        );
        console.log(this.countries)
    },
    loadCountries(searchParam) {
      this.isLoading = true;
      const query = Object.assign({
        fields: "flags,name,cca2,cca3,altSpellings,idd",
      });
      CountryService.getCountries(query, searchParam).then(
        (res) => {
          const total = res.data.length;
          const pageSize = 25;
          this.pagination = {
            pageSize: pageSize,
            total_pages: Math.ceil(total / pageSize) || 1,
            total: total,
          };
          localStorage.setItem("countryList", JSON.stringify(res.data));
          this.onSort();
          this.isLoading = false;
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
    onSort() {
      const data = JSON.parse(localStorage.getItem("countryList"));
      if (this.sortedbyASC) {
        data.sort((x, y) => (x["name"].official > y["name"].official ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        data.sort((x, y) => (x["name"].official < y["name"].official ? -1 : 1));
        this.sortedbyASC = true;
      }
      localStorage.setItem("countryList", JSON.stringify(data));
      this.onPaginationClicked(this.current_page);
    },
  },
};
</script>
<style scoped>
.form-search-control {
  height: 2.5rem !important;
  border-radius: 0.375rem 0 0 0.375rem !important;
}

td {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cursor-pointer {
  cursor: pointer;
}

.country-details {
  display: flex;
}
.country-details-img {
  flex: 1 1 50%;
  width: 50%;
}
.primary-title {
  font-size: calc(22rem / 16);
  font-weight: 800;
}

.country-info {
  width: 40%;
}
.highLight {
  font-weight: 600;
}
</style>
