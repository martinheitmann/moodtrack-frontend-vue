<template>
  <div v-if="loading">
    <CSpinner v-if="loading" color="primary" style="width:4rem;height:4rem;" />
  </div>

  <div v-else>
    <CRow v-if="users">
      <CCol col="12" xl="8">
        <!------------------- Error toaster ---------------------->
        <CToaster :autohide="3000">
          <template v-for="toast in errorToasts">
            <CToast
              :key="'toast' + toast"
              :show="true"
              header="An error occured..."
            >
              {{ errorMessage }}
            </CToast>
          </template>
        </CToaster>
        <!---------------- End Error toaster --------------------->

        <!------------------- Success toaster ---------------------->
        <CToaster :autohide="3000">
          <template v-for="toast in successToasts">
            <CToast :key="'toast' + toast" :show="true" header="Success!">
              {{ successMessage }}
            </CToast>
          </template>
        </CToaster>
        <!---------------- End Success toaster --------------------->

        <!---------------- Create new user modal ----------------->
        <CModal
          title="Create a new user"
          color="info"
          :show.sync="createUserModal"
        >
          <div slot="default">
            <CCol>
              <CRow>
                <CCol>
                  <CRow>
                    Provide an email address for the new user:
                  </CRow>
                  <CRow>
                    <CInput
                      placeholder="E-mail"
                      v-model="newUserEmail"
                      class="w-100"
                    />
                  </CRow>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CRow>
                    Provide a password for the new user:
                  </CRow>
                  <CRow>
                    <CInput
                      placeholder="Password"
                      v-model="newUserPassword"
                      class="w-100"
                    />
                  </CRow>
                </CCol>
              </CRow>
            </CCol>
          </div>
          <div slot="footer">
            <CRow align-horizontal="end">
              <CCol class="m-1" v-if="addUserLoading">
                <CSpinner
                  v-if="addUserLoading"
                  color="primary"
                  style="width:3rem;height:3rem;"
                />
              </CCol>
              <CCol xs class="m-1" v-if="!addUserLoading">
                <CButton color="success" size="lg" v-on:click="registerUser">
                  Create
                </CButton>
              </CCol>
              <CCol xs class="m-1" v-if="!addUserLoading">
                <CButton
                  color="danger"
                  size="lg"
                  v-on:click="createUserModal = false"
                >
                  Cancel
                </CButton>
              </CCol>
            </CRow>
          </div>
        </CModal>
        <!--------------- End modal ------------->

        <CCard>
          <CCardHeader>
            <CRow>
              <CCol>
                Users
              </CCol>
              <CCol xs class="mr-2">
                <CButton :color="'info'" v-on:click="createUserDialog">
                  <CIcon :content="$options.plus" />
                </CButton>
              </CCol>
              <CCol xs class="mr-2">
                <CButton :color="'info'" v-on:click="refetchData">
                  <CIcon :content="$options.reload" />
                </CButton>
              </CCol>
            </CRow>
            <CCol> </CCol>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              hover
              striped
              :items="users"
              :fields="fields"
              items-per-page-select
              :items-per-page="50"
              clickable-rows
              :active-page="activePage"
              @row-clicked="rowClicked"
              :pagination="{ doubleArrows: false, align: 'center' }"
              @page-change="pageChange"
              sorter
              column-filter
              table-filter
            >
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import UsersQuery from "../../graphql/queries/USERS.gql";
import RegisterUserMutation from "../../graphql/mutations/REGISTER_USER.gql";
import { cilReload, cilPlus } from "@coreui/icons";
export default {
  name: "Users",
  reload: cilReload,
  plus: cilPlus,
  data() {
    return {
      loading: 0,
      users: [],
      formattedUsers: [],
      fields: [
        { key: "email", label: "Email" },
        { key: "creationDate", label: "Created" },
      ],
      activePage: 1,
      createUserModal: false,
      newUserPassword: "",
      newUserEmail: "",
      successToasts: 0,
      errorToasts: 0,
      successMessage: "",
      errorMessage: "",
      addUserLoading: false,
    };
  },
  created() {
    this.refetchData();
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
    users: function(users) {
      const ret = [];
      if (users && users.length > 0) {
        for (const user of users) {
          const modifiedUser = user;
          if (user.creationDate) {
            const date = user.creationDate;
            const formatted = this.formatDate(date);
            modifiedUser.creationDate = formatted;
          }
          ret.push(modifiedUser);
        }
        this.formattedUsers = ret;
      }
    },
  },
  methods: {
    showSuccessToast(message) {
      this.successMessage = message;
      this.successToasts = this.successToasts + 1;
    },
    showErrorToast(message) {
      this.errorMessage = message;
      this.errorToasts = this.errorToasts + 1;
    },
    refetchData() {
      this.$apollo.queries.users.refetch();
    },
    rowClicked(item) {
      this.$router.push({ path: `users/${item._id}` });
    },
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    formatDate(date) {
      try {
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const msec = Date.parse(date);
        var date = new Date(msec);
        const dateString = date.toLocaleDateString("en-US", options);
        return dateString;
      } catch (err) {
        console.log(err);
        return "";
      }
    },
    createUserDialog() {
      this.createUserModal = true;
    },
    closeCreateUserDialog() {
      this.createUserModal = false;
    },
    registerUser() {
      const _this = this;
      const password = this.newUserPassword;
      const email = this.newUserEmail;
      if (email && email.length > 0 && password && password.length > 0) {
        this.addUserLoading = this.addUserLoading + 1;
        this.$apollo
          .mutate({
            mutation: RegisterUserMutation,
            variables: {
              email: email,
              password: password,
            },
            loadingKey: "addUserLoading",
            refetchQueries: [
              {
                loadingKey: "loading",
                query: UsersQuery,
              },
            ],
          })
          .then(function() {
            _this.showSuccessToast(
              "Successfully created and registered new user!"
            );
            _this.closeCreateUserDialog();
            _this.addUserLoading = _this.addUserLoading - 1;
          })
          .catch(function(error) {
            _this.showErrorToast("Oops! An error occured: " + error);
            _this.addUserLoading = _this.addUserLoading - 1;
          });
      }
    },
  },
  apollo: {
    users: {
      loadingKey: "loading",
      query: UsersQuery,
    },
  },
};
</script>
