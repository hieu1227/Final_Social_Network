<template>
  <div class="chat">
    <Dashboard />
    <div class="sidebar-wrapper">
      <div class="sidebar-nav">
        <h3>Chat</h3>
        <div>
          <ul>
            <li v-if="detail_conversation.currentUser === name.displayName">
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              {{ detail_conversation.withUser }}
            </li>
            <li v-else>
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              {{ detail_conversation.currentUser }}
            </li>
          </ul>
        </div>
      </div>
      <!-- <div class="message">
        <div id="content" v-if="currentPeerUser===null">
      <div class="my-4">
        <img width="200px" class="br-50" />
      </div>
      <div>
        <h2>Welcome ,</h2>
        <h3>Let's spread love</h3>
      </div>
    </div>
    <div v-else class="header-width">
      <ChatBox v-bind:currentPeerUser="currentPeerUser" />
    </div>
      </div> -->
    </div>
    <div class="chatbox">
      <header>
        <div class="header">
          <b-avatar
            variant="info"
            src="https://placekitten.com/300/300"
            class="br-50 header-image"
          />
          <div class="header-image">
            <h5 class="mt-2" v-if="detail_conversation.currentUser === name.displayName">
              {{ detail_conversation.withUser }}
            </h5>
            <h5 v-else>{{ detail_conversation.currentUser }}</h5>
          </div>
        </div>
      </header>
      <div class="chat-content">
        <h2 class="welcome">Welcome to Chatbox</h2>
        <div class="text-outer">
          <div class="text-inner" v-for="(mess, index) in list_message.filter((mess) => mess.conversation_id === this.$route.params.id)"
          :key="index">
            <div :class="[mess.userSender === name.displayName ? 'sent_msg':'received_msg']">
              <h6>{{mess.content}}</h6>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div class="footer">
          <input type="text" class="mr-3" @keyup.enter="sendMessage" v-model="message"/>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import Dashboard from "../layout/Dashboard.vue";
// import Chat from "./Chat.vue";
import { getDatabase, ref, push,onValue } from "firebase/database";
import {
  getFirestore,
  getDoc,
  doc,
  getDocs,
  collection,
} from "firebase/firestore";
export default {
  app: "ChatBox",
  components: {
    Dashboard,
  },
  // props: ["currentPeerUser"],
  data() {
    return {
      listMessage: [],
      groupChatId: null,
      detail_conversation: [],
      list_conversation: [],
      message:[],
      list_message:[]
    };
  },
  created() {
    this.getDetaiConversation();
    this.getConversation();
    this.getMessage()
    this.name = JSON.parse(localStorage.getItem("user"));
    console.log(this.$route.params.id, "3");
  },
  methods: {
    sendMessage() {
      const db = getDatabase();
      if(this.message.length >0){
        push(ref(db, "messages"), {
        userSender: this.name.displayName,
        toUser: this.detail_conversation.withUser,
        content:this.message,
        conversation_id: this.$route.params.id
      });
      this.message = "";
      }
    },
    getMessage() {
      const db = getDatabase();
      onValue(ref(db, "messages"), (data) => {
        this.list_message = [];
        data.forEach((data) => {
          this.list_message.push(data.val());
        });
        console.log();
      });
    },
    // handleDetail(id){
    //   this.$router.push(`/chat/${id}`);
    //   console.log(id);
    // },
    async getDetaiConversation() {
      const db = getFirestore();
      const docRef = doc(db, "conversation", this.$route.params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.detail_conversation = docSnap.data();
        this.id = docSnap.id;
        console.log(this.detail_conversation, "4");
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    },
    async getConversation() {
      this.list_conversation = [];
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "conversation"));
      querySnapshot.forEach((doc) => {
        this.list_conversation.push({
          id: doc.id,
          currentUser: doc.data().currentUser,
          userFollow: doc.data().userFollow,
        });
      });
    },
  },
};
</script>

<style scoped>
.welcome {
  color: #635a5a;
  font-weight: 600;
  text-align: center;
}
.chatbox {
  display: flex;
  flex-direction: column;
  height: 99vh;
  margin-left: 300px;
  width: calc(100% - 300px);
}
.chatbox .header {
  border-bottom: 1px solid;
  position: fixed;
  padding: 72px 100px 0px 0px;
  width: calc(100% - 300px);
  height: 150px;
  z-index: 12;
}
.chatbox .chat-content {
  overflow-y: auto;
  padding: 20px 150px 0px 150px;
  z-index: 1;
  margin-top: 150px;
  height: 100%;
}
.text-inner{
  margin-bottom: 10px;
  height: 100%;
  padding: 10px 10px 2px;
  border-radius: 0.5rem;
  word-wrap:break-word;
}
.sent_msg{
  background: rgb(110, 110, 110);
  color: rgb(253, 253, 253);
  border: 1px solid rgb(110, 110, 110);
  border-radius: 15px;
  padding: 5px;
  height: 100% !important;
  width: 40%;
  
}
.received_msg{
  background: #0084FF;
  color: rgb(253, 253, 253);
  border: 1px solid #0084FF;
  border-radius: 15px;
  padding: 5px;
  height: 100% !important;
  width: 50%;
  margin-left: 450px;

}
.chatbox .footer {
  width: 100%;
  text-align: center;
}
.chatbox .footer input {
  width: 1100px;
  height: 40px;
  border-radius: 20px;
}
.br-50 {
  border-radius: 50%;
}
.header-image {
  float: left;
  margin-left: 20px;
  margin-top: 20px;
}

.pointer {
  cursor: pointer;
}
#wrapper {
  padding-left: 0;
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
  font-family: "Cabin", sans-serif;
  position: relative;
}
.sidebar-wrapper {
  display: flex;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
}
.sidebar-wrapper h3 {
  margin: 0px 0px 20px 30px;
}
.sidebar-nav {
  padding-top: 100px;
  width: 300px;
  height: 100%;
  position: fixed;
  border-right: 2px solid gray;
}
.sidebar-nav input {
  width: 250px;
  height: 45px;
  border-radius: 50px;
  margin-left: 25px;
  margin-bottom: 40px;
}
ul {
  color: black;
  list-style: none;
  cursor: pointer;
  margin: 5px 10px 5px -30px;
}
li {
  border-bottom: 2px solid rgb(209, 209, 209);
  padding: 10px 0px 15px 20px;
}
.name {
  display: flex;
}
</style>
