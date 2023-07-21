<template>
  <div>
    <div class="page-title">
      <h3>{{ 'History_Title' | localize}}</h3>
    </div>

    <div class="history-chart">
      <div class="pie-chart-container">
        <Pie :data="chartData" v-if="!loading"/>
      </div>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!records.length">
      {{'NoRecords' | localize}}.
      <router-link to="/record">{{ 'AddFirst' | localize}}</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items"/>

      <paginate
          v-model="page"
          :page-count="pageCount"
          :click-handler="pageChangeHandler"
          :prev-text="'Back' | localize"
          :next-text="'Forward' | localize"
          :container-class="'pagination'"
          :page-class="'waves-effect'"
      >
      </paginate>
    </section>
  </div>
</template>

<script>
import paginationMixin from "@/mixins/paginationMixin";
import HistoryTable from "@/components/HistoryTable.vue";
import {Pie} from 'vue-chartjs'
import {Chart as ChartJS, ArcElement, Title, Tooltip, Legend} from 'chart.js'
import localizeFilter from "@/filters/localizeFilter";

ChartJS.register(ArcElement, Title, Tooltip, Legend)

export default {
  name: "History",
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
    chartData: null,
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords');
    const categories = await this.$store.dispatch('fetchCategories');

    this.setup(categories);

    this.chartData = {
      labels: categories.map(c => c.title),
      datasets: [
        {
          label: localizeFilter('CostsForCategories'),
          backgroundColor: ['#f87979', '#00ccff', '#ffcc00', "red", "green", "yellow", "black"],
          data: categories.map(c => {
            return this.records.reduce((total, r) => {
              if (r.categoryId === c.id && r.type === 'outcome') {
                total += +r.amount
              }
              return total
            }, 0)
          })
        }
      ]
    }

    this.loading = false;
  },
  methods: {
    setup(categories) {
      this.setupPagination(this.records.map(record => {
        return {
          ...record,
          categoryName: categories.find(c => c.id === record.categoryId).title,
          typeClass: record.type === 'income' ? 'green' : 'red',
          typeText: record.type === 'income'
              ? localizeFilter('Income')
              : localizeFilter('Outcome')
        }
      }));


    }
  },
  components: {
    HistoryTable, Pie
  }
}
</script>

<style scoped>
.pie-chart-container {
  width: 300px;
  height: 300px;
}
</style>