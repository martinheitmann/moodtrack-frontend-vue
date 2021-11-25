<template>
  <CCard>
    <CCardHeader>
      Send a test message
    </CCardHeader>
    <CCardBody>
      <CToaster :autohide="3000">
        <template v-for="toast in errorToasts">
          <CToast :key="'toast' + toast" :show="true" header="An error occured">
            {{ errorMessage }}
          </CToast>
        </template>
      </CToaster>
      <CToaster :autohide="3000">
        <template v-for="toast in successToasts">
          <CToast :key="'toast' + toast" :show="true" header="Success!">
            {{ successMessage }}
          </CToast>
        </template>
      </CToaster>
      <CCol>
        <CCol class="m-2">
          <CRow class="mb-4" align-vertical="center">
            <CCol xs class="mr-3">
              <CSwitch v-bind:checked.sync="dryRun" :color="'info'"> </CSwitch>
            </CCol>
            <CCol xs>
              <CRow>
                <CCol>
                  <h6>Dry run</h6>
                </CCol>
              </CRow>
              <CCol>
                <CRow>
                  Toggle if responses produced by notification interactions and
                  questionnaires should be ignored. Recommended to prevent
                  database pollution by test messages.
                </CRow>
              </CCol>
            </CCol>
          </CRow>
          <CRow>
            <h5>Send to a specified user</h5>
          </CRow>
          <CRow class="mb-2">
            <Multiselect
              v-if="users"
              v-model="selectedUser1"
              :options="usersWithTokens"
              :custom-label="getUserEmail"
              placeholder="Search users..."
              track-by="_id"
            >
            </Multiselect>
          </CRow>
          <CRow class="mb-2">
            <Multiselect
              v-model="selectedNotificationQuestionnaire1"
              :options="notificationQuestionnaires"
              :custom-label="getQuestionnaireName"
              placeholder="Search notification questionnaires..."
              track-by="_id"
            >
            </Multiselect>
          </CRow>
          <CRow class="mb-2">
            <Multiselect
              v-if="selectedNotificationQuestionnaire1"
              v-model="selectedNotificationQuestionnaireNode1"
              :options="rootNodes1"
              :custom-label="getNodeTime"
              placeholder="Select an entry node from questionnaire..."
              track-by="_id"
            >
            </Multiselect>
          </CRow>
          <CRow>
            <CButton v-on:click="sendMessage('n1')" :color="'info'">
              Submit
            </CButton>
          </CRow>
        </CCol>
        <CCol class="m-2">
          <CRow>
            <h5>Send to a specific Firebase Cloud Messaging token</h5>
          </CRow>
          <CRow>
            <CInput
              class="w-100"
              v-model="providedFcmToken"
              placeholder="Enter a valid FCM token..."
            />
          </CRow>
          <CRow class="mb-2">
            <Multiselect
              v-model="selectedNotificationQuestionnaire2"
              :options="notificationQuestionnaires"
              :custom-label="getQuestionnaireName"
              placeholder="Search notification questionnaires..."
              track-by="_id"
            >
            </Multiselect>
          </CRow>
          <CRow class="mb-2">
            <Multiselect
              v-if="selectedNotificationQuestionnaire2"
              v-model="selectedNotificationQuestionnaireNode2"
              :options="rootNodes2"
              :custom-label="getNodeTime"
              placeholder="Select an entry node from questionnaire..."
              track-by="_id"
            >
            </Multiselect>
          </CRow>
          <CRow>
            <CButton v-on:click="sendMessage('n2')" :color="'info'">
              Submit
            </CButton>
          </CRow>
        </CCol>
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import UsersQuery from "../../graphql/queries/USERS.gql";
import NotificationQuestionnairesQuery from "../../graphql/queries/NOTIFICATION_QUESTIONNAIRES.gql";
import NodesQuery from "../../graphql/queries/NODES.gql";
import SendMessageMutation from "../../graphql/mutations/SEND_MESSAGE.gql";
export default {
  name: "TestMessaging",
  components: {
    Multiselect: () => import("vue-multiselect"),
  },
  data() {
    return {
      // All elements
      users: [],
      notificationQuestionnaires: [],
      nodes1: [],
      nodes2: [],
      // Vars containing selected elements
      selectedUser1: null,
      selectedNotificationQuestionnaire1: null,
      selectedNotificationQuestionnaireNode1: null,
      providedFcmToken: null,
      selectedNotificationQuestionnaire2: null,
      selectedNotificationQuestionnaireNode2: null,
      // Toast message
      errorMessage: "",
      successMessage: "Message successfully sent to device!",
      errorToasts: 0,
      successToasts: 0,
      dryRun: true,
    };
  },
  watch: {
    selectedNotificationQuestionnaire1: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) this.nodes1 = null;
        else {
          if (val._id) this.queryNodes(val._id, "n1");
        }
      },
    },
    selectedNotificationQuestionnaire2: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) this.nodes2 = null;
        else {
          if (val._id) this.queryNodes(val._id, "n2");
        }
      },
    },
  },
  computed: {
    usersWithTokens: function() {
      return this.users.filter((element) => element.fcmRegistrationToken);
    },
    rootNodes1: function() {
      if (this.nodes1)
        return this.nodes1.filter(
          (n) =>
            n.isSourceNode &&
            !n.isArchived &&
            this.selectedNotificationQuestionnaire1?._id === n.nqId
        );
      return [];
    },
    rootNodes2: function() {
      if (this.nodes2)
        return this.nodes2.filter(
          (n) =>
            n.isSourceNode &&
            !n.isArchived &&
            this.selectedNotificationQuestionnaire2?._id === n.nqId
        );
      return [];
    },
  },
  methods: {
    getUserEmail(user) {
      return user.email;
    },
    getQuestionnaireName(questionnaire) {
      return questionnaire.name;
    },
    pad(num) {
      const str = num.toString();
      if (num === 0) return "00";
      else if (num > 9) return str;
      else return "0" + str;
    },
    getNodeTime(node) {
      if (node.data.type === "appquestionnaire") {
        const hour = node.data.appquestionnaire.timeOfDay.hour;
        const minute = node.data.appquestionnaire.timeOfDay.minute;
        const label = node.nodeLabel || "No label";
        return (
          "📝 " + label + " (" + this.pad(hour) + ":" + this.pad(minute) + ")"
        );
      }
      if (node.data.type === "question") {
        const hour = node.data.question.timeOfDay.hour;
        const minute = node.data.question.timeOfDay.minute;
        const label = node.nodeLabel || "No label";
        return (
          "🔔 " + label + " (" + this.pad(hour) + ":" + this.pad(minute) + ")"
        );
      }
    },
    displayToast(success, error) {
      if (success) {
        this.successToasts = this.successToasts + 1;
      }
      if (error) {
        this.errorToasts = this.errorToasts + 1;
      }
    },
    validateInputs(qid, fcmToken, timeOfDay) {
      let isValid = true;
      if (!qid || qid === "") {
        this.errorMessage =
          "Error: A valid notification questionnaire must be selected.";
        isValid = false;
      } else if (!fcmToken || fcmToken === "") {
        this.errorMessage =
          "Error: The selected user isn't registered to receive notifications.";
        isValid = false;
      } else if (!timeOfDay) {
        this.errorMessage =
          "Error: The selected starting question doesn't have a valid time of day defined.";
        isValid = false;
      } else if (!timeOfDay.hour && timeOfDay.hour !== 0) {
        this.errorMessage =
          "Error: The selected starting question doesn't have a valid time of day hour.";
        isValid = false;
      } else if (!timeOfDay.minute && timeOfDay.minute !== 0) {
        this.errorMessage =
          "Error: The selected starting question doesn't have a valid time of day minute.";
        isValid = false;
      }
      return isValid;
    },
    queryNodes(id, field) {
      // Capture the scope so we can ref it later.
      var _this = this;
      this.$apollo
        .query({
          query: NodesQuery,
          variables() {
            return {
              nqId: id,
            };
          },
        })
        .then(function(response) {
          // We can't ref 'this' in a promise.
          if (field === "n1") _this.nodes1 = response.data.nodes;
          if (field === "n2") _this.nodes2 = response.data.nodes;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getTimeOfDay(node) {
      if (node.data.type === "appquestionnaire") {
        return {
          minute: node.data.appquestionnaire.timeOfDay.minute,
          hour: node.data.appquestionnaire.timeOfDay.hour,
        };
      }
      if (node.data.type === "question") {
        return {
          minute: node.data.question.timeOfDay.minute,
          hour: node.data.question.timeOfDay.hour,
        };
      }
    },
    sendMessage(nx) {
      console.log(nx);
      let notificationQuestionnaireId;
      let timeOfDay;
      let fcmToken;
      let isValid;
      let isDryRun = this.dryRun;
      if (nx === "n1") {
        if (this.selectedUser1)
          fcmToken = this.selectedUser1.fcmRegistrationToken;
        if (this.selectedNotificationQuestionnaire1) {
          notificationQuestionnaireId = this.selectedNotificationQuestionnaire1
            ._id;
          if (this.selectedNotificationQuestionnaireNode1) {
            timeOfDay = this.getTimeOfDay(
              this.selectedNotificationQuestionnaireNode1
            );
          }
        }
        isValid = this.validateInputs(
          notificationQuestionnaireId,
          fcmToken,
          timeOfDay
        );
      }
      if (nx === "n2") {
        notificationQuestionnaireId = this.selectedNotificationQuestionnaire2
          ._id;
        timeOfDay = this.getTimeOfDay(
          this.selectedNotificationQuestionnaireNode2
        );
        fcmToken = this.providedFcmToken;
        isValid = this.validateInputs(
          notificationQuestionnaireId,
          fcmToken,
          timeOfDay
        );
      }
      const _this = this;
      if (isValid)
        this.$apollo
          .mutate({
            mutation: SendMessageMutation,
            variables: {
              notificationMessage: {
                notificationQuestionnaireId: notificationQuestionnaireId,
                timeOfDay: timeOfDay,
                fcmToken: fcmToken,
                isDryRun: isDryRun,
              },
            },
          })
          .then(function(data) {
            _this.displayToast(true, null);
          })
          .catch(function(error) {
            console.log(error);
          });
      else this.displayToast(null, true);
    },
  },
  apollo: {
    users: {
      query: UsersQuery,
    },
    notificationQuestionnaires: {
      query: NotificationQuestionnairesQuery,
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
