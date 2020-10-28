import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/Test",
            name: "Generate",
            component: () => import("./components/Core.vue"),
        },
        {
            path: "/:colors",
            name: "Test",
            component: () => import("./components/Test.vue"),
        }
    ]
});