<template>
  <div id="chat">
    <Dashboard />
    <div class="sidebar-wrapper">
      <div class="sidebar-nav">
        <h3>Chat</h3>
        <b-form-input placeholder="Search"></b-form-input>
        <div>
          <ul v-on:click="letsChat(item)"
            v-for="(item, index) in list_conversation.filter(
              (item) =>
                item.toUserName === this.name.displayName ||
                item.name === this.name.displayName
            )"
            :key="index"
            @click="handleDetail(item.id)"
          >
            <li v-if="item.toUserName === name.displayName" >
              <b-avatar
                variant="info"
                src="https://placekitten.com/300/300"
                class="mr-3"
              />
              {{ item.name }}
            </li>
            <li v-else>
              {{ item.toUserName }}
            </li>
          </ul>
        </div>
      </div>
      <div class="message">
        <div id="content" v-if="currentPeerUser===null">
      <div class="my-4">
        <img width="200px" class="br-50" />
      </div>
      <div>
        <h2>Welcome {{list_conversation.name}},</h2>
        <h3>Let's spread love</h3>
      </div>
    </div>
    <div v-else class="header-width">
      <ChatBox v-bind:currentPeerUser="currentPeerUser" />
    </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dashboard from "../layout/Dashboard.vue";
import ChatBox from "./ChatBox.vue";

import { collection, getFirestore, getDocs } from "firebase/firestore";
export default {
  name: "ChatPage",
  components: {
    Dashboard,
    ChatBox,
  },
  data() {
    return {
      user: {},
      list_conversation: [],
      name: {},
      currentPeerUser: null,
    };
  },
  created() {
    this.getConversation();
    this.name = JSON.parse(localStorage.getItem("user"));
  },
  methods: {
    async getConversation() {
      this.list_conversation = [];
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "conversation"));
      querySnapshot.forEach((doc) => {
        this.list_conversation.push({
          id: doc.id,
          toUserName: doc.data().toUserName,
          name: doc.data().currentUserName,
        });
      });
    },
    letsChat(item) {
      this.currentPeerUser = item;
      console.log(item.id);
    },
    handleDetail(id){
      this.$router.replace(`/chat/${id}`);
      console.log(id);
    }
  },
};
</script>

<style scoped>
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
.message {
  padding: 72px 0px 0px 0px;
  position: absolute;
  width: calc(100% - 300px);
  height: 100%;
  margin-left: 300px;
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
