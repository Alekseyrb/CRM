<template>
  <div>
    <Loader v-if="loading"/>
    <div class="app-main-layout" v-else>

      <Navbar @open-close="isOpen = !isOpen"/>

      <Sidebar v-model="isOpen" :key="locale"/>

      <main class="app-content" :class="{full: !isOpen}">
        <div class="app-page">
          <router-view></router-view>
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link
            tag="a"
            to="/record"
            class="btn-floating btn-large blue"
            v-tooltip="'CreateNewRecord'"
        >
          <i class="large material-icons">add</i>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script>
import Navbar from "@/components/app/Navbar.vue";
import Sidebar from "@/components/app/Sidebar.vue";
import messages from "@/utils/messages";

export default {
  name: "MainLayout",
  data: () => ({
    isOpen: true,
    loading: true,
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo');
    }

    this.loading = false;
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    locale() {
      return this.$store.getters.info.locale;
    }
  },
  watch: {
    error(fbError) {
      console.log(fbError);
      this.$error(messages[fbError.code] || 'Что-то пошло не так');
    }
  },
  components: {
    Navbar, Sidebar,
  }
}
</script>

<style scoped>

</style>