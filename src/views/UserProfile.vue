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
        <h5>{{ filterUser[0].name }}</h5>
        <p>{{ user_post.length }} bài viết</p>
        <div class="follow">
          <p v-b-modal.modal-center>{{ filterFollowing.length }} Following</p>
          <p v-b-modal.modal-center>{{ filterFollower.length }} Followers</p>
        </div>
      </div>
    </div>
    <b-modal id="modal-center" centered title="List follow" hide-footer>
      <b-tabs content-class="mt-3" align="center" style="margin-top: -16px">
        <b-tab title="Following" active>
          <div v-for="(flw, index) in filterFollowing" :key="index">
            <div class="following">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              <h5>{{ flw.userFollow }}</h5>
            </div>
          </div>
        </b-tab>
        <b-tab title="Followers">
          <div v-for="(flw, index) in filterFollower" :key="index">
            <div class="following">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              <h5>{{ flw.currentUser }}</h5>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </b-modal>

    <div class="user_post">
      <b-tabs content-class="mt-3" align="center">
        <b-tab title="Posts" active>
          <div
            class="post"
            v-b-modal.modal-center-1
            v-for="(item, index) in list_post.filter(
              (item) => item.user === filterUser[0].name
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
        <b-modal id="modal-center-1" size="xl" centered >
            
        </b-modal>
        <b-tab title="Album" v-bind:id="album">
          <div
            class="image"
            v-for="(item, index) in list_post.filter(
              (item) => item.user === filterUser[0].name
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
import { collection, getDocs, getFirestore } from "firebase/firestore";
export default {
  name: "profileUser",
  components: {
    Dashboard,
  },
  data() {
    return {
      list_post: [],
      user_post: [],
      list_follow: [],
      album: "album",
      follower: [],
      detail_user: [],
    };
  },
  async created() {
    this.getFollow();
    this.getDetailUser();

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
      (item) => item.user === this.filterUser[0].name
    );
    this.user_post = filterPost;
  },
  computed: {
    filterUser() {
      return this.detail_user.filter(
        (user) => user.id === this.$route.params.uid
      );
    },
    filterFollowing() {
      return this.list_follow.filter(
        (item) => item.currentUser === this.filterUser[0].name
      );
    },
    filterFollower() {
      return this.list_follow.filter(
        (item) => item.userFollow === this.filterUser[0].name
      );
    },
  },
  methods: {
    async getFollow() {
      this.list_follow = [];
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "follow"));
      querySnapshot.forEach((doc) => {
        this.list_follow.push({
          id: doc.id,
          currentUser: doc.data().currentUser,
          currentUserId: doc.data().currentUserId,
          userFollow: doc.data().userFollow,
          status: doc.data().status,
        });
      });
    },
    async getDetailUser() {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        this.detail_user.push({
          name: doc.data().fullname,
          id: doc.data().id,
        });
      });
    },
  },
};
</script>

<style scoped>
.card-name {
  display: flex;
}
.card {
  margin: 20px 250px 0px 250px;
}
.follow {
  display: flex;
  justify-content: center;
}
.follow p:nth-child(2) {
  margin-left: 50px;
}
.following {
  display: flex;
  margin-bottom: 20px;
}
.following h5 {
  margin-top: 5px;
}
.zone-button-submit {
  text-align: center;
}
.zone-profile {
  padding-top: 100px;
  height: 320px;
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
  padding-top: 320px;
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
