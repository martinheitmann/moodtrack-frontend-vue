<template>
  <CCol>
    <!---------------- New  questionnaire modal ----------------->
    <CModal
      title="New In-App Questionnaire "
      color="info"
      :show.sync="newQuestionnaireModal"
    >
      <div slot="default">
        <CCol>
          <CRow>
            <CCol>
              <CInput
                placeholder="Provide a name for your questionnaire..."
                v-model="questionnaireName"
              >
              </CInput>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CTextarea
                placeholder="Provide a description for your questionnaire (optional)."
                v-model="questionnaireDesc"
              >
              </CTextarea>
            </CCol>
          </CRow>
        </CCol>
      </div>
      <div slot="footer">
        <CRow align-horizontal="end">
          <CCol class="m-1" v-if="createQuestionnaireLoading">
            <CSpinner
              v-if="createQuestionnaireLoading"
              color="primary"
              style="width:3rem;height:3rem;"
            />
          </CCol>
          <CCol xs class="m-1" v-if="!createQuestionnaireLoading">
            <CButton color="success" size="lg" v-on:click="createQuestionnaire">
              Create
            </CButton>
          </CCol>
          <CCol xs class="m-1" v-if="!createQuestionnaireLoading">
            <CButton
              color="danger"
              size="lg"
              v-on:click="newQuestionnaireModal = false"
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
                    In-app Questionnaires
                  </CCol>
                  <CCol v-if="currentListMode === 'ARCHIVED'">
                    Archived In-app Questionnaires
                  </CCol>
                  <CCol xs>
                    <CButton
                      :color="'info'"
                      v-on:click="newQuestionnaireModal = true"
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
              <InAppQuestionnairesList
                v-if="currentListMode === 'AVAILABLE'"
                :questionnaires="availableQuestionnaires"
                :onDeleteItem="deleteQuestionnaire"
                :onArchiveItem="archiveQuestionnaire"
              />
              <ArchivedInAppQuestionnairesList
                v-if="currentListMode === 'ARCHIVED'"
                :questionnaires="archivedQuestionnaires"
                :onRestoreItem="restoreQuestionnaire"
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
import QuestionnairesQuery from "../../graphql/queries/IN_APP_QUESTIONNAIRES.gql";
import CreateQuestionnaireMutation from "../../graphql/mutations/CREATE_IN_APP_QUESTIONNAIRE.gql";
import DeleteQuestionnaireMutation from "../../graphql/mutations/DELETE_IN_APP_QUESTIONNAIRE.gql";
import ArchiveQuestionnaireMutation from "../../graphql/mutations/ARCHIVE_IN_APP_QUESTIONNAIRE.gql";
import RestoreQuestionnaireMutation from "../../graphql/mutations/RESTORE_IN_APP_QUESTIONNAIRE.gql";
export default {
  name: "InAppQuestionnaires",
  X: cilX,
  plus: cilPlus,
  check: cilCheckCircle,
  folder: cilFolderOpen,
  components: {
    InAppQuestionnairesList: () => import("./InAppQuestionnairesList.vue"),
    ArchivedInAppQuestionnairesList: () =>
      import("./ArchivedInAppQuestionnairesList.vue"),
  },
  data() {
    return {
      newQuestionnaireModal: false,
      creationMode: false,
      questionnaireName: "",
      questionnaireDesc: "",
      questionnaires: [],
      createQuestionnaireLoading: 0,
      availableQuestionnaires: [],
      archivedQuestionnaires: [],
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
    deleteQuestionnaire(questionnaire) {
      this.$apollo
        .mutate({
          mutation: DeleteQuestionnaireMutation,
          variables: {
            _id: questionnaire._id,
          },
          refetchQueries: [
            {
              query: QuestionnairesQuery,
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
    createQuestionnaire() {
      const _this = this;
      if (!this.questionnaireName || this.questionnaireDesc === "") return;
      this.$apollo
        .mutate({
          mutation: CreateQuestionnaireMutation,
          loadingKey: this.createQuestionnaireLoading,
          variables: {
            questionnaire: {
              name: this.questionnaireName,
              description: this.questionnaireDesc,
              creationDate: new Date(),
              isArchived: false,
            },
          },
          refetchQueries: [
            {
              query: QuestionnairesQuery,
            },
          ],
        })
        .then((data) => {
          console.log("success! Data received: " + JSON.stringify(data));
          _this.newQuestionnaireModal = false;
        })
        .catch((error) => {
          console.log("Oh no! Error: " + error);
          //this.errorMessage = error.toString()
          //this.addFixedToast()
        });
    },
    archiveQuestionnaire(_id) {
      this.$apollo.mutate({
        mutation: ArchiveQuestionnaireMutation,
        variables: {
          _id: _id,
        },
        refetchQueries: [
          {
            query: QuestionnairesQuery,
          },
        ],
      });
    },
    restoreQuestionnaire(_id) {
      this.$apollo.mutate({
        mutation: RestoreQuestionnaireMutation,
        variables: {
          _id: _id,
        },
        refetchQueries: [
          {
            query: QuestionnairesQuery,
          },
        ],
      });
    },
  },
  apollo: {
    inAppQuestionnaires: {
      loadingKey: "loading",
      query: QuestionnairesQuery,
      update(data) {
        if (data.inAppQuestionnaires && data.inAppQuestionnaires.length > 0) {
          const mQuestionnaires = data.inAppQuestionnaires.filter(
            (n) => !n.isArchived || n.isArchived === false
          );
          const mArchivedQuestionnaires = data.inAppQuestionnaires.filter(
            (n) => n.isArchived && n.isArchived === true
          );
          this.archivedQuestionnaires = mArchivedQuestionnaires;
          this.availableQuestionnaires = mQuestionnaires;
        }
      },
    },
  },
};
</script>
