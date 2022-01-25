<template>
  <!---------------- Archive node modal ----------------->
  <CModal :title="modalTitle" color="info" :show="isVisible">
    <div slot="default">
      <CCol>
        <CRow>
          <CCol>
            <CInput
              v-model="title"
              class="w-100"
              placeholder="Provide the title for your post..."
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CTextarea
              v-model="body"
              class="w-100"
              placeholder="Provide the body for your post..."
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs class="mr-2 ml-4">
            Pinned
          </CCol>
          <CCol xs>
            <CSwitch :color="'info'" v-bind:checked.sync="isPinned" />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CButton>
              Show Available Header Icons
            </CButton>
          </CCol>
        </CRow>
        <CRow> </CRow>
      </CCol>
    </div>
    <div slot="footer">
      <CRow align-horizontal="end">
        <CCol class="m-1" v-if="isLoading">
          <CSpinner color="primary" style="width:3rem;height:3rem;" />
        </CCol>
        <CCol xs class="m-1" v-if="!isLoading">
          <CButton color="success" size="lg" v-on:click="submitClicked()">
            {{ modalSubmitButtonText }}
          </CButton>
        </CCol>
        <CCol xs class="m-1" v-if="!isLoading">
          <CButton color="danger" size="lg" v-on:click="closeClicked()">
            Cancel
          </CButton>
        </CCol>
      </CRow>
    </div>
  </CModal>
  <!--------------- End modal ------------->
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    isLoading: Number,
    onSubmit: Function,
    onEdit: Function,
    onClose: Function,
    editMode: Boolean,
    postData: Object,
    availableIcons: Array,
  },
  watch: {
    postData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.editMode) {
          this.id = val.id;
          this.title = val.title;
          this.body = val.body;
          this.isPinned = val.pinned;
        } else {
          this.id = null;
          this.title = "";
          this.body = "";
          this.isPinned = false;
        }
      },
    },
  },
  data() {
    return {
      id: null,
      title: "",
      body: "",
      isPinned: false,
      headerIcon: null,
      iconSectionExpanded: false,
    };
  },
  computed: {
    modalTitle() {
      if (this.editMode) return "Edit an existing post";
      return "Create a new post";
    },
    modalSubmitButtonText() {
      if (this.editMode) return "Edit";
      return "Submit";
    },
  },
  methods: {
    closeClicked() {
      this.onClose();
    },
    submitClicked() {
      if (!this.editMode) {
        this.onSubmit(this.title, this.body, this.isPinned);
      } else {
        this.onEdit(this.id, this.title, this.body, this.isPinned);
      }
    },
  },
};
</script>
