<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{ info.bill | currency('UAH') }}</h4>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">{{ 'NoCategories' | localize }}.
      <router-link to="/categories">Добавить новую категорию</router-link>
    </p>

    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}</strong>
          {{ cat.spend | currency }} {{ 'Of' | localize }} {{ cat.limit | currency }}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
              class="determinate"
              :class="[cat.progressColor]"
              :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import currencyFilter from "@/filters/currencyFilter";
import localizeFilter from "@/filters/localizeFilter";

export default {
  name: "Planning",
  metaInfo() {
    return {
      title: this.$title('Menu_Planning')
    }
  },
  data: () => ({
    loading: true,
    categories: [],
  }),
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords');
    const categories = await this.$store.dispatch('fetchCategories');

    this.categories = categories.map(cat => {
      const spend = records
          .filter(r => r.categoryId === cat.id)
          .filter(r => r.type === 'outcome')
          .reduce((total, record) => {
            return total += +record.amount
          }, 0)

      const percent = 100 * spend / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;

      const progressColor = percent < 60
          ? 'green'
          : percent < 100
              ? 'yellow'
              : 'red';

      const tooltipValue = cat.limit - spend;
      const tooltip = `${tooltipValue < 0 ? localizeFilter('MoreThan') : localizeFilter('Stayed')} ${currencyFilter(Math.abs(tooltipValue))}`

      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip
      }
    });

    this.loading = false;
  },
  computed: {
    ...mapGetters(['info']),
  }
}
</script>

<style scoped>

</style>