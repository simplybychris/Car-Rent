import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import store from "../store/index.js";
import MyOrders from "../views/MyOrders.vue";
import Book from "../views/Book.vue";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/orders",
      name: "myorders",
      component: MyOrders,
      meta: {
        loggedUser: true,
      },
    },
    {
      path: "/user",
      name: "user",
      meta: {
        driver: true,
      },
    },
    {
      path: "/book/:id",
      name: "book",
      component: Book,
      meta: {
        loggedUser: true,
      },
    },
  ],
});
// router.beforeEach((to, from, next) => {
//   const publicPages = ["/login", "/register", "/home"];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = document.cookie.token; //http only flag, cant get cookie like that, should use axios.get

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next("/login");
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  let user = store.state.auth.user;
  // user = store.user;
  // if (to.matched.some((record) => record.meta.requiresAuth)) {
  //   if (localStorage.getItem("jwt") == null) {
  //     next({
  //       path: "/login",
  //       params: { nextUrl: to.fullPath },
  //     });
  //   } else {
  //     if (to.matched.some((record) => record.meta.driver)) {
  //       if (user.is_admin == 1) {
  //         next();
  //       } else {
  //         next({ name: "userboard" });
  //       }
  //     } else {
  //       next();
  //     }
  //   }
  // } else
  if (to.matched.some((record) => record.meta.loggedUser)) {
    if (user == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      if (user.role == "user") {
        next();
      } else {
        next({
          path: "/login",
          params: { nextUrl: to.fullPath },
        });
      }
    }
  } else {
    next();
  }
});

export default router;
