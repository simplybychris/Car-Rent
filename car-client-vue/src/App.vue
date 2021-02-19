<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href class="navbar-brand" @click.prevent>Rent Car</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" />Search car
          </router-link>
        </li>
        <li v-if="showDriverBoard" class="nav-item">
          <router-link to="/transport" class="nav-link">Transport</router-link>
        </li>
        <li v-if="showWorkerBoard" class="nav-item">
          <router-link to="/orders" class="nav-link">Orders</router-link>
        </li>
        <li v-if="showWorkerBoard" class="nav-item">
          <router-link to="/drivers" class="nav-link">Drivers</router-link>
        </li>
        <li v-if="showLoggedBoard" class="nav-item">
          <router-link to="/orders" class="nav-link">Your orders</router-link>
        </li>
        <li class="nav-item"></li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" />Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" />Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" />LogOut
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showDriverBoard() {
      if (this.currentUser && this.currentUser.role) {
        return this.currentUser.role.includes("driver");
      }

      return false;
    },
    showLoggedBoard() {
      if (this.currentUser && this.currentUser.role) {
        return true;
      } else {
        return false;
      }
    },
    showWorkerBoard() {
      if (this.currentUser && this.currentUser.role) {
        return this.currentUser.role.includes("worker");
      }

      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
#app {
  height: 100vh;
}

.navbar {
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
}
</style>