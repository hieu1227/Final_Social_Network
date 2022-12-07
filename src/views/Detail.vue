<template>
  <div class="home">
    <Dashboard />
    <div class="main">
      <div class="post">
        <div class="card">
          <div class="card-body area-post">
            <div class="card-name" @click="userDetail(detail_post.uid)">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              <h5>{{ detail_post.user }}</h5>
            </div>
            <div class="action" v-if="detail_post.user != fullname">
              <div class="follow" @click="follow = !follow">
                <b-button v-if="follow" @click="handleFollow">Follow</b-button>
                <div v-else class="following" @click="handleUnFollow">
                  <b-button>Following </b-button>
                  <b-button class="unfollow">Unfollow</b-button>
                </div>
              </div>
              <div class="message" v-on:click="handleConversation">
                <i class="far fa-comment"></i>
              </div>
            </div>
            <div v-else class="options">
              <b-nav-item-dropdown>
                <b-dropdown-item href="#" v-b-modal.modal-ideas
                  >Edit</b-dropdown-item
                >
                <b-dropdown-item href="#" @click="deletePost"
                  >Delete</b-dropdown-item
                >
              </b-nav-item-dropdown>
            </div>
            <div class="hashtag">
              <p>#{{ detail_post.hashtag }}</p>
            </div>
            <div class="title">
              <h5>{{ detail_post.title }}</h5>
            </div>
            <div class="img">
              <img :src="detail_post.image" alt="" />
            </div>
            <div class="content">
              <p>{{ detail_post.content }}</p>
            </div>
          </div>
          <b-modal
            v-model="isShowModal"
            id="modal-ideas"
            title="Edit"
            size="lg"
          >
            <div class="row mt-2">
              <div class="col-md-12 col-sm-12 col-lg-12">
                <b-avatar
                  variant="info"
                  src="https://placekitten.com/300/300"
                  class="mr-3"
                />
                <label for="">{{ fullname }}</label>
                <div style="margin-top: 20px">
                  <h6>Hashtag</h6>
                  <b-input placeholder="Hashtag" v-model="post.hashtag" />
                </div>
                <div style="margin-top: 20px">
                  <h6>Title</h6>
                  <b-input placeholder="Title post" v-model="post.title" />
                </div>

                <div style="margin-top: 20px">
                  <h6>Content</h6>
                  <b-form-textarea v-model="post.content" rows="8" />
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-lg-12 mt-3">
                <b-form-file
                  accept="image/*"
                  id="upload-ideas"
                  v-model="post.image"
                ></b-form-file>
              </div>
            </div>

            <template #modal-footer>
              <div>
                <b-button class="btn btn-danger" @click="isShowModal = false">
                  Cancel
                </b-button>
                <b-button
                  type="submit"
                  class="btn btn-primary"
                  @click="handleEdit()"
                >
                  Edit
                </b-button>
              </div>
            </template>
          </b-modal>
          <hr />
          <div class="interactive">
            <div class="icon" @click="status = !status">
              <div v-if="status" v-on:click="handleLike">
                <i class="far fa-heart"></i>
              </div>
              <div v-else class="icon_active" v-on:click="handleUnLike">
                <i class="fas fa-heart"></i>
              </div>
            </div>
            <p v-b-modal.modal-center>{{ like_post.length }} lượt thích</p>
          </div>

          <div></div>
          <b-modal id="modal-center" centered title="Lượt thích" hide-footer>
            <div
              class="row mt-2"
              v-for="(like, index) in list_like"
              :key="index"
            >
              <div class="col-md-12 col-sm-12 col-lg-12">
                <b-avatar
                  variant="info"
                  src="https://placekitten.com/300/300"
                  class="mr-3"
                />
                <label for="">{{ like.currentUser }}</label>
              </div>
            </div>
          </b-modal>
          <div class="card-body area-post">
            <div class="card-name">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              <b-input
                placeholder="Comment"
                v-model="comment"
                @keyup.enter="sendComment"
              />
            </div>
          </div>
          <div
            class="card-body area-post"
            v-for="cmt in comments.filter((cmt) => cmt.postID === this.id)"
            :key="cmt"
          >
            <div class="card-name" @click="userDetail(cmt.uid)">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              <h5>{{ cmt.username }}</h5>
            </div>
            <div class="comment">
              <p>{{ cmt.comment }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="conversation">
        <div class="card">
          <h4 style="padding: 20px 0px 10px 30px">
            Conversation: {{ filter.length }}
          </h4>
          <b-form-input
            placeholder="Search"
            v-model="searchConversation"
          ></b-form-input>
          <div>
            <ul
              v-for="cvs in filterConversation"
              :key="cvs"
              @click="handleMessage(cvs.id)"
            >
              <li v-if="cvs.currentUser === fullname">
                <b-avatar
                  variant="info"
                  src="https://placekitten.com/300/300"
                  class="mr-3"
                />
                {{ cvs.withUser }}
              </li>
              <li v-else-if="cvs.withUser === fullname">
                <b-avatar
                  variant="info"
                  src="https://placekitten.com/300/300"
                  class="mr-3"
                />
                {{ cvs.currentUser }}
              </li>
              <li v-else></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dashboard from "../layout/Dashboard.vue";
import {
  getFirestore,
  getDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { MakeToast } from "@/toast/toastMessage";
import { getAuth } from "firebase/auth";
export default {
  name: "HomeView",
  components: {
    Dashboard,
  },
  data() {
    return {
      searchConversation: "",
      fullname: "",
      id: "",
      post: {
        hashtag: "",
        title: "",
        content: "",
        image: "",
      },
      detail_post: [],
      list_user: [],
      isShowModal: false,
      isShowModalPost: false,
      comment: "",
      comments: [],
      ids: null,
      status: true,
      list_conversation: [],
      user_follow: [],
      list_like: [],
      like_post: [],
      follow: true,
      idFollow: null,
    };
  },
  created() {
    this.getComment();
    this.getDetailPost();
    this.getConversation();
    this.getLike();
    const user = getAuth().currentUser;
    this.fullname = user.displayName;
    console.log(user);
    // const idd = this.detail_post.uid
  },
  computed: {
    filterConversation() {
      return this.list_conversation.filter((cvs) =>
        (cvs.withUser || cvs.currentUser)
          .toLowerCase()
          .includes(this.searchConversation.toLowerCase())
      );
    },
    filter() {
      return this.list_conversation.filter(
        (cvs) =>
          cvs.currentUser === this.fullname || cvs.withUser === this.fullname
      );
    },
  },
  methods: {
    sendComment() {
      console.log(this.fullname, "qwewqewqe");
      const db = getDatabase();
      if (this.comment.length > 0) {
        push(ref(db, "comment"), {
          username: this.fullname,
          comment: this.comment,
          postID: this.id,
          uid: getAuth().currentUser.uid,
        });
      }
      this.comment = "";
    },
    getComment() {
      const db = getDatabase();
      onValue(ref(db, "comment"), (data) => {
        this.comments = [];
        data.forEach((data) => {
          this.comments.push(data.val());
        });
        console.log(this.comments, "123");
      });
    },
    async getConversation() {
      this.list_conversation = [];
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "conversation"));
      querySnapshot.forEach((doc) => {
        this.list_conversation.push({
          id: doc.id,
          currentUser: doc.data().currentUser,
          withUser: doc.data().withUser,
          currentUserId: doc.data().currentUserId,
          withUserId: doc.data().withUserId,
        });
      });
    },
    async getDetailPost() {
      const db = getFirestore();
      const docRef = doc(db, "post", this.$route.params.key);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.detail_post = docSnap.data();
        this.id = docSnap.id;
        console.log(this.detail_post, "23");
        this.post = this.detail_post;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    },
    handleMessage(id) {
      console.log(id, "12");
      this.$router.push(`/chat/${id}`);
    },
    async handleConversation() {
      const db = getFirestore();
      try {
        const docRef = await addDoc(collection(db, "conversation"), {
          currentUser: this.fullname,
          withUser: this.detail_post.user,
          currentUserId: getAuth().currentUser.uid,
          withUserId: this.detail_post.uid,
        });
        console.log("Document written with ID: ", docRef.id);
        this.getConversation();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async handleLike() {
      const db = getFirestore();
      try {
        const docRef = await addDoc(collection(db, "like"), {
          currentUser: this.fullname,
          currentUserId: getAuth().currentUser.uid,
          postID: this.id,
          status: this.status,
        });
        this.ids = docRef.id;
        this.getLike();
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async getLike() {
      this.list_like = [];
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "like"));
      querySnapshot.forEach((doc) => {
        this.list_like.push({
          id: doc.id,
          currentUser: doc.data().currentUser,
          currentUserId: doc.data().currentUserId,
          postId: doc.data().postID,
          status: doc.data().status,
        });
      });
      let filterPostLike = this.list_like.filter(
        (item) => item.postId === this.$route.params.key
      );
      this.like_post = filterPostLike;
    },
    async handleUnLike() {
      const db = getFirestore();
      await deleteDoc(doc(db, "like", this.ids));
      this.getLike();
    },
    async handleFollow() {
      const db = getFirestore();
      try {
        const docRef = await addDoc(collection(db, "follow"), {
          currentUser: this.fullname,
          currentUserId: getAuth().currentUser.uid,
          status: this.follow,
          userFollow: this.detail_post.user,
        });
        this.idFollow = docRef.id;
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async handleUnFollow() {
      const db = getFirestore();
      await deleteDoc(doc(db, "follow", this.idFollow));
    },
    async deletePost() {
      const db = getFirestore();
      this.$bvModal
        .msgBoxConfirm("Do you want to delete this post?", {
          title: "Warning",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "OK",
          cancelTitle: "Cancel",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(async (value) => {
          if (value === true) {
            await deleteDoc(doc(db, "post", this.id));
            MakeToast({
              variant: "success",
              title: "Success",
              content: "Successfully to delete this post",
            });
            this.$router.replace("/home");
          }
        })
        .catch((err) => {
          console.log(err);
          {
            MakeToast({
              variant: "warning",
              title: "Warning",
              content: "You can not delete this post",
            });
          }
        });
    },
    async handleEdit() {
      const db = getFirestore();
      const postRef = doc(db, "post", this.$route.params.key);
      if (
        this.post.hashtag.length > 0 &&
        this.post.title.length > 0 &&
        this.post.content.length > 0
      ) {
        await updateDoc(postRef, this.post);
        MakeToast({
          variant: "success",
          title: "Success",
          content: "Successfully to update this post",
        });
        this.getDetailPost();
        this.isShowModal = false;
      } else {
        MakeToast({
          variant: "danger",
          title: "Danger",
          content: "You must enter a valid value",
        });
      }
    },
    userDetail(uid) {
      this.$router.push(`/user/${uid}`);
    },
  },
};
</script>
<style scoped>
.home {
  height: 100%;
}
.post {
  width: 100%;
}
.main {
  display: flex;
  padding: 100px 20px 0px 250px;
  height: 100%;
}
.conversation {
  margin-left: 30px;
}
.conversation .card {
  width: 300px !important;
}
.conversation input {
  margin-left: 10px;
  width: 280px;
  height: 40px;
  border-radius: 20px;
}
.following {
  position: relative;
  overflow: hidden;
}
.following .unfollow {
  background: red !important;
  position: absolute;
  left: 0px;
  width: 92px !important;
  top: -50px;
}
.follow {
  height: 45px !important;
}
.following:hover .unfollow {
  background: white !important;
  top: -2px;
  color: red !important;
  font-weight: 600;
  border: 1px solid red !important;
}
.post a {
  text-decoration: none;
  color: black;
}
.card-name {
  display: flex;
  cursor: pointer;
}
.card-name input {
  border-radius: 50px;
}
.post .title {
  margin-top: 20px;
}
.action {
  list-style: none;
  display: flex;
  color: black;
  cursor: pointer;
  font-size: 25px;
  justify-content: space-between;
  margin-top: -50px;
  margin-left: 120px;
}

.action .follow button {
  margin-left: 50px;
  background: #0084ff;
  border: none;
  border-radius: 50px;
  margin-top: 10px;
}
.options {
  list-style: none;
  float: right;
  margin-top: -50px;
  color: black;
  cursor: pointer;
  font-size: 25px;
}
.interactive {
  font-size: 25px;
  margin-left: 20px;
  cursor: pointer;
}
.interactive .icon_active i {
  color: #dc3535;
}
.post .comment {
  margin: 5px 0px 0px 60px;
}
.post .hashtag {
  margin-top: 20px;
  color: #0084ff;
  font-size: 15px;
}
.post .img {
  padding: 10px;
}
.post .img img {
  padding: 0 !important;
  margin: 0 !important;
  height: 500px;
}
.post .img {
  text-align: center;
}
ul {
  color: black;
  list-style: none;
  cursor: pointer;
  margin: 5px 10px 5px -30px;
}
li {
  padding: 10px 0px 15px 20px;
}
</style>
>
