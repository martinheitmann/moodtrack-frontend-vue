<template>
  <CCard class="w-100">
    <CCardHeader>
      <CRow align-vertical="center">
        <CCol> Archived Nodes </CCol>
        <CCol xs>
          <CButton :size="'sm'" :color="'danger'" v-on:click="closeWindow"
            ><CIcon :content="$options.X"
          /></CButton>
        </CCol>
      </CRow>
    </CCardHeader>
    <CCardBody>
      <CContainer v-if="nodes.length === 0">
        No items to show...
      </CContainer>
      <CRow v-for="(node, index) in nodes" :key="index">
        <ArchivedNode :node="node" :onRestore="onRestoreNode" />
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import { cilX, cilActionUndo } from "@coreui/icons";
export default {
  X: cilX,
  undo: cilActionUndo,
  name: "ArchivedNodes",
  components: {
    ArchivedNode: () => import("./ArchivedNode.vue"),
  },
  props: {
    nodes: Array,
    onClose: Function,
    onRestore: Function,
  },
  data() {
    return {};
  },
  computed: {
    isMinimized: function() {
      this.nodes.map(function(node) {
        return {
          isMinimized: true,
        };
      });
    },
  },
  methods: {
    closeWindow() {
      this.onClose("NONE");
    },
    onRestoreNode(node) {
      this.onRestore(node._id);
    },
  },
};
</script>
