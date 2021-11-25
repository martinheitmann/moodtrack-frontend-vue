<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    v-model="email"
                    placeholder="Username"
                    autocomplete="username email"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-user"
                    /></template>
                  </CInput>
                  <CInput
                    v-model="password"
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-lock-locked"
                    /></template>
                  </CInput>
                  <CRow align-horizontal="center">
                    <CCol v-if="!isLoading" class="text-left">
                      <CButton
                        :block="true"
                        color="primary"
                        v-on:click="authenticate()"
                        >Login</CButton
                      >
                    </CCol>
                    <CCol v-else xs>
                      <CSpinner color="info" />
                    </CCol>
                  </CRow>
                  <CRow class="mt-2">
                    <CCol class="text-right">
                      <p style="color:red;">{{ errorMessage }}</p>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard
              color="primary"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <h2>MoodTrack</h2>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import firebase from "firebase";
import TestAdminQuery from "../../graphql/queries/TEST_ADMIN.gql";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: null,
      isLoading: false,
    };
  },
  methods: {
    authenticate() {
      const _this = this;
      const navigate = this.$router;
      const password = this.password;
      const email = this.email;
      this.isLoading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
          var user = userCredential.user;
          firebase
            .auth()
            .currentUser.getIdToken(/* forceRefresh */ true)
            .then(function(idToken) {
              _this.$store.commit("setIdToken", idToken);
              _this
                .checkAdmin()
                .then((result) => {
                  console.log("Signed in user: " + JSON.stringify(user));
                  navigate.push("/");
                })
                .catch((error) => {
                  _this.errorMessage =
                    "Unable to verify user permission. Contact an administrator.";
                });
            })
            .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorCode + ":" + errorMessage);
            })
            .finally(function() {
              _this.isLoading = false;
            });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode + ":" + errorMessage);
        });
    },
    checkAdmin() {
      return new Promise((resolve, reject) => {
        this.$apollo
          .query({
            query: TestAdminQuery,
          })
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
</script>
