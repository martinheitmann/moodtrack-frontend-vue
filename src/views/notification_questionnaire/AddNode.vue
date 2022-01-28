<template>
  <CCol>
    <!-- ADD NODE VIEW -->
    <CRow class="m-2">
      <CCard class="w-100">
        <CCardHeader>
          <CRow align-vertical="center">
            <CCol> Add a new node </CCol>
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
            <CRow>
              <CCol xs>
                Node type:
              </CCol>
            </CRow>
            <CRow class="mb-2">
              <Multiselect
                v-model="selectedNodeType"
                :options="nodeTypes"
                track-by="value"
                label="display"
                placeholder="Select the node type..."
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
            <CRow v-if="selectedNodeType.value === 'QUESTION'">Choices:</CRow>

            <CRow
              class="mt-1 mb-3"
              v-if="selectedNodeType.value === 'QUESTION'"
            >
              <CCol>
                <CRow
                  v-for="(choice, index) in choices"
                  :key="index"
                  class="border rounded p-1 mt-1 mb-1"
                  align-vertical="center"
                >
                  <CCol xs class="mr-2 ml-2">
                    {{ choice.choiceIcon }}
                  </CCol>
                  <CCol xs class="mr-2 ml-2">
                    {{ choice.choiceValueType }}
                  </CCol>
                  <CCol xs class="mr-2 ml-2">
                    {{ choice.choiceValue }}
                  </CCol>
                  <CCol></CCol>
                  <CCol
                    xs
                    class="mr-1 ml-1"
                    v-if="index !== choices.length - 1"
                  >
                    <CButton
                      :size="'sm'"
                      :color="'info'"
                      v-on:click="switchUp(index)"
                    >
                      <CIcon :content="$options.bottom" />
                    </CButton>
                  </CCol>
                  <CCol xs class="mr-1 ml-1" v-if="index !== 0">
                    <CButton
                      :size="'sm'"
                      :color="'info'"
                      v-on:click="switchDown(index)"
                    >
                      <CIcon :content="$options.top" />
                    </CButton>
                  </CCol>
                  <CCol xs class="mr-1 ml-1">
                    <CButton
                      :size="'sm'"
                      :color="'danger'"
                      v-on:click="deleteChoice(index)"
                    >
                      <CIcon :content="$options.X" />
                    </CButton>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <CRow v-if="selectedNodeType.value === 'QUESTION'">
              <Multiselect
                v-model="choiceIconInput"
                :options="icons"
                label="filename"
                track-by="_id"
                placeholder="Select a icon filename..."
              />
            </CRow>
            <CRow class="mt-2" v-if="selectedNodeType.value === 'QUESTION'">
              <Multiselect
                v-model="choiceValueTypeInput"
                :options="choiceTypeOptions"
                label="display"
                track-by="value"
                placeholder="Select a choice data type..."
              />
            </CRow>
            <CRow class="mt-2" v-if="selectedNodeType.value === 'QUESTION'">
              <CInput
                v-model="choiceValueInput"
                class="w-100"
                placeholder="Provide your choice value..."
              />
            </CRow>
            <CRow class="mt-2" v-if="selectedNodeType.value === 'QUESTION'">
              <CButton :color="'info'" :block="true" v-on:click="addChoice">
                Add New Choice
              </CButton>
            </CRow>
            <CRow
              class="mb-2"
              v-if="selectedNodeType.value === 'IN_APP_QUESTIONNAIRE'"
            >
              <Multiselect
                v-model="selectedInAppQuestionnaire"
                :options="inAppQuestionnaires"
                label="name"
                track.by="_id"
                placeholder="Select a questionnaire..."
              />
            </CRow>
            <CRow
              class="mt-4"
              v-if="
                selectedNodeType.value === 'QUESTION' ||
                  selectedNodeType.value === 'IN_APP_QUESTIONNAIRE'
              "
            >
              <CButton :color="'info'" :block="true" v-on:click="submitData">
                Add Node
              </CButton>
            </CRow>
          </CCol>
        </CCardBody>
      </CCard>
    </CRow>
    <!-- ADD NODE VIEW END -->
  </CCol>
</template>

<script>
import { cilX, cilChevronTop, cilChevronBottom } from "@coreui/icons";
import "vue2-timepicker/dist/VueTimepicker.css";
export default {
  // Icons
  X: cilX,
  top: cilChevronTop,
  bottom: cilChevronBottom,
  name: "AddNode",
  props: {
    id: String,
    onSubmit: Function,
    onClose: Function,
    icons: Array,
    inAppQuestionnaires: Array,
  },
  components: {
    Multiselect: () => import("vue-multiselect"),
    VueTimepicker: () => import("vue2-timepicker"),
  },
  data() {
    return {
      isInitialQuestion: false,
      timeOfDay: {
        HH: "00",
        mm: "00",
      },
      selectedNodeType: "NONE",
      nodeTypes: [
        {
          display: "Select one",
          value: "NONE",
        },
        { display: "Question", value: "QUESTION" },
        { display: "In-app Questionnaire", value: "IN_APP_QUESTIONNAIRE" },
      ],
      nodeLabel: "",
      questionText: "",
      choices: [],
      choiceValueInput: "",
      choiceValueTypeInput: null,
      choiceIconInput: null,
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
    };
  },
  methods: {
    switchUp(index) {
      console.log("switchUp called.");
      const temp = this.choices[index + 1];
      const itemToSwitch = this.choices[index];
      this.$set(this.choices, index + 1, itemToSwitch);
      this.$set(this.choices, index, temp);
    },
    switchDown(index) {
      console.log("switchDown called.");
      const temp = this.choices[index - 1];
      const itemToSwitch = this.choices[index];
      this.$set(this.choices, index - 1, itemToSwitch);
      this.$set(this.choices, index, temp);
    },
    deleteChoice(index) {
      this.choices.splice(index, 1);
    },
    addChoice() {
      const newChoice = {
        choiceIconMd5: this.choiceIconInput.md5,
        choiceIconId: this.choiceIconInput._id,
        choiceIcon: this.choiceIconInput.filename,
        choiceValue: this.choiceValueInput,
        choiceValueType: this.choiceValueTypeInput.value,
      };
      const indexOfItem = this.choices.length;
      this.$set(this.choices, indexOfItem, newChoice);
    },
    submitData() {
      if (this.selectedNodeType.value === "QUESTION") {
        const newQuestion = {};
        const question = {
          questionText: this.questionText,
          questionChoices: this.choices,
          visible: false,
        };
        const data = {
          type: "question",
          question: question,
          appquestionnaire: null,
        };
        newQuestion.nodeLabel = this.nodeLabel;
        newQuestion.data = data;
        if (this.isInitialQuestion) {
          const timeOfDay = {
            minute: parseInt(this.timeOfDay.mm),
            hour: parseInt(this.timeOfDay.HH),
          };
          newQuestion.data.question.timeOfDay = timeOfDay;
          newQuestion.isSourceNode = true;
        }
        this.onSubmit(newQuestion);
      }
      if (this.selectedNodeType.value === "IN_APP_QUESTIONNAIRE") {
        const newInAppQuestionnaire = {};
        const inAppQuestionaire = {
          qid: this.selectedInAppQuestionnaire?._id,
        };
        const data = {
          type: "appquestionnaire",
          question: null,
          appquestionnaire: inAppQuestionaire,
        };
        newInAppQuestionnaire.nodeLabel = this.nodeLabel;
        newInAppQuestionnaire.data = data;
        this.onSubmit(newInAppQuestionnaire);
      }
    },
    closeWindow() {
      this.onClose("NONE");
    },
  },
};
</script>

<style type="text/css">
#mynetwork {
  width: 100%;
  height: 600px;
  border: 1px solid lightgray;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
