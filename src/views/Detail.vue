<template>
  <div class="home">
    <Dashboard />
    <div class="main">
      <div class="post">
        <div class="card">
          <div class="card-body area-post">
            <div class="card-name">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              <h5>{{ detail_post.user }}</h5>
            </div>
            <div
              class="message"
              v-if="detail_post.user != fullname"
              v-on:click="handleConversation"
            >
              <i class="far fa-comment"></i>
            </div>
            <div v-else class="options">
              <b-nav-item-dropdown>
                <b-dropdown-item href="#" v-b-modal.modal-ideas>Edit</b-dropdown-item>
                <b-dropdown-item href="#">Delete</b-dropdown-item>
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
          v-model="isShowModalPost"
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
                @change="uploadImage"
              ></b-form-file>
            </div>
          </div>

          <template #modal-footer>
            <div>
              <b-button class="btn btn-danger" @click="isShowModalPost = false">
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

          <div>
          </div>
          <b-modal id="modal-center" centered title="Lượt thích" hide-footer>
            <div class="row mt-2" v-for="(like,index) in list_like" :key="index">
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
            <div class="card-name">
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
      <div class="follow">
        <div class="card">
          <h4 style="padding: 20px 0px 10px 30px">
            Conversation: {{ list_conversation.length }}
          </h4>
          <div>
            <ul
              v-for="cvs in list_conversation"
              :key="cvs"
              @click="handleMessage(cvs.id)"
            >
              <li
                v-if="
                  cvs.currentUser != fullname.displayName ||
                  cvs.withUser === fullname.displayName
                "
              >
                <b-avatar
                  variant="info"
                  src="https://placekitten.com/300/300"
                  class="mr-3"
                />
                {{ cvs.withUser }}
              </li>
              <li v-if="cvs.withUser === fullname.displayName">
                <b-avatar
                  variant="info"
                  src="https://placekitten.com/300/300"
                  class="mr-3"
                />
                {{ cvs.currentUser }}
              </li>
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
} from "firebase/firestore";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
export default {
  name: "HomeView",
  components: {
    Dashboard,
  },
  data() {
    return {
      fullname: "",
      id: "",
      post: {
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
      like_post:[]
    };
  },
  created() {
    this.getComment();
    this.getDetailPost();
    this.getConversation();
    this.getLike();
    const user = getAuth().currentUser;
    this.fullname = user.displayName;
    // const idd = this.detail_post.uid
    
  },
  methods: {
    sendComment() {
      console.log(this.fullname, "qwewqewqe");
      const db = getDatabase();
      push(ref(db, "comment"), {
        username: this.fullname,
        comment: this.comment,
        postID: this.id,
      });
      this.comment = "";
    },
    getComment() {
      const db = getDatabase();
      onValue(ref(db, "comment"), (data) => {
        this.comments = [];
        data.forEach((data) => {
          this.comments.push(data.val());
        });
        console.log();
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
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    },
    handleMessage(id) {
      console.log(id, "12");
      this.$router.push(`/chat/${id}`);
    },
    // async handleMessage(uid) {
    //   const db = getFirestore();
    //   try {
    //         const docRef = await addDoc(collection(db, "conversation"), {
    //           toUserId: this.detail_post.uid,
    //           toUserName: this.detail_post.user,
    //           currentUserId: getAuth().currentUser.uid,
    //           currentUserName: this.fullname
    //         });
    //         console.log("Document written with ID: ", docRef.id);
    //       } catch (e) {
    //         console.error("Error adding document: ", e);
    //       }
    //   this.$router.push(`/chat`);
    //   console.log(uid, "8");
    // },
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
.follow {
  margin-left: 30px;
}
.follow .card {
  width: 300px !important;
}
.post a {
  text-decoration: none;
  color: black;
}
.card-name {
  display: flex;
}
.card-name input {
  border-radius: 50px;
}
.post .title {
  margin-top: 20px;
}
.message {
  list-style: none;
  float: right;
  margin-top: -50px;
  color: black;
  cursor: pointer;
  font-size: 25px;
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
