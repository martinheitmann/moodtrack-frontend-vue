<template>
  <CCard>
    <CCardHeader>
      <CRow align-vertical="center">
        <CCol> Disconnect Nodes </CCol>
        <CCol xs>
          <CButton :size="'sm'" :color="'danger'" v-on:click="closeWindow"
            ><CIcon :content="$options.X"
          /></CButton>
        </CCol> </CRow
    ></CCardHeader>
    <CCardBody>
      <CCol>
        <CRow>
          <CCol>
            <Multiselect
              v-model="selectedEdge"
              :options="edges"
              track-by="_id"
              label="edgeLabel"
              placeholder="Select a relation..."
            />
          </CCol>
        </CRow>
        <CRow class="mt-3">
          <CCol>
            <CButton block :color="'info'" v-on:click="submitData">
              Delete
            </CButton>
          </CCol>
        </CRow>
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import { cilX } from "@coreui/icons";
export default {
  name: "DeleteEdge",
  X: cilX,
  props: {
    onClose: Function,
    edges: Array,
    onSubmit: Function,
  },
  components: {
    Multiselect: () => import("vue-multiselect"),
  },
  data() {
    return {
      selectedEdge: null,
    };
  },
  methods: {
    closeWindow() {
      this.onClose("NONE");
    },
    submitData() {
      this.onSubmit(this.selectedEdge);
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
