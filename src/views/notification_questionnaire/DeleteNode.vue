<template>
  <CCard>
    <CCardHeader>
      <CRow align-vertical="center">
        <CCol> Delete Node </CCol>
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
              v-model="selectedNode"
              :options="nodes"
              track-by="_id"
              label="nodeLabel"
              placeholder="Select a node..."
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
  name: "DeleteNode",
  X: cilX,
  props: {
    onClose: Function,
    nodes: Array,
    onSubmit: Function,
  },
  components: {
    Multiselect: () => import("vue-multiselect"),
  },
  data() {
    return {
      selectedNode: null,
    };
  },
  methods: {
    closeWindow() {
      this.onClose("NONE");
    },
    submitData() {
      this.onSubmit(this.selectedNode);
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
