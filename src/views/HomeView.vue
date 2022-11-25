<template>
  <div class="home">
    <Dashboard />
    <div class="main">
      <div class="manage-ideas__content-post col-12 col-sm-12 col-md-12">
        <div class="card">
          <div class="card-body area-post">
            <div class="card-name">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              <b-input
                readonly
                v-b-modal.modal-ideas
                placeholder="Create post"
              />
            </div>
          </div>
        </div>
        <b-modal
          v-model="isShowModalPost"
          id="modal-ideas"
          title="Your Post"
          size="lg"
        >
          <div class="row mt-2">
            <div class="col-md-12 col-sm-12 col-lg-12">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              <label for="">{{ fullname.displayName }}</label>
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
                @click="handlePost()"
              >
                Post
              </b-button>
            </div>
          </template>
        </b-modal>
        <div
          class="post"
          v-for="(item, index) in list_post"
          :key="index"
          @click="handleDetail(item.key)"
        >
          <!-- <router-link to="/detail"> -->
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
              <div class="hashtag">
                <p>#{{ item.hashtag }}</p>
              </div>
              <div class="title">
                <h5>{{ item.title }}</h5>
              </div>
              <!-- <div class="img">
                <img :src="item.image" alt="" />
              </div> -->
              <div class="content">
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
          <!-- </router-link> -->
        </div>
      </div>
      <div class="follow">
        <div class="card" >
          <h4 style="padding: 20px 0px 10px 30px">
            Conversation: {{ list_conversation.length }}
          </h4>
          <div>
            <ul
              v-for="cvs in list_conversation "
              :key="cvs"
              @click="handleMessage(cvs.id)"
            >
              <li v-if="cvs.currentUser === fullname.displayName" >
                <b-avatar
                  variant="info"
                  src="https://placekitten.com/300/300"
                  class="mr-3"
                />
                {{ cvs.withUser }}
              </li>
              <li v-else>
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
import { addDoc, collection, getFirestore, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
export default {
  name: "HomeView",
  components: {
    Dashboard,
  },
  data() {
    return {
      fullname: {},
      id: "",
      post: {
        hashtag:'',
        title: "",
        content: "",
        image: "",
        user: "",
        key: "",
      },
      list_post: [],
      images: [],
      isLoading: false,
      isShowModalPost: false,
      list_conversation: [],
    };
  },
  created() {
    this.getPost();
    this.handleCreated();
    this.getConversation();
  },
  // mounted(){
  //   this.getPost()
  // },
  methods: {
    async handleCreated() {
      const user = getAuth().currentUser;
      console.log(user, "ppp");
      this.fullname = JSON.parse(localStorage.getItem("user"));
    },

    async handlePost() {
      const db = getFirestore();
      if (this.post.title.length > 0 && this.post.content.length > 0 && this.post.hashtag.length >0) {
        alert("Post Successfull");
        this.isShowModalPost = false;

        const docRef = await addDoc(collection(db, "post"), {
          hashtag: this.post.hashtag,
          title: this.post.title,
          content: this.post.content,
          image: this.post.image,
          user: this.fullname.displayName,
          uid: getAuth().currentUser.uid,
        });
        this.post = {
          title: "",
          content: "",
          image: "",
        };
        console.log(docRef, "77");
        this.getPost();
      } else {
        alert("error");
      }
    },
    async getPost() {
      this.list_post = [];
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "post"));
      querySnapshot.forEach((doc) => {
        this.list_post.push({
          key: doc.id,
          hashtag:doc.data().hashtag,
          title: doc.data().title,
          content: doc.data().content,
          user: doc.data().user,
          image: doc.data().image,
        });
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
          withUserId:doc.data().withUserId
        });
      });
    },
    handleMessage(id){
      console.log(id,'23');
      this.$router.push(`/chat/${id}`);
    },
    handleDetail(key) {
      console.log(key);
      this.$router.push(`/detail/${key}`);
    },
    uploadImage(e) {
      const file = e.target.files[0];
      this.post.image = file.name;
      const storage = getStorage();

      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      console.log(this.images, "999");
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL, "99999999999");
            this.post.image = downloadURL;
            this.images.push({ src: downloadURL });
          });
        }
      );
    },
  },
};
</script>
<style scoped>
.home {
  height: 100%;
}
.main {
  display: flex;
  padding: 100px 350px 0px 250px;
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
.post {
  margin-top: 20px;
  cursor: pointer;
  margin-bottom: 20px;
}
.post .card{
  height: 250px;
  overflow: hidden;
}
.post .title {
  margin-top: 20px;
}

.post .hashtag{
  margin-top: 20px;
  color: #0084FF;
  font-size: 15px;
}
.follow ul {
  color: black;
  list-style: none;
  cursor: pointer;
  margin: 5px 10px 5px -30px;
}
.follow li {
  padding: 10px 0px 15px 20px;

}
/* .post .img img{
  width: 800px;
}
.post .img{
  text-align: center;
} */
</style>
