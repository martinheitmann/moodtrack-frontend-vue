<template>
  <CCol>
    <CCard>
      <CCardHeader>
        Create a new question
      </CCardHeader>
      <CCardBody>
        <CCol>
          <CRow>
            New Question
          </CRow>
          <CRow class="mt-2">
            <CCol xs class="mr-2">
              <CButton
                v-bind="buttonVariant1"
                :color="'primary'"
                v-on:click="switchNewQuestionType('FREE_TEXT')"
              >
                Free-text
              </CButton>
            </CCol>
            <CCol xs>
              <CButton
                v-bind="buttonVariant2"
                :color="'primary'"
                v-on:click="switchNewQuestionType('MULTI_CHOICE')"
              >
                Multiple Choice
              </CButton>
            </CCol>
          </CRow>
          <CRow v-if="newQuestionType === 'FREE_TEXT'" class="mt-2">
            <CCol>
              <CRow>
                <CInput
                  class="w-100"
                  v-model="newFreeTextQuestionTextInput"
                  placeholder="Provide your question text..."
                />
              </CRow>
            </CCol>
          </CRow>
          <CRow v-if="newQuestionType === 'MULTI_CHOICE'" class="mt-2">
            <CCol>
              <CRow>
                <CInput
                  class="w-100"
                  v-model="newFreeTextQuestionTextInput"
                  placeholder="Provide your question text..."
                />
              </CRow>

              <CRow>
                <CCol>
                  <CRow
                    v-for="(item, index) in newQuestionChoices"
                    :key="item._id"
                    class="mb-2 mt-2 border rounded"
                    align-vertical="center"
                  >
                    <CCol class="m-2">
                      {{ item.display || item.value }}
                    </CCol>
                    <CCol xs class="m-2">
                      <CButton
                        class="m-1"
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

              <CRow>
                <CButton
                  :color="'info'"
                  :size="'sm'"
                  v-on:click="toggleAddChoiceMode()"
                >
                  <CRow align-vertical="center">
                    <CCol xs class="mb-2 mt-2 mr-1 ml-3">
                      <CIcon :content="$options.Plus" />
                    </CCol>
                    <CCol xs class="mb-2 mt-2 ml-1 mr-3">
                      Add Alternative
                    </CCol>
                  </CRow>
                </CButton>
              </CRow>

              <CRow
                v-if="newQuestionType === 'MULTI_CHOICE' && addChoiceMode"
                class="mt-2"
              >
                <CCol>
                  <CRow>
                    <CCol>
                      New question choice
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInput
                        v-model="newChoiceValueInput"
                        placeholder="Value (Required)"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInput
                        v-model="newChoiceDisplayInput"
                        placeholder="Display (Optional)"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <Multiselect
                        v-model="newChoiceTypeInput"
                        :options="choiceTypeOptions"
                        label="display"
                        track-by="value"
                        placeholder="Type (Required)"
                      />
                    </CCol>
                  </CRow>
                  <CRow class="mt-2" align-horizontal="start">
                    <CCol xs class="m-2">
                      <CButton :color="'success'" v-on:click="addChoice()">
                        Add Choice
                      </CButton>
                    </CCol>
                    <CCol xs class="m-2">
                      <CButton
                        :color="'danger'"
                        v-on:click="toggleAddChoiceMode()"
                      >
                        Close
                      </CButton>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <CRow class="mt-2" align-horizontal="end">
            <CCol xs class="mr-2 mt-2 mb-2">
              <CButton :color="'success'" v-on:click="submitNewQuestion()">
                Add Question
              </CButton>
            </CCol>
            <CCol xs class="ml-2 mt-2 mb-2">
              <CButton :color="'danger'" v-on:click="cancelNewQuestion()">
                Cancel
              </CButton>
            </CCol>
          </CRow>
        </CCol>
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script>
import { cilX, cilPlus } from "@coreui/icons";
export default {
  Plus: cilPlus,
  X: cilX,
  components: {
    Multiselect: () => import("vue-multiselect"),
  },
  props: {
    onClose: Function,
    onSubmitNewQuestion: Function,
  },
  data() {
    return {
      addChoiceMode: false,
      //Common
      newFreeTextQuestionTextInput: "",
      //Multi choice
      newQuestionChoices: [],
      newQuestionType: "FREE_TEXT",
      newChoiceTypeInput: { display: "Number", value: "NUMBER" },
      newChoiceValueInput: "",
      newChoiceDisplayInput: null,
      // Button styling
      buttonVariant1: {},
      buttonVariant2: { variant: "outline" },
      choiceTypeOptions: [
        { display: "Number", value: "NUMBER" },
        { display: "Text", value: "TEXT" },
      ],
    };
  },
  methods: {
    submitNewQuestion() {
      const data = {
        newFreeTextQuestionTextInput: this.newFreeTextQuestionTextInput,
        newQuestionChoices: this.newQuestionChoices,
        newQuestionType: this.newQuestionType,
      };
      this.onSubmitNewQuestion(data);
    },
    toggleAddChoiceMode() {
      this.addChoiceMode = !this.addChoiceMode;
    },
    switchNewQuestionType(newType) {
      this.newQuestionType = newType;
      if (newType === "FREE_TEXT") {
        this.buttonVariant1 = {};
        this.buttonVariant2 = { variant: "outline" };
      }
      if (newType === "MULTI_CHOICE") {
        this.buttonVariant2 = {};
        this.buttonVariant1 = { variant: "outline" };
      }
    },
    addChoice() {
      const value = this.newChoiceValueInput;
      const display = this.newChoiceDisplayInput;
      const type = this.newChoiceTypeInput?.value;
      this.$set(this.newQuestionChoices, this.newQuestionChoices.length, {
        display: display,
        value: value,
        type: type,
      });
      this.toggleAddChoiceMode();
    },
    deleteChoice(index) {
      this.newQuestionChoices.splice(index, 1);
    },
    cancelNewQuestion() {
      this.onClose();
    },
  },
};
</script>
