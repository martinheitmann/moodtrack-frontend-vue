<template>
  <CCard class="w-100">
    <CCardHeader>
      <CRow align-horizontal="between" align-vertical="center">
        <CCol class="ml-2"> Multiple Choice Question # {{ item.index }} </CCol>
        <CCol xs>
          <CButton
            class="m-1"
            :size="'sm'"
            :color="'info'"
            v-on:click.stop="toggleEditMode"
          >
            <CIcon v-if="editMode" :content="$options.Check" />
            <CIcon v-if="!editMode" :content="$options.Pencil" />
          </CButton>
        </CCol>
        <CCol xs>
          <CButton
            class="m-1"
            :size="'sm'"
            :color="'danger'"
            v-on:click="onDeleteClicked"
          >
            <CIcon :content="$options.X" />
          </CButton>
        </CCol>
      </CRow>
    </CCardHeader>
    <CCardBody>
      <CCol>
        <CRow v-if="editMode">
          <CInput class="w-100" v-model="questionTextInput" />
        </CRow>
        <CRow v-if="!editMode">
          {{ questionText }}
        </CRow>
        <CRow>
          <CCol>
            <CRow
              v-for="(item, index) in questionChoices"
              :key="item._id"
              class="mb-2 mt-2 border rounded"
              align-vertical="center"
            >
              <CCol v-if="!editMode" class="m-2">
                {{ item.display || item.value }}
              </CCol>
              <CCol v-if="editMode" class="m-2">
                {{ item.display || item.value }}
              </CCol>
              <CCol xs v-if="editMode" class="m-2">
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
        <CRow v-if="editMode && !addAlternativeMode">
          <CCol xs>
            <CButton
              :color="'info'"
              :size="'sm'"
              v-on:click="toggleAddAlternativeMode()"
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
          </CCol>
        </CRow>
        <CRow v-if="editMode && addAlternativeMode" class="mt-2">
          <CCol>
            <CRow>
              <CCol>
                New question choice
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CInput
                  v-model="choiceValueInput"
                  placeholder="Value (Required)"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CInput
                  v-model="choiceDisplayInput"
                  placeholder="Display (Optional)"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <Multiselect
                  v-model="choiceTypeInput"
                  :options="choiceTypeOptions"
                  label="display"
                  track-by="value"
                  placeholder="Type (Required)"
                />
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol xs class="m-2">
                <CButton
                  :color="'success'"
                  v-on:click="addAlternativeToQuestion()"
                >
                  Save
                </CButton>
              </CCol>
              <CCol xs class="m-2">
                <CButton
                  :color="'danger'"
                  v-on:click="toggleAddAlternativeMode()"
                >
                  Cancel
                </CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import { cilX, cilCheckCircle, cilPencil, cilPlus } from "@coreui/icons";
export default {
  Pencil: cilPencil,
  X: cilX,
  Plus: cilPlus,
  Check: cilCheckCircle,
  components: {
    Multiselect: () => import("vue-multiselect"),
  },
  props: {
    index: Number,
    item: Object,
    onItemUpdated: Function,
    onItemDeleted: Function,
  },
  data() {
    return {
      questionText: "",
      questionTextInput: "",
      choiceValueInput: "",
      choiceDisplayInput: "",
      choiceTypeInput: { display: "Number", value: "NUMBER" },
      questionChoices: [],
      editMode: false,
      addAlternativeMode: false,
      choiceTypeOptions: [
        { display: "Number", value: "NUMBER" },
        { display: "Text", value: "TEXT" },
      ],
    };
  },
  watch: {
    item: {
      immediate: true,
      deep: true,
      handler(val) {
        this.questionText = val.question;
        this.questionChoices = val.choices;
      },
    },
    questionText: {
      immediate: true,
      handler(val) {
        this.questionTextInput = val;
      },
    },
  },
  methods: {
    onDeleteClicked() {
      this.onItemDeleted(this.index);
    },
    deleteChoice(index) {
      this.questionChoices.splice(index, 1);
    },
    toggleEditMode() {
      if (this.editMode) this.onEditModeDisabled();
      this.editMode = !this.editMode;
    },
    toggleAddAlternativeMode() {
      this.addAlternativeMode = !this.addAlternativeMode;
    },
    onEditModeDisabled() {
      const _item = this.item;
      _item.question = this.questionTextInput;
      _item.choices = this.questionChoices;
      console.log(JSON.stringify(_item));
      this.onItemUpdated(_item, this.index);
    },
    addAlternativeToQuestion() {
      const newAlternative = {
        display: this.choiceDisplayInput,
        value: this.choiceValueInput,
        type: this.choiceTypeInput.value,
      };
      this.$set(
        this.questionChoices,
        this.questionChoices.length,
        newAlternative
      );
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
