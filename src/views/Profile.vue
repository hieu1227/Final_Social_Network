<template>
  <div>
    <Dashboard />
    <div class="zone-profile">
      <div class="name">
        <b-avatar
          variant="info"
          src="https://placekitten.com/300/300"
          class="mr-3"
        />
        <h5>{{ fullname }}</h5>
        <p>{{ user_post.length }} bài viết</p>
      </div>
    </div>

    <div class="user_post">
      <b-tabs content-class="mt-3" align="center">
        <b-tab title="Posts" active>
          <div
            class="post"
            v-for="(item, index) in list_post.filter(
              (item) => item.user === fullname
            )"
            :key="index"
          >
            <div class="card">
              <div class="card-body area-post">
                <div class="card-name">
                  <b-avatar
                    variant="info"
                    src="https://placekitten.com/300/300"
                    class="mr-3"
                  />
                  <h5>{{ item.user }}</h5>
                </div>
                <div class="title">
                  <h5>{{ item.title }}</h5>
                </div>
                <div class="content">
                  <p>{{ item.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab title="Album" v-bind:id="album">
          <div
            class="image"
            v-for="(item, index) in list_post.filter(
              (item) => item.user === fullname
            )"
            :key="index"
          >
            <img :src="item.image" alt="" />
          </div>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import Dashboard from "../layout/Dashboard.vue";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
export default {
  name: "profilePage",
  components: {
    Dashboard,
  },
  data() {
    return {
      list_post: [],
      user_post: [],
      album: "album",
    };
  },
  async created() {
    const user = getAuth().currentUser;
    this.fullname = user.displayName;

    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      this.list_post.push({
        key: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        user: doc.data().user,
        image: doc.data().image,
      });
    });
    let filterPost = this.list_post.filter(
      (item) => item.user === this.fullname
    );
    this.user_post = filterPost;
  },
};
</script>

<style scoped>
.card-name {
  display: flex;
}
.card {
  margin: 20px 250px 0px 50px;
}
.zone-button-submit {
  text-align: center;
}
.zone-profile {
  padding-top: 100px;
  height: 300px;
  width: 100%;
  background-color: #eeeeee;
  text-align: center;
  position: fixed;
  z-index: 1;
}
.name span {
  height: 100px;
  width: 100px;
  margin-bottom: 10px;
}
.user_post {
  padding-top: 300px;
}
.user_post ul {
  padding-left: 250px !important;
  justify-content: center;
}

.select-post a {
  text-decoration: none;
  color: grey;
}
.select-album a {
  text-decoration: none;
  color: grey;
}
.select-album {
  margin-left: 50px;
}
.select::selection {
  background: orange;
  color: black;
}
.post .title {
  margin-top: 20px;
}

.image {
  padding: 0;
  margin: 0;
}
#album {
  display: flex;
}
.image img {
  padding: 0;
  margin: 0;
  width: 300px;
  height: 300px;
}
</style>
