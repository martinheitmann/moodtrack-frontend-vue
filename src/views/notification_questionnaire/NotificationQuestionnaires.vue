<template>
  <CCol>
    <!---------------- New notification questionnaire modal ----------------->
    <CModal
      title="New Notification Questionnaire "
      color="info"
      :show.sync="newNotificationQuestionnaireModal"
    >
      <div slot="default">
        <CCol>
          <CRow>
            <CCol>
              <CInput
                placeholder="Provide a name for your notification questionnaire..."
                v-model="notificationQuestionnaireName"
              >
              </CInput>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CTextarea
                placeholder="Provide a description for your notification questionnaire (optional)."
                v-model="notificationQuestionnaireDesc"
              >
              </CTextarea>
            </CCol>
          </CRow>
        </CCol>
      </div>
      <div slot="footer">
        <CRow align-horizontal="end">
          <CCol class="m-1" v-if="createNotificationQuestionnaireLoading">
            <CSpinner
              v-if="createNotificationQuestionnaireLoading"
              color="primary"
              style="width:3rem;height:3rem;"
            />
          </CCol>
          <CCol xs class="m-1" v-if="!createNotificationQuestionnaireLoading">
            <CButton
              color="success"
              size="lg"
              v-on:click="createNotificationQuestionnaire"
            >
              Create
            </CButton>
          </CCol>
          <CCol xs class="m-1" v-if="!createNotificationQuestionnaireLoading">
            <CButton
              color="danger"
              size="lg"
              v-on:click="newNotificationQuestionnaireModal = false"
            >
              Cancel
            </CButton>
          </CCol>
        </CRow>
      </div>
    </CModal>
    <!-------------- Modal end ---------------------------->
    <CRow>
      <CCol col="12" xl="8">
        <CCard class="mt-2">
          <CCardHeader>
            <CRow>
              <CCol>
                <CRow align-vertical="center" align-horizontal="center">
                  <CCol v-if="currentListMode === 'AVAILABLE'">
                    Notification Questionnaires
                  </CCol>
                  <CCol v-if="currentListMode === 'ARCHIVED'">
                    Archived Notification Questionnaires
                  </CCol>
                  <CCol xs>
                    <CButton
                      :color="'info'"
                      v-on:click="newNotificationQuestionnaireModal = true"
                      >New Questionnaire</CButton
                    ></CCol
                  >
                  <CCol
                    xs
                    class="mr-2 ml-2"
                    v-if="currentListMode === 'AVAILABLE'"
                  >
                    <CButton
                      :color="'info'"
                      v-on:click="setListMode('ARCHIVED')"
                      >Show Archived</CButton
                    ></CCol
                  >
                  <CCol
                    xs
                    class="mr-2 ml-2"
                    v-if="currentListMode === 'ARCHIVED'"
                  >
                    <CButton
                      :color="'info'"
                      v-on:click="setListMode('AVAILABLE')"
                      >Show Available</CButton
                    ></CCol
                  >
                </CRow>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CCol>
              <CRow v-if="creationMode" class="mb-3">
                <CCol>
                  <CInput
                    placeholder="Provide a name for your notification questionnaire..."
                    v-model="notificationQuestionnaireName"
                  >
                  </CInput>
                </CCol>
                <CCol xs>
                  <CButton
                    class="mr-3"
                    :size="'sm'"
                    :color="'info'"
                    v-on:click="createNotificationQuestionnaire"
                  >
                    <CRow align-vertical="center" class="p-2">
                      <CCol>
                        Create
                      </CCol>
                    </CRow>
                  </CButton>
                </CCol>
              </CRow>
              <NotificationQuestionnairesList
                v-if="currentListMode === 'AVAILABLE'"
                :notificationQuestionnaires="
                  availableNotificationQuestionnaires
                "
                :onDeleteItem="deleteNotificationQuestionnaire"
                :onToggleActivation="activateNotificationQuestionnaire"
                :onArchiveItem="archiveNotificationQuestionnaire"
              />
              <ArchivedNotificationQuestionnairesList
                v-if="currentListMode === 'ARCHIVED'"
                :notificationQuestionnaires="archivedNotificationQuestionnaires"
                :onRestoreItem="restoreNotificationQuestionnaire"
              />
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CCol>
</template>

<script>
import { cilX, cilPlus, cilCheckCircle, cilFolderOpen } from "@coreui/icons";
import NotificationQuestionnairesQuery from "../../graphql/queries/NOTIFICATION_QUESTIONNAIRES.gql";
import CreateNotificationQuestionnaireMutation from "../../graphql/mutations/CREATE_NOTIFICATION_QUESTIONNAIRE.gql";
import DeleteNotificationQuestionnaireMutation from "../../graphql/mutations/DELETE_NOTIFICATION_QUESTIONNAIRE.gql";
import ToggleNotificationQuestionnaireMutation from "../../graphql/mutations/TOGGLE_NOTIFICATION_QUESTIONNAIRE.gql";
import ArchiveNotificationQuestionnaireMutation from "../../graphql/mutations/ARCHIVE_NOTIFICATION_QUESTIONNAIRE.gql";
import RestoreNotificationQuestionnaireMutation from "../../graphql/mutations/RESTORE_NOTIFICATION_QUESTIONNAIRE.gql";
export default {
  name: "NotificationQuestionnaires",
  X: cilX,
  plus: cilPlus,
  check: cilCheckCircle,
  folder: cilFolderOpen,
  components: {
    NotificationQuestionnairesList: () =>
      import("./NotificationQuestionnairesList"),
    ArchivedNotificationQuestionnairesList: () =>
      import("./ArchivedNotificationQuestionnairesList.vue"),
  },
  data() {
    return {
      newNotificationQuestionnaireModal: false,
      creationMode: false,
      notificationQuestionnaireName: "",
      notificationQuestionnaireDesc: "",
      notificationQuestionnaires: [],
      createNotificationQuestionnaireLoading: 0,
      availableNotificationQuestionnaires: [],
      archivedNotificationQuestionnaires: [],
      listItems: [],
      currentListMode: "AVAILABLE",
    };
  },
  methods: {
    setListMode(mode) {
      if (mode === "AVAILABLE" || mode === "ARCHIVED")
        this.currentListMode = mode;
      else
        throw new Error(
          "Invalid list mode. Mode must be 'AVAILABLE' or 'ARCHIVED'. Received " +
            mode
        );
    },
    formatActiveQsTextBool(bool) {
      if (bool) return "Active";
      else return "Disabled";
    },
    toggleCreationMode() {
      if (this.creationMode) this.notificationQuestionnaireName = "";
      this.creationMode = !this.creationMode;
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
    onDeleteItemClicked(index) {
      this.questionSets.splice(index, 1);
    },
    deleteNotificationQuestionnaire(notificationQuestionnaire) {
      this.$apollo
        .mutate({
          mutation: DeleteNotificationQuestionnaireMutation,
          variables: {
            _id: notificationQuestionnaire._id,
          },
          refetchQueries: [
            {
              query: NotificationQuestionnairesQuery,
            },
          ],
        })
        .then((data) => {
          console.log("success! Data received: " + JSON.stringify(data));
        })
        .catch((error) => {
          console.log("Oh no! Error: " + error);
          //this.errorMessage = error.toString()
          //this.addFixedToast()
        });
    },
    createNotificationQuestionnaire() {
      const _this = this;
      if (
        !this.notificationQuestionnaireName ||
        this.notificationQuestionnaireName === ""
      )
        return;
      this.$apollo
        .mutate({
          mutation: CreateNotificationQuestionnaireMutation,
          loadingKey: this.createNotificationQuestionnaireLoading,
          variables: {
            notificationQuestionnaire: {
              name: this.notificationQuestionnaireName,
              description: this.notificationQuestionnaireDesc,
              created: new Date(),
            },
          },
          refetchQueries: [
            {
              query: NotificationQuestionnairesQuery,
            },
          ],
        })
        .then((data) => {
          console.log("success! Data received: " + JSON.stringify(data));
          _this.newNotificationQuestionnaireModal = false;
        })
        .catch((error) => {
          console.log("Oh no! Error: " + error);
          //this.errorMessage = error.toString()
          //this.addFixedToast()
        });
    },
    activateNotificationQuestionnaire(_id, name, desc, isActive) {
      this.$apollo.mutate({
        mutation: ToggleNotificationQuestionnaireMutation,
        variables: {
          _id: _id,
          name: name,
          description: desc,
          isActive: isActive,
        },
        refetchQueries: [
          {
            query: NotificationQuestionnairesQuery,
          },
        ],
      });
    },
    archiveNotificationQuestionnaire(_id) {
      this.$apollo.mutate({
        mutation: ArchiveNotificationQuestionnaireMutation,
        variables: {
          _id: _id,
        },
        refetchQueries: [
          {
            query: NotificationQuestionnairesQuery,
          },
        ],
      });
    },
    restoreNotificationQuestionnaire(_id) {
      this.$apollo.mutate({
        mutation: RestoreNotificationQuestionnaireMutation,
        variables: {
          _id: _id,
        },
        refetchQueries: [
          {
            query: NotificationQuestionnairesQuery,
          },
        ],
      });
    },
  },
  apollo: {
    notificationQuestionnaires: {
      loadingKey: "loading",
      query: NotificationQuestionnairesQuery,
      update(data) {
        if (
          data.notificationQuestionnaires &&
          data.notificationQuestionnaires.length > 0
        ) {
          const mNotificationQuestionnaires = data.notificationQuestionnaires.filter(
            (n) => !n.isArchived || n.isArchived === false
          );
          const mArchivedNotificationQuestionnaires = data.notificationQuestionnaires.filter(
            (n) => n.isArchived && n.isArchived === true
          );
          this.archivedNotificationQuestionnaires = mArchivedNotificationQuestionnaires;
          this.availableNotificationQuestionnaires = mNotificationQuestionnaires;
        }
      },
    },
  },
};
</script>
