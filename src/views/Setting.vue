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
                <h5>{{fullname}}</h5>
            </div>
        <b-row>
          <b-col>
            <div class="card">
              <div class="card-body zone--edit-info">
                <div>
                  <b-form-group
                    label-cols="3"
                    label-cols-lg="2"
                    label-size="md"
                    style="font-weight: 600"
                    label="Full Name :"
                  >
                    <b-form-input id="input-exp_detail" type="text" />
                  </b-form-group>

  
                  <b-form-group
                    label-cols="3"
                    label-cols-lg="2"
                    label-size="md"
                    style="font-weight: 600"
                    label="Email :"
                    disabled
                  >
                    <b-form-input />
                  </b-form-group>
  
                  <b-form-group
                    label-cols="3"
                    label-cols-lg="2"
                    label-size="md"
                    style="font-weight: 600"
                    label="New password :"
                  >
                    <b-form-input id="input-toeic_grade" type="password" />
                  </b-form-group>
                  <b-form-group
                    label-cols="3"
                    label-cols-lg="2"
                    label-size="md"
                    style="font-weight: 600"
                    label="Confirm password :"
                  >
                    <b-form-input id="input-toeic_grade" type="password" />
                  </b-form-group>
  
                </div>
  
                <div class="zone-button-submit">
                  <b-button @click="handleEditInfor()"> Submit </b-button>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
  </template>
  
  <script>
  import Dashboard from "../layout/Dashboard.vue";
  import { getAuth } from "firebase/auth";
  export default {
    name: "settingPage",
    components: {
      Dashboard,
    },
    data() {
      return {
        list: [],
        InformationUser: {
          username: "",
          fullname: "",
          email: "",
          password: "",
          telephone: "",
        },
      };
    },
    created() {
      const user = getAuth().currentUser;
      this.fullname = user.displayName;
    },
  
    methods: {
      isResetDataModal() {
        console.log("RESET DATA");
        this.InformationUser = {
          password: "",
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .title {
    position: fixed;
    width: 100%;
    top: 50px;
    background: #557b83;
    height: 40px;
    line-height: 40px;
    color: white;
    font-weight: 500;
    padding-left: 20px;
    z-index: 1;
  }
  .card {
    text-align: center;
  }
  .zone-button-submit {
    text-align: center;
  }
  .name{
      padding-top: 100px;
      height: 300px;
      background-color: #EEEEEE;
      text-align: center;
  }
  .name span{
      height:100px;
      width: 100px;
      margin-bottom: 10px;
  }
  </style>
  