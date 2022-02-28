<template>
  <div v-if="loading">
    <CSpinner v-if="loading" color="primary" style="width:4rem;height:4rem;" />
  </div>

  <div v-else>
    <CRow v-if="user">
      <CCol clas="w-100">
        <!--------------- Success toaster ----------------->
        <CToaster :autohide="3000">
          <template v-for="toast in successToasts">
            <CToast :key="'toast' + toast" :show="true" header="Success">
              {{ successMessage }}
            </CToast>
          </template>
        </CToaster>
        <!--------------- Error toaster end ----------------->
        <!--------------- Error toaster ----------------->
        <CToaster :autohide="3000">
          <template v-for="toast in errorToasts">
            <CToast
              :key="'toast' + toast"
              :show="true"
              header="An error occured"
            >
              Oops, an error occured: {{ errorMessage }}
            </CToast>
          </template>
        </CToaster>
        <!--------------- Error toaster end ----------------->

        <!---------------- Delete user modal ----------------->
        <CModal
          title="Create a new user"
          color="info"
          :show.sync="deleteUserModal"
        >
          <div slot="default">
            <CCol>
              Are you sure you want to delete this user?
            </CCol>
          </div>
          <div slot="footer">
            <CRow align-horizontal="end">
              <CCol class="m-1" v-if="deleteUserLoading">
                <CSpinner
                  v-if="deleteUserLoading"
                  color="primary"
                  style="width:3rem;height:3rem;"
                />
              </CCol>
              <CCol xs class="m-1" v-if="!deleteUserLoading">
                <CButton color="success" size="lg" v-on:click="removeUser">
                  Yes
                </CButton>
              </CCol>
              <CCol xs class="m-1" v-if="!deleteUserLoading">
                <CButton
                  color="danger"
                  size="lg"
                  v-on:click="deleteUserModal = false"
                >
                  No
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
                User Details
              </CCol>
              <CCol xs class="mr-2">
                <CButton :color="'info'" v-on:click="refetchData">
                  <CIcon :content="$options.reload" />
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CCol>
              <CDataTable hover striped :items="tableData"> </CDataTable>
              <CCol class="mb-2 mt-2" v-if="roleLoading">
                <CSpinner color="primary" style="width:3rem;height:3rem;" />
              </CCol>
              <CCol
                xs
                v-if="!roleLoading && role && role.role === 'admin'"
                class="mb-2 mt-2"
              >
                <CButton
                  color="success"
                  size="lg"
                  v-on:click="grantUserRole"
                  v-bind="{ variant: 'outline' }"
                  >Admin (Click to set to User)</CButton
                >
              </CCol>
              <CCol
                xs
                v-if="!roleLoading && role.role === 'user'"
                class="mb-2 mt-2"
              >
                <CButton
                  color="info"
                  size="lg"
                  v-on:click="grantAdminRole"
                  v-bind="{ variant: 'outline' }"
                  >User (Click to set to Admin)</CButton
                >
              </CCol>
              <CCol xs v-if="rolesRefresh" class="mt-2">
                <h6>Role updated! Wait and refresh to see changes.</h6>
              </CCol>
            </CCol>
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol>
                <CButton v-on:click="navigateBack" color="primary" size="lg"
                  >Back
                </CButton>
              </CCol>
              <CCol xs class="mr-2">
                <CButton
                  color="danger"
                  size="lg"
                  v-on:click="deleteUserModal = true"
                  >Delete</CButton
                >
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
        <CRow class="mt-2 mb-3 ml-2">
          <CCol xs class="mr-2">
            <CButton
              color="info"
              v-on:click="currentTable = 'notification_questionnaire_responses'"
            >
              Notification Questionnaire Responses
            </CButton>
          </CCol>
          <CCol xs class="mr-2">
            <CButton
              color="info"
              v-on:click="currentTable = 'inapp_questionnaire_responses'"
            >
              In-app Questionnaire Responses
            </CButton>
          </CCol>
          <CCol xs class="mr-2">
            <CButton
              color="info"
              v-on:click="currentTable = 'grouped_responses'"
            >
              Grouped Responses
            </CButton></CCol
          >
          <CCol xs>
            <CButton color="info" v-on:click="currentTable = 'files_list'">
              Uploaded Files
            </CButton></CCol
          >
        </CRow>
        <UserNQResponsesTable
          v-if="currentTable === 'notification_questionnaire_responses'"
          :responses="notificationQuestionnaireResponses"
        />
        <UserIAResponsesTable
          v-if="currentTable === 'inapp_questionnaire_responses'"
          :responses="inAppQuestionnaireResponses"
        />
        <UserGroupedResponsesList
          v-if="currentTable === 'grouped_responses'"
          :app_responses="inAppQuestionnaireResponses"
          :notif_responses="notificationQuestionnaireResponses"
        />
        <UserFilesList
          v-if="currentTable === 'files_list'"
          :files="documentsByOwner"
          :onDownload="downloadFile"
          :onDelete="deleteFile"
        />
      </CCol>
    </CRow>
  </div>
</template>

<script>
import UserQuery from "../../graphql/queries/USER.gql";
import RoleQuery from "../../graphql/queries/ROLE.gql";
import DocumentListQuery from "../../graphql/queries/DOCUMENT_LIST.gql";
import DocumentQuery from "../../graphql/queries/DOCUMENT.gql";
import DeleteDocumentMutation from "../../graphql/mutations/DELETE_DOCUMENT.gql";
import RemoveUserMutation from "../../graphql/mutations/UNREGISTER_USER.gql";
import GrantRoleMutation from "../../graphql/mutations/GRANT_ROLE.gql";
import NotificationQuestionnaireResponsesByUserQuery from "../../graphql/queries/NOTIFICATION_QUESTIONNAIRE_RESPONSES_BY_USER.gql";
import InAppQuestionnaireResponsesByUserQuery from "../../graphql/queries/IN_APP_QUESTIONNAIRE_RESPONSES_BY_USER.gql";
import { formatDateWithHourAndSeconds } from "../../util/DateUtils";
import { cilReload } from "@coreui/icons";
import download from "downloadjs";
import mime from "mime-types";
export default {
  name: "User",
  components: {
    UserNQResponsesTable: () => import("./UserNQResponsesTable.vue"),
    UserIAResponsesTable: () => import("./UserIAResponsesTable.vue"),
    UserGroupedResponsesList: () => import("./UserGroupedResponsesList.vue"),
    UserFilesList: () => import("./UserFilesList.vue"),
  },
  props: {
    id: String,
  },
  reload: cilReload,
  data() {
    return {
      user: null,
      role: null,
      tableData: null,
      loading: 0,
      rolesRefresh: false,
      roleLoading: 0,
      errorMessage: "",
      errorToasts: 0,
      successToasts: 0,
      successMessage: "",
      deleteUserLoading: false,
      deleteUserModal: false,
      notificationQuestionnaireResponses: [],
      inAppQuestionnaireResponses: [],
      documentsByOwner: [],
      currentTable: "notification_questionnaire_responses",
      allowedFields: [
        {
          display: "E-mail",
          field: "email",
        },
        {
          display: "Accepts notifications",
          field: "notificationsEnabled",
        },
        {
          display: "User ID",
          field: "_id",
        },
        {
          display: "First name",
          field: "firstName",
        },
        {
          display: "Last name",
          field: "lastName",
        },
        {
          display: "Creation date",
          field: "creationDate",
        },
        {
          display: "Age",
          field: "age",
        },
        {
          display: "Profile image",
          field: "profileImage",
        },
        {
          display: "Notification registration token",
          field: "fcmRegistrationToken",
        },
      ],
    };
  },
  watch: {
    role: {
      deep: true,
      immediate: true,
      handler(n, o) {
        console.log(
          "role watcher(new, old):",
          n?.role || null,
          o?.role || null
        );
      },
    },
    user: {
      deep: true,
      immediate: true,
      handler(user) {
        if (user) this.tableData = this.createTableData(user);
      },
    },
  },
  methods: {
    createTableData(user) {
      let data = [];
      for (const f of this.allowedFields) {
        const display = f.display;
        let prop = user[f.field];
        if (typeof prop == "boolean") {
          if (prop) prop = "Yes";
          else prop = "No";
        }
        if (f.field === "creationDate") {
          prop = formatDateWithHourAndSeconds(prop);
        }
        if (prop) {
          data.push({ field: display, value: prop });
        }
      }
      return data;
    },
    refetchData() {
      this.$apollo.queries.user.refetch();
      this.$apollo.queries.role.refetch();
    },
    refetchRole() {
      this.$apollo.queries.role.refetch();
    },
    navigateBack() {
      this.$router.go(-1);
    },
    capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    showErrorToast() {
      this.errorToasts = this.errorToasts + 1;
    },
    showSuccessToast() {
      this.successToasts = this.successToasts + 1;
    },
    grantUserRole() {
      this.grantRole("user");
    },
    grantAdminRole() {
      this.grantRole("admin");
    },
    grantRole(newRole) {
      const _this = this;
      const uid = this.id;
      if (!newRole || !uid) {
        console.log("error: missing role or uid.");
        return;
      }
      console.log("grantRole:", uid, newRole);
      this.$apollo
        .mutate({
          mutation: GrantRoleMutation,
          loadingKey: "roleLoading",
          variables: {
            role: newRole,
            uid: uid,
          },
        })
        .then((response) => {
          console.log("grantRole success: ", response.data.grantRole);
          const data = response.data.grantRole;
          _this.role = data;
          _this.successMessage = "Role successfully updated!";
          _this.rolesRefresh = true;
          _this.showSuccessToast();
        })
        .catch((error) => {
          console.log("grantRole error:", error);
        });
    },
    removeUser() {
      const _this = this;
      const id = this.id;
      this.deleteUserLoading = true;
      this.$apollo
        .mutate({
          mutation: RemoveUserMutation,
          variables: {
            _id: id,
          },
          loadingKey: _this.loading,
        })
        .then(function() {
          _this.deleteUserLoading = false;
          _this.$router.go(-1);
        })
        .catch(function(error) {
          _this.deleteUserLoading = false;
          _this.errorMessage = error;
          _this.showErrorToast();
        });
    },
    downloadFile(index) {
      const _this = this;
      const fileId = this.documentsByOwner[index]._id;
      const userId = this.id;
      if (fileId) {
        this.$apollo
          .query({
            query: DocumentQuery,
            variables: {
              ownerId: userId,
              _id: fileId,
            },
          })
          .then((result) => {
            const data = atob(result.data.documentByOwner.data);
            const mimeType = mime.lookup(result.data.documentByOwner.filename);
            const filename = result.data.documentByOwner.filename;
            download(data, filename, mimeType);
          })
          .catch((error) => {
            _this.errorMessage = error;
            _this.showErrorToast();
          });
      }
    },
    deleteFile(index) {
      const _this = this;
      const fileId = this.documentsByOwner[index]._id;
      const userId = this.id;
      if (fileId) {
        this.$apollo
          .mutate({
            mutation: DeleteDocumentMutation,
            variables: {
              ownerId: userId,
              _id: fileId,
            },
            refetchQueries: [
              {
                query: DocumentListQuery,
                loadingKey: "loading",
                variables: {
                  ownerId: userId,
                },
              },
            ],
          })
          .then((success) => {
            _this.successMessage = "File successfully deleted!";
            _this.showSuccessToast();
          })
          .catch((error) => {
            _this.errorMessage = error;
            _this.showErrorToast();
          });
      }
    },
  },
  apollo: {
    role: {
      query: RoleQuery,
      loadingKey: "roleLoading",
      variables() {
        return {
          uid: this.id,
        };
      },
    },
    user: {
      query: UserQuery,
      loadingKey: "loading",
      variables() {
        return {
          _id: this.id,
        };
      },
    },
    notificationQuestionnaireResponses: {
      query: NotificationQuestionnaireResponsesByUserQuery,
      loadingKey: "loading",
      variables() {
        return {
          user: this.id,
        };
      },
    },
    inAppQuestionnaireResponses: {
      query: InAppQuestionnaireResponsesByUserQuery,
      loadingKey: "loading",
      variables() {
        return {
          user: this.id,
        };
      },
    },
    documentsByOwner: {
      query: DocumentListQuery,
      loadingKey: "loading",
      variables() {
        return {
          ownerId: this.id,
        };
      },
    },
  },
};
</script>
