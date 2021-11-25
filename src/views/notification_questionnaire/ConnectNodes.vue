<template>
  <CCard>
    <CCardHeader>
      <CRow align-vertical="center">
        <CCol> Connect Nodes </CCol>
        <CCol xs>
          <CButton :size="'sm'" :color="'danger'" v-on:click="closeWindow"
            ><CIcon :content="$options.X"
          /></CButton>
        </CCol> </CRow
    ></CCardHeader>
    <CCardBody>
      <CCol>
        <CRow class="mb-1">
          <CCol>
            From node:
          </CCol>
        </CRow>
        <CRow class="mb-2">
          <CCol
            ><Multiselect
              v-model="selectedFromNode"
              :options="availableFromNodes"
              placeholder="From node..."
              track-by="_id"
              label="nodeLabel"
          /></CCol>
        </CRow>
        <CRow class="mb-1" v-if="selectedFromNode">
          <CCol>
            To node:
          </CCol>
        </CRow>
        <CRow class="mb-2" v-if="selectedFromNode">
          <CCol
            ><Multiselect
              v-model="selectedToNode"
              :options="availableToNodes"
              placeholder="To node..."
              track-by="_id"
              label="nodeLabel"
          /></CCol>
        </CRow>
        <CRow>
          <CCol>
            <CInput
              class="w-100"
              label="Relation label"
              placeholder="Provide a label for the relation..."
              v-model="edgeLabel"
            />
          </CCol>
        </CRow>
        <CRow class="mb-1">
          <CCol>
            Condition:
          </CCol>
        </CRow>
        <CRow class="mb-2">
          <CCol
            ><Multiselect
              v-model="selectedCondition"
              :options="availableConditions"
              label="display"
              track-by="value"
              placeholder="Select a Condition"
          /></CCol>
        </CRow>
        <CRow class="mb-1">
          <CCol>
            Condition Type:
          </CCol>
        </CRow>
        <CRow class="mb-2">
          <CCol
            ><Multiselect
              v-model="selectedConditionType"
              :options="availableConditionTypes"
              label="display"
              track-by="value"
              placeholder="Select a Condition Type..."
          /></CCol>
        </CRow>
        <CRow>
          <CCol>
            <CInput
              class="w-100"
              label="Condition value"
              placeholder="Provide a value for the condition..."
              v-model="conditionValue"
            />
          </CCol>
        </CRow>
        <CRow class="mt-4">
          <CButton :color="'info'" :block="true" v-on:click="submitData">
            Add Relation
          </CButton>
        </CRow>
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import { cilX } from "@coreui/icons";
export default {
  name: "ConnectNodes",
  X: cilX,
  components: {
    Multiselect: () => import("vue-multiselect"),
  },
  props: {
    onSubmit: Function,
    onClose: Function,
    nodes: Array,
    edges: Array,
  },
  data() {
    return {
      selectedFromNode: null,
      selectedToNode: null,
      availableFromNodes: this.nodes,
      availableToNodes: null,
      edgeLabel: "",
      availableConditions: [
        { display: "Equal", value: "equal" },
        { display: "Not Equal", value: "not_equal" },
        { display: "Less Than", value: "less_than" },
        { display: "Less Than Or Equal", value: "less_than_or_equal" },
        { display: "Greater Than", value: "greater_than" },
        { display: "Greater Than Or Equal", value: "greater_than_or_equal" },
      ],
      availableConditionTypes: [
        { display: "Integer", value: "integer" },
        { display: "Boolean", value: "boolean" },
        { display: "Text", value: "text" },
      ],
      selectedCondition: null,
      selectedConditionType: null,
      conditionValue: "",
    };
  },
  methods: {
    closeWindow() {
      this.onClose("NONE");
    },
    submitData() {
      const newEdge = {};
      newEdge.source = this.selectedFromNode?._id;
      newEdge.target = this.selectedToNode?._id;
      newEdge.edgeLabel = this.edgeLabel;
      const condition = {
        condition: this.selectedCondition?.value,
        conditionValue: this.conditionValue,
        conditionType: this.selectedConditionType?.value,
      };
      newEdge.condition = condition;
      //console.log(JSON.stringify(newEdge));
      this.onSubmit(newEdge);
    },
    getElligibleTargetNodes(sourceNode) {
      const elligibleTargetNodes = [];
      for (const node of this.nodes) {
        if (node._id !== sourceNode._id) {
          const existingEdge = this.edges.find(
            (edge) => edge.source === sourceNode._id && edge.target === node._id
          );
          if (!existingEdge) {
            elligibleTargetNodes.push(node);
          }
        }
      }
      return elligibleTargetNodes;
    },
  },
  watch: {
    selectedFromNode: {
      immediate: true,
      handler(val) {
        console.log("selectedFromNode watcher called.");
        if (val) {
          this.availableToNodes = this.getElligibleTargetNodes(val);
        }
      },
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
