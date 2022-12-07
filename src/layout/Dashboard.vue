<template>
  <div id="main">
    <b-navbar toggleable>
      <b-navbar-brand href="#"
        ><router-link to="/home"><h2>Social</h2></router-link></b-navbar-brand
      >
      <b-nav-form>
        <b-form-input
          placeholder="Search"
          v-model="keySearch"
          @keyup.enter="handleSearch()"
          type="text"
        ></b-form-input>
      </b-nav-form>
      <!-- <b-navbar-brand href="#" class="chat"
        ><router-link to="/chat"><i class="fas fa-envelope"></i></router-link></b-navbar-brand
      > -->
      <b-nav-item-dropdown>
        <template #button-content>
          <span>{{ user.displayName || "Khoong cos" }}</span>
        </template>
        <b-dropdown-item href="#"
          ><router-link to="/profile">Profile</router-link></b-dropdown-item
        >
        <b-dropdown-item href="#"
          ><router-link to="/setting">Settings</router-link></b-dropdown-item
        >
        <b-dropdown-item href="#" @click="SignOut">Sign Out</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar>
  </div>

  <!-- <slot/> -->
</template>
<script>
import { getAuth, signOut } from "firebase/auth";
import { MakeToast } from "@/toast/toastMessage";
// const auth = getAuth();
export default {
  name: "DashboardPage",
  components: {},
  data() {
    return {
      keySearch: "",
      user: {},
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async SignOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.$router.replace("/");
          MakeToast({
            variant: "success",
            title: "Success",
            content: "Logout Successfully",
          });
          // Sign-out successful.
        })
        .catch((error) => {
          MakeToast({
            variant: "error",
            title: "error",
            content: error,
          });
          console.log(error);
          // An error happened.
        });
    },
    async getUser() {
      this.user = JSON.parse(localStorage.getItem("user"));
      // The user object has basic properties such as display name, email, etc.
      // const displayName = user.displayName;
      // this.name = user.displayName;
      // console.log(user.displayName, "111");
    },
  },
};
</script>

<style scoped>
#main {
  background: white;
  position: fixed;
  width: 100%;
  z-index: 999;
  padding: 0px 100px 0px 20px;
  border-bottom: 1px solid;
}
#main input {
  width: 500px;
  height: 45px;
  border-radius: 50px;
}
#main .chat {
  background: rgb(199, 199, 199);
  width: 40px;
  border-radius: 20px;
  text-align: center;
  margin-left: 500px;
}
#main h2 {
  font-family: "Lucida Handwriting";
}
#main a {
  text-decoration: none;
  color: black;
}
#main li:nth-last-child(1) {
  list-style: none;
}
#main .navbar li :nth-child(1) {
  color: black;
}
</style>
