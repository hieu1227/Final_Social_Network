<template>
  <div>
    <section class="vh-100">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-6 text-black">
            <div class="px-5 ms-xl-4">
              <i
                class="fas fa-crow fa-2x me-3 pt-5 mt-xl-4"
                style="color: #709085"
              ></i>
            </div>

            <div
              class="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-6 pt-5"
            >
              <form style="width: 23rem">
                <h3 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px">
                  Register
                </h3>

                <div class="form-outline mb-4">
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    v-model="fullname"
                  />
                  <label class="form-label" for="form2Example18"
                    >Full Name</label
                  >
                </div>

                <div class="form-outline mb-4">
                  <input
                    v-model="email"
                    type="email"
                    id="form2Example18"
                    class="form-control form-control-lg"
                  />
                  <label class="form-label" for="form2Example18"
                    >Email address</label
                  >
                </div>

                <div class="form-outline mb-4">
                  <input
                    v-model="password"
                    type="password"
                    id="form2Example28"
                    class="form-control form-control-lg"
                  />
                  <label class="form-label" for="form2Example28"
                    >Password</label
                  >
                </div>

                <div class="pt-1 mb-4">
                  <button
                    class="btn btn-info btn-lg btn-block"
                    type="button"
                    @click="register"
                  >
                    Sign Up
                  </button>
                </div>

                <div v-if="error">
                  {{ error.message }}
                </div>
                <p>
                  I'm already a member. {{ errorCode }}
                  <router-link to="/">Sign In</router-link>
                </p>
              </form>
            </div>
          </div>
          <div class="col-sm-6 px-0 d-none d-sm-block">
            <img
              src="https://media-api.advertisingvietnam.com/oapi/v1/media?uuid=b86f56a1-75aa-40ad-b4e2-dd4b54afed2a&resolution=1000x&keepOriginal=true"
              alt="Login image"
              class="w-100 vh-100"
              style="object-fit: cover; object-position: left"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { MakeToast } from '@/toast/toastMessage';
export default {
  name: "RegisterPage",
  data() {
    return {
      fullname: "",
      email: "",
      password: "",
      message: "",
      user: [],
    };
  },
  created() {
  },
  methods: {
    async register() {
      const db = getFirestore();
      const auth = getAuth();
      // const user = auth.currentUser;
      createUserWithEmailAndPassword(
        auth,
        this.email,
        this.password,
        this.fullname
      ).then(
        async (res) => {
          console.log(res);
          updateProfile(auth.currentUser, { displayName: this.fullname });
          try {
            const docRef = await addDoc(collection(db, "users"), {
              fullname: this.fullname,
              email: this.email,
              id: getAuth().currentUser.uid,
            });
            MakeToast({
						variant: 'success',
						title: 'Success',
						content: 'Register Successfully'
					});
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.log("Error adding document: ", e);
          }
        },
        (err) => {
          const errorMessage = err.message;
          const errorCode = err.code;
          console.log(errorMessage);
          console.log(errorCode);
          MakeToast({
						variant: 'warning',
						title: 'Warning',
						content: errorMessage
					});
        }
      );
    },
  },
};
</script>

<style></style>
