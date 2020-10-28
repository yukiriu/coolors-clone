require('./bootstrap');

window.Vue = require('vue');
import VueRouter from 'vue-router'

Vue.component('color-block', require('./components/ColorBlock.vue').default);
Vue.component('core', require('./components/Core.vue').default);
Vue.component('color', require('./components/color.vue').default);
Vue.component('home', require('./components/Home.vue').default);


Vue.use(VueRouter);
var routes =[
    {
        path: "/home",
        name: "Generate",
        component: () => import("./components/Home.vue"),
    },
    {
        path: "/:color([A-fa-f0-9]{6})",
        name: "test",
        component: () => import("./components/Color.vue"),
    },
    {
        path: "/",
        name: "Generate",
        component: () => import("./components/Home.vue"),
    },
    {
        path: "/:params",
        name: "Generate",
        component: () => import("./components/Core.vue"),
    }
]
var router = new VueRouter({
    mode: 'history',
    routes
});


const app = new Vue({
    router,
    routes,
    el: '#app',
});
