import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import router from './router';
import store from './store';
import dateFilter from "@/filters/dateFilter";
import messagePlugin from "@/utils/message.plugin";
import './registerServiceWorker';
import 'materialize-css/dist/js/materialize.min';

import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter('date', dateFilter);

firebase.initializeApp({
    apiKey: "AIzaSyDSulFMF30jxeWMGaIIa9Xoqifqe_Zve3s",
    authDomain: "vue-crm-75310.firebaseapp.com",
    projectId: "vue-crm-75310",
    storageBucket: "vue-crm-75310.appspot.com",
    messagingSenderId: "83196373628",
    appId: "1:83196373628:web:7968f949f2134ad1b3f7f9"
});

let app;

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
});