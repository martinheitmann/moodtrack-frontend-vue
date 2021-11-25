<template>
  <CRow>
    <CCol md="9">
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol>
              <CRow>
                <CCol>
                  In-app Questionnaire
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol>
                  <h5>{{ questionnaireName }}</h5>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  {{ questionnaireDescription }}
                </CCol>
              </CRow>
            </CCol>
            <CCol xs>
              <CButton
                :color="'info'"
                v-on:click="editQuestionnaireModal = true"
              >
                <CIcon :content="$options.Pencil" />
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CCol>
            <!-- Edit In-app Questionnaire Modal -->

            <!---------------- Content revision modal ----------------->
            <CModal
              title="Edit In-App Questionnaire"
              color="info"
              :show.sync="editQuestionnaireModal"
            >
              <div slot="default">
                <CCol>
                  <CRow class="mb-2">
                    Questionnaire Name
                  </CRow>
                  <CRow>
                    <CInput v-model="questionnaireName" />
                  </CRow>
                  <CRow class="mb-2">
                    Questionnaire Description
                  </CRow>
                  <CRow>
                    <CInput v-model="questionnaireDescription" />
                  </CRow>
                </CCol>
              </div>
              <div slot="footer">
                <CRow align-horizontal="end">
                  <CCol xs class="m-1">
                    <CButton
                      color="success"
                      size="lg"
                      v-on:click="saveQuestionnaireDetails"
                    >
                      Save
                    </CButton>
                  </CCol>
                  <CCol xs class="m-1">
                    <CButton
                      color="danger"
                      size="lg"
                      v-on:click="editQuestionnaireModal = false"
                    >
                      Close
                    </CButton>
                  </CCol>
                </CRow>
              </div>
            </CModal>
            <!-------------- Modal end ---------------------------->

            <!-- ERROR TOASTER -->
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

            <!-- SUCCESS TOASTER -->
            <CToaster :autohide="3000">
              <template v-for="toast in successToasts">
                <CToast :key="'toast' + toast" :show="true" header="Success!">
                  {{ successMessage }}
                </CToast>
              </template>
            </CToaster>

            <CRow>
              <Draggable
                class="w-100"
                v-model="inAppQuestionnaireListItems"
                :disabled="!enabled"
                @start="drag = true"
                @end="drag = false"
              >
                <CRow
                  v-for="(element, index) in inAppQuestionnaireListItems"
                  :key="element._id"
                >
                  <CCol>
                    <CContainer v-if="element.type === itemType.FREE_TEXT">
                      <InAppQuestionnaireFreeText
                        :item="element"
                        :index="index"
                        :onItemUpdated="editItem"
                        :onItemDeleted="deleteQuestion"
                      />
                    </CContainer>
                    <CContainer v-if="element.type === itemType.MULTI_CHOICE">
                      <InAppQuestionnaireMultiChoice
                        :item="element"
                        :index="index"
                        :onItemUpdated="editItem"
                        :onItemDeleted="deleteQuestion"
                      />
                    </CContainer>
                  </CCol>
                </CRow>
              </Draggable>
            </CRow>
            <CRow v-if="!newQuestionMode">
              <CCol>
                <CButton
                  :color="'info'"
                  :size="'lg'"
                  class="mb-2 ml-2"
                  v-on:click="toggleNewQuestionMode()"
                >
                  <CRow align-vertical="center">
                    <CCol xs class="mb-1 mt-1 mr-1 ml-2">
                      <CIcon :content="$options.Plus" />
                    </CCol>
                    <CCol xs class="mb-1 mt-1 ml-1 mr-2">
                      Add Question
                    </CCol>
                  </CRow>
                </CButton>
              </CCol>
            </CRow>
            <CRow class="mt-2" v-if="newQuestionMode">
              <CCol>
                <CCard>
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
                      <CRow
                        v-if="newQuestionType === 'MULTI_CHOICE'"
                        class="mt-2"
                      >
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
                                    v-on:click="deleteNewQuestionChoice(index)"
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
                            v-if="
                              newQuestionType === 'MULTI_CHOICE' &&
                                addChoiceMode
                            "
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
                                    placeholder="Value"
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
                                    placeholder="Type (Optional)"
                                  />
                                </CCol>
                              </CRow>
                              <CRow class="mt-2" align-horizontal="start">
                                <CCol xs class="m-2">
                                  <CButton
                                    :color="'success'"
                                    v-on:click="addNewChoice()"
                                  >
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
                          <CButton
                            :color="'success'"
                            v-on:click="addNewQuestion()"
                          >
                            Add Question
                          </CButton>
                        </CCol>
                        <CCol xs class="ml-2 mt-2 mb-2">
                          <CButton
                            :color="'danger'"
                            v-on:click="toggleNewQuestionMode()"
                          >
                            Cancel
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCol>
        </CCardBody>
        <CCardFooter>
          <CCol>
            <CRow align-horizontal="end">
              <CCol xs class="m-1">
                <CButton
                  :color="'success'"
                  :size="'lg'"
                  v-on:click="saveQuestionnaire()"
                >
                  Save
                </CButton>
              </CCol>
              <CCol xs class="m-1">
                <CButton :color="'danger'" :size="'lg'">
                  Cancel
                </CButton>
              </CCol>
            </CRow>
            <CRow align-horizontal="end"> </CRow>
          </CCol>
        </CCardFooter>
      </CCard>
    </CCol>
    <CCol>
      <InAppQuestionnaireContentRevisions
        :inAppQuestionnaireContents="inAppQuestionnaireContents"
        :questionnaireId="id"
      />
    </CCol>
  </CRow>
</template>

<script>
import { cilX, cilPencil, cilPlus } from "@coreui/icons";
import { ItemType } from "./InAppQuestionnaireQuestionTypes";
import InAppQuestionnaireQuery from "../../graphql/queries/IN_APP_QUESTIONNAIRE.gql";
import LatestInAppQuestionnaireContentQuery from "../../graphql/queries/LATEST_IN_APP_QUESTIONNAIRE_CONTENT.gql";
import InAppQuestionnaireContentRevisionsQuery from "../../graphql/queries/IN_APP_QUESTIONNAIRE_CONTENTS.gql";
import CreateInAppQuestionnaireContentMutation from "../../graphql/mutations/CREATE_IN_APP_QUESTIONNAIRE_CONTENT.gql";
import EditInAppQuestionnaireMutation from "../../graphql/mutations/EDIT_IN_APP_QUESTIONNAIRE.gql";
import {
  createList,
  constructQuestionnaireMutationData,
} from "./InAppQuestionnaireUtils";
export default {
  Plus: cilPlus,
  X: cilX,
  Pencil: cilPencil,
  props: {
    id: String,
  },
  components: {
    Draggable: () => import("vuedraggable"),
    InAppQuestionnaireFreeText: () =>
      import("./list_components/InAppQuestionnaireFreeText"),
    InAppQuestionnaireMultiChoice: () =>
      import("./list_components/InAppQuestionnaireMultiChoice"),
    Multiselect: () => import("vue-multiselect"),
    InAppQuestionnaireContentRevisions: () =>
      import("./InAppQuestionnaireContentRevisions"),
  },
  data() {
    return {
      enabled: true,
      inAppQuestionnaire: null,
      inAppQuestionnaireListItems: [],
      latestInAppQuestionnaireContent: null,
      inAppQuestionnaireContents: [],
      list: [],
      // Questionnaire fields
      questionnaireName: "",
      questionnaireDescription: "",
      //Modes
      newQuestionMode: false,
      addChoiceMode: false,
      //Common
      newFreeTextQuestionTextInput: "",
      //Multi choice
      newQuestionChoices: [],
      newQuestionType: "FREE_TEXT",
      newChoiceTypeInput: null,
      newChoiceValueInput: "",
      newChoiceDisplayInput: null,
      // Button styling
      buttonVariant1: {},
      buttonVariant2: { variant: "outline" },
      choiceTypeOptions: [
        { display: "Number", value: "NUMBER" },
        { display: "Text", value: "TEXT" },
      ],
      errorMessage: "",
      successMessage: "",
      errorToasts: 0,
      successToasts: 0,
      editQuestionnaireModal: false,
    };
  },
  computed: {
    itemType() {
      return ItemType;
    },
  },
  watch: {
    latestInAppQuestionnaireContent: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.inAppQuestionnaireListItems = createList(
            val.freeTextItems,
            val.multipleChoiceItems
          );
        }
      },
    },
    inAppQuestionnaire: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.name && val.description) {
          this.questionnaireName = val.name;
          this.questionnaireDescription = val.description;
        }
      },
    },
  },
  methods: {
    /* Methods start */
    toggleNewQuestionMode() {
      this.newQuestionMode = !this.newQuestionMode;
    },
    deleteQuestion(index) {
      this.inAppQuestionnaireListItems.splice(index, 1);
    },
    deleteNewQuestionChoice(index) {
      this.newQuestionChoices.splice(index, 1);
    },
    createNewFreeTextQuestion() {
      return {
        type: ItemType.FREE_TEXT,
        question: this.newFreeTextQuestionTextInput,
      };
    },
    createNewMultiChoiceQuestion() {
      return {
        type: ItemType.MULTI_CHOICE,
        question: this.newFreeTextQuestionTextInput,
        choices: this.newQuestionChoices,
      };
    },
    addNewQuestion() {
      let nc = null;
      if (this.newQuestionType === "FREE_TEXT") {
        nc = this.createNewFreeTextQuestion();
      }
      if (this.newQuestionType === "MULTI_CHOICE") {
        nc = this.createNewMultiChoiceQuestion();
      }
      this.$set(
        this.inAppQuestionnaireListItems,
        this.inAppQuestionnaireListItems.length,
        nc
      );
      this.toggleNewQuestionMode();
    },
    addNewChoice() {
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
    editItem(item, index) {
      this.$set(this.inAppQuestionnaireListItems, index, item);
    },
    saveQuestionnaire() {
      console.log("saveQuestionnaire called.");
      const _this = this;
      const arg = constructQuestionnaireMutationData(
        this.id,
        this.inAppQuestionnaireListItems
      );
      this.$apollo
        .mutate({
          mutation: CreateInAppQuestionnaireContentMutation,
          variables: {
            inAppQuestionnaireContent: arg,
          },
          refetchQueries: [
            {
              query: LatestInAppQuestionnaireContentQuery,
              variables() {
                return {
                  _id: _this.id,
                };
              },
            },
          ],
        })
        .then((data) => {
          console.log("Success (saveQuestionnaire): " + JSON.stringify(data));
          _this.successMessage = "Questionnaire successfully saved!";
          _this.showSuccessToast();
        })
        .catch((error) => {
          console.log("Oh no (saveQuestionnaire): " + error);
          _this.errorMessage = "An error occured while saving questionnaire.";
          _this.showErrorToast();
        });
    },
    /**
     * Shows an error toast with the string
     * contained by this.errorToasts.
     */
    showErrorToast() {
      this.errorToasts = this.errorToasts + 1;
    },
    /**
     * Shows a success toast.
     */
    showSuccessToast() {
      this.successToasts = this.successToasts + 1;
    },
    saveQuestionnaireDetails() {
      const _this = this;
      const data = {
        name: this.questionnaireName,
        description: this.questionnaireDescription,
      };
      this.$apollo
        .mutate({
          mutation: EditInAppQuestionnaireMutation,
          variables: {
            _id: _this.id,
            questionnaire: data,
          },
          refetchQueries: [
            {
              query: InAppQuestionnaireQuery,
              variables() {
                return {
                  _id: _this.id,
                };
              },
            },
          ],
        })
        .then((data) => {
          console.log("Success (saveQuestionnaireDetails)");
          _this.successMessage = "Questionnaire successfully saved!";
          _this.showSuccessToast();
          _this.editQuestionnaireModal = false;
        })
        .catch((error) => {
          console.log("Oh no (saveQuestionnaireDetails): " + error);
          _this.errorMessage = "An error occured while saving questionnaire.";
          _this.showErrorToast();
        });
    },
  } /* Methods end*/,
  apollo: {
    inAppQuestionnaire: {
      query: InAppQuestionnaireQuery,
      variables() {
        return {
          _id: this.id,
        };
      },
    },
    latestInAppQuestionnaireContent: {
      query: LatestInAppQuestionnaireContentQuery,
      variables() {
        return {
          questionnaireId: this.id,
        };
      },
    },
    inAppQuestionnaireContents: {
      query: InAppQuestionnaireContentRevisionsQuery,
      variables() {
        return {
          questionnaireId: this.id,
        };
      },
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
