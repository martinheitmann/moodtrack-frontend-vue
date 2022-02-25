<template>
  <CCard class="w-100">
    <CCardHeader>
      <CRow align-horizontal="between" align-vertical="center">
        <CCol class="ml-2"> Free Text Question # {{ item.index }} </CCol>
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
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import { cilX, cilCheckCircle, cilPencil } from "@coreui/icons";
export default {
  Pencil: cilPencil,
  X: cilX,
  Check: cilCheckCircle,
  props: {
    item: Object,
    index: Number,
    onItemUpdated: Function,
    onItemDeleted: Function,
  },
  data() {
    return {
      editMode: false,
      questionText: "",
      questionTextInput: "",
    };
  },
  methods: {
    onDeleteClicked() {
      this.onItemDeleted(this.index);
    },
    toggleEditMode() {
      if (this.editMode) this.onEditModeDisabled();
      this.editMode = !this.editMode;
    },
    onEditModeDisabled() {
      const _item = this.item;
      _item.question = this.questionTextInput;
      this.onItemUpdated(_item, this.index);
    },
  },
  watch: {
    questionText: {
      immediate: true,
      handler(val) {
        this.questionTextInput = val;
      },
    },
    item: {
      immediate: true,
      deep: true,
      handler(val) {
        this.questionText = val.question;
      },
    },
  },
};
</script>
