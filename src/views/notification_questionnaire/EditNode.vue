<template>
  <CCol>
    <ConfirmCancelModal
      :isVisible="archiveNodeModal"
      message="Are you sure you want to archive the node? You can restore it later."
      :isLoading="archiveNodeLoading"
      :onPositive="archiveNode"
      :onNegative="
        () => {
          archiveNodeModal = false;
        }
      "
    />

    <!-- EDIT NODE VIEW -->
    <CRow class="m-2">
      <CCard class="w-100">
        <CCardHeader>
          <CRow align-vertical="center">
            <CCol> Edit Node ({{ node._id || "Unnown Node ID" }})</CCol>
            <CCol xs class="mr-2">
              <CButton :size="'sm'" :color="'info'" v-on:click="copyData"
                ><CIcon :content="$options.copy"
              /></CButton>
            </CCol>
            <CCol xs class="mr-2">
              <CButton
                :size="'sm'"
                :color="'warning'"
                v-on:click="archiveNodeModal = true"
                ><CIcon :content="$options.folder"
              /></CButton>
            </CCol>
            <CCol xs>
              <CButton :size="'sm'" :color="'danger'" v-on:click="closeWindow"
                ><CIcon :content="$options.X"
              /></CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CCol>
            <CRow align-vertical="center" class="mb-2">
              <CCol xs>
                Initial Question
              </CCol>
              <CCol xs class="ml-2">
                <CSwitch
                  :color="'info'"
                  v-bind:checked.sync="isInitialQuestion"
                />
              </CCol>
            </CRow>
            <CRow v-if="isInitialQuestion" class="mb-1">Notification Time</CRow>
            <CRow
              class="mb-2"
              v-if="isInitialQuestion"
              :align-horizontal="'start'"
            >
              <CCol xs
                ><vue-timepicker v-model="timeOfDay"></vue-timepicker
              ></CCol>
            </CRow>
            <CRow>
              <CInput
                class="w-100"
                label="Node Label:"
                placeholder="Provide a node label..."
                v-model="nodeLabel"
              />
            </CRow>
            <CRow v-if="selectedNodeType.value === 'QUESTION'">
              <CInput
                class="w-100"
                label="Question:"
                placeholder="Provide your question..."
                v-model="questionText"
              />
            </CRow>

            <CRow
              align-vertical="center"
              class="mt-2 mb-2"
              v-if="selectedNodeType.value === 'QUESTION'"
            >
              <CCol xs>
                Enable calendar icon visible
              </CCol>
              <CCol xs class="ml-2">
                <CSwitch :color="'info'" v-bind:checked.sync="visible" />
              </CCol>
            </CRow>

            <CRow v-if="selectedNodeType.value === 'QUESTION'">Choices:</CRow>
            <CRow
              class="mt-1 mb-3"
              v-if="selectedNodeType.value === 'QUESTION'"
            >
              <SelectedChoicesList
                :choices="choices"
                :onSwitchUp="switchUp"
                :onSwitchDown="switchDown"
                :onDelete="deleteChoice"
              />
            </CRow>

            <CRow v-if="selectedNodeType.value === 'QUESTION'">
              <NewChoiceInput
                :availableIcons="icons"
                :choiceTypeOptions="choiceTypeOptions"
                :onSubmit="addChoice"
              />
            </CRow>
            <CRow
              class="mb-2"
              v-if="selectedNodeType.value === 'IN_APP_QUESTIONNAIRE'"
            >
              <Multiselect
                v-model="selectedInAppQuestionnaire"
                :options="inAppQuestionnaires"
                placeholder="Select a questionnaire..."
                label="name"
                track-by="_id"
              />
            </CRow>

            <CRow
              class="mt-2"
              v-if="
                selectedNodeType.value === 'IN_APP_QUESTIONNAIRE' &&
                  isInitialQuestion
              "
            >
              <CInput
                v-model="customTitleInput"
                class="w-100"
                placeholder="Provide a message title (optional)"
              >
              </CInput
            ></CRow>
            <CRow
              class="mb-2"
              v-if="
                selectedNodeType.value === 'IN_APP_QUESTIONNAIRE' &&
                  isInitialQuestion
              "
            >
              <CInput
                v-model="customBodyInput"
                class="w-100"
                placeholder="Provide a message body (optional)"
              >
              </CInput
            ></CRow>
            <CRow
              class="mt-4"
              v-if="
                selectedNodeType.value === 'QUESTION' ||
                  selectedNodeType.value === 'IN_APP_QUESTIONNAIRE'
              "
            >
              <CButton :color="'info'" :block="true" v-on:click="submitData">
                Edit Node
              </CButton>
            </CRow>
          </CCol>
        </CCardBody>
      </CCard>
    </CRow>
    <!-- EDIT NODE VIEW END -->
  </CCol>
</template>

<script>
import {
  cilX,
  cilChevronTop,
  cilChevronBottom,
  cilCopy,
  cilFolderOpen,
} from "@coreui/icons";
import "vue2-timepicker/dist/VueTimepicker.css";
export default {
  // Icons start
  copy: cilCopy,
  X: cilX,
  top: cilChevronTop,
  bottom: cilChevronBottom,
  folder: cilFolderOpen,
  // Icons end
  name: "EditNode",
  props: {
    node: Object,
    onSubmit: Function,
    onClose: Function,
    onCopy: Function,
    onArchive: Function,
    icons: Array,
    inAppQuestionnaires: Array,
  },
  components: {
    ConfirmCancelModal: () => import("./components/ConfirmCancelModal.vue"),
    NewChoiceInput: () => import("./components/NewChoiceInput.vue"),
    SelectedChoicesList: () => import("./components/SelectedChoicesList.vue"),
    Multiselect: () => import("vue-multiselect"),
    VueTimepicker: () => import("vue2-timepicker"),
  },
  watch: {
    node: {
      deep: true,
      immediate: true,
      handler(val) {
        const node = val;
        if (node) {
          this.nodeId = node._id;
          if (node.isSourceNode) {
            this.isInitialQuestion = true;
          } else {
            this.isInitialQuestion = false;
          }
          if (node.nodeLabel) {
            this.nodeLabel = node.nodeLabel;
          } else {
            this.nodeLabel = "";
          }
          if (node.data) {
            const data = node.data;
            if (data.type === "question") {
              this.selectedNodeType = {
                display: "Question",
                value: "QUESTION",
              };
              if (data.question) {
                const question = data.question;
                this.questionText = question.questionText;
                this.visible = question.visible;
                this.choices = question.questionChoices.map((q) => {
                  return {
                    choiceIconId: q.choiceIconId,
                    choiceIcon: q.choiceIcon,
                    choiceValue: q.choiceValue,
                    choiceValueType: q.choiceValueType,
                  };
                });
                if (question.timeOfDay) {
                  this.timeOfDay.HH = this.padInteger(question.timeOfDay.hour);
                  this.timeOfDay.mm = this.padInteger(
                    question.timeOfDay.minute
                  );
                }
              }
            }
            if (data.type === "appquestionnaire") {
              this.selectedNodeType = {
                display: "In-app Questionnaire",
                value: "IN_APP_QUESTIONNAIRE",
              };
              this.selectedInAppQuestionnaire = this.inAppQuestionnaires.find(
                (a) => a._id === data.appquestionnaire.qid
              );
              if (data.appquestionnaire.timeOfDay) {
                this.timeOfDay.HH = this.padInteger(
                  data.appquestionnaire.timeOfDay.hour
                );
                this.timeOfDay.mm = this.padInteger(
                  data.appquestionnaire.timeOfDay.minute
                );
              }
              if (data.appquestionnaire.customTitle) {
                this.customTitleInput = data.appquestionnaire.customTitle;
              }
              if (data.appquestionnaire.customBody) {
                this.customBodyInput = data.appquestionnaire.customBody;
              }
            }
          } else {
            this.selectedNodeType = {
              display: "Select one",
              value: "NONE",
            };
            this.questionText = "";
            this.choices = [];
          }
        }
      },
    },
  },
  data() {
    return {
      timeOfDay: {
        HH: "00",
        mm: "00",
      },
      nodeTypes: [
        {
          display: "Select one",
          value: "NONE",
        },
        { display: "Question", value: "QUESTION" },
        { display: "In-app Questionnaire", value: "IN_APP_QUESTIONNAIRE" },
      ],
      iconOptions: ["Hello", "World"],
      choiceTypeOptions: [
        { display: "Number", value: "number" },
        { display: "Boolean", value: "boolean" },
        { display: "Text", value: "text" },
      ],
      availableInAppQuestionnaires: [
        "Questionnaire 1",
        "Questionnaire 2",
        "Questionnaire 3",
      ],
      selectedInAppQuestionnaire: null,
      selectedNodeType: "NONE",
      visible: false,
      customTitleInput: "",
      customBodyInput: "",
      nodeLabel: "",
      questionText: "",
      choices: [],
      choiceValueInput: "",
      choiceValueTypeInput: null,
      choiceIconInput: null,
      archiveNodeModal: false,
      archiveNodeLoading: 0,
      nodeId: null,
      isInitialQuestion: false,
    };
  },
  methods: {
    switchUp(index) {
      const temp = this.choices[index + 1];
      const itemToSwitch = this.choices[index];
      this.$set(this.choices, index + 1, itemToSwitch);
      this.$set(this.choices, index, temp);
    },
    switchDown(index) {
      const temp = this.choices[index - 1];
      const itemToSwitch = this.choices[index];
      this.$set(this.choices, index - 1, itemToSwitch);
      this.$set(this.choices, index, temp);
    },
    deleteChoice(index) {
      this.choices.splice(index, 1);
    },
    padInteger(num) {
      if (num < 10) return `0${num}`;
      return `${num}`;
    },
    addChoice() {
      try {
        const newChoice = {
          choiceIconMd5: this.choiceIconInput.md5,
          choiceIconId: this.choiceIconInput._id,
          choiceIcon: this.choiceIconInput.filename,
          choiceValue: this.choiceValueInput,
          choiceValueType: this.choiceValueTypeInput.value,
        };
        const indexOfItem = this.choices.length;
        this.$set(this.choices, indexOfItem, newChoice);
      } catch (error) {
        console.log("addChoice error: " + error);
      }
    },
    submitData() {
      if (this.selectedNodeType.value === "QUESTION") {
        const newQuestion = {};
        const question = {
          questionText: this.questionText,
          questionChoices: this.choices,
          visible: this.visible,
        };
        const data = {
          type: "question",
          question: question,
          appquestionnaire: null,
        };
        newQuestion.nodeLabel = this.nodeLabel;
        newQuestion.data = data;
        newQuestion._id = this.nodeId;
        if (this.isInitialQuestion) {
          const timeOfDay = {
            minute: parseInt(this.timeOfDay.mm),
            hour: parseInt(this.timeOfDay.HH),
          };
          newQuestion.data.question.timeOfDay = timeOfDay;
          newQuestion.isSourceNode = true;
        } else {
          newQuestion.isSourceNode = false;
        }
        this.onSubmit(newQuestion);
      }
      if (this.selectedNodeType.value === "IN_APP_QUESTIONNAIRE") {
        const newInAppQuestionnaire = {};
        const inAppQuestionaire = { qid: this.selectedInAppQuestionnaire._id };
        const data = {
          type: "appquestionnaire",
          question: null,
          appquestionnaire: inAppQuestionaire,
        };
        newInAppQuestionnaire.nodeLabel = this.nodeLabel;
        newInAppQuestionnaire.data = data;
        newInAppQuestionnaire._id = this.nodeId;
        if (this.customTitleInput && this.customTitleInput.length > 0)
          newInAppQuestionnaire.data.appquestionnaire.customTitle = this.customTitleInput;
        if (this.customBodyInput && this.customBodyInput.length > 0)
          newInAppQuestionnaire.data.appquestionnaire.customBody = this.customBodyInput;
        if (this.isInitialQuestion) {
          const timeOfDay = {
            minute: parseInt(this.timeOfDay.mm),
            hour: parseInt(this.timeOfDay.HH),
          };
          newInAppQuestionnaire.data.appquestionnaire.timeOfDay = timeOfDay;
          newInAppQuestionnaire.isSourceNode = true;
        } else {
          newQuestion.isSourceNode = false;
        }
        this.onSubmit(newInAppQuestionnaire);
      }
    },
    // Same as submitData, just for copy.
    copyData() {
      if (this.selectedNodeType.value === "QUESTION") {
        const newQuestion = {};
        const question = {
          questionText: this.questionText,
          questionChoices: this.choices,
          visible: this.visible,
        };
        const data = {
          type: "question",
          question: question,
          appquestionnaire: null,
        };
        newQuestion.nodeLabel = this.nodeLabel;
        newQuestion.data = data;
        newQuestion._id = this.nodeId;
        if (this.isInitialQuestion) {
          const timeOfDay = {
            minute: parseInt(this.timeOfDay.mm),
            hour: parseInt(this.timeOfDay.HH),
          };
          newQuestion.data.question.timeOfDay = timeOfDay;
          newQuestion.isSourceNode = true;
        }
        this.onCopy(newQuestion);
      }
      if (this.selectedNodeType.value === "IN_APP_QUESTIONNAIRE") {
        const newInAppQuestionnaire = {};
        const inAppQuestionaire = { qid: this.selectedInAppQuestionnaire._id };
        const data = {
          type: "appquestionnaire",
          question: null,
          appquestionnaire: inAppQuestionaire,
        };
        newInAppQuestionnaire.nodeLabel = this.nodeLabel;
        newInAppQuestionnaire.data = data;
        newInAppQuestionnaire._id = this.nodeId;
        if (this.customTitleInput && this.customTitleInput.length > 0)
          newInAppQuestionnaire.data.appquestionnairecustomTitle = this.customTitleInput;
        if (this.customBodyInput && this.customBodyInput.length > 0)
          newInAppQuestionnaire.data.appquestionnaire.customBody = this.customBodyInput;
        this.onCopy(newInAppQuestionnaire);
      }
    },
    archiveNode() {
      this.archiveNodeModal = false;
      this.onArchive(this.nodeId);
    },
    closeWindow() {
      this.onClose("NONE");
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
