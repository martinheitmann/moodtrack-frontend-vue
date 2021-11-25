<template>
  <CCard class="w-100">
    <CCardHeader v-on:click="collapsed = !collapsed">
      <CRow align-vertical="center">
        <CCol> {{ node._id }} </CCol>
        <CCol xs>
          <CButton :size="'sm'" :color="'info'" v-on:click="onRestoreClicked"
            ><CIcon :content="$options.undo"
          /></CButton>
        </CCol>
      </CRow>
    </CCardHeader>
    <CCardBody v-if="!collapsed">
      <CCol>
        <CRow>
          <CCol>
            Label:
          </CCol>
          <CCol>
            {{ node.nodeLabel }}
          </CCol>
        </CRow>
        <CRow v-if="node.data.type === 'question'" class="mb-2">
          <CCol>
            Question text:
          </CCol>
          <CCol>
            {{ node.data.question.questionText }}
          </CCol>
        </CRow>
        <CContainer v-if="node.data.type === 'question'">
          <CRow
            v-for="(choice, index) in node.data.question.questionChoices"
            :key="index"
            class="border rounded p-1 mt-1 mb-1"
          >
            <CCol>
              <CRow>
                <CCol md="3">
                  Icon:
                </CCol>
                <CCol>
                  <CRow>
                    <CCol xs>
                      {{ choice.choiceIcon }}
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="3">
                  Type:
                </CCol>
                <CCol>
                  <CRow>
                    <CCol xs> {{ choice.choiceValueType }} </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="3"> Value: </CCol>
                <CCol>
                  <CRow>
                    {{ choice.choiceValue }}
                  </CRow>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CContainer>
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import { cilActionUndo } from "@coreui/icons";
export default {
  undo: cilActionUndo,
  name: "ArchivedNode",
  props: {
    node: Object,
    onRestore: Function,
  },
  data() {
    return {
      collapsed: true,
    };
  },
  methods: {
    onRestoreClicked() {
      this.onRestore(this.node);
    },
  },
};
</script>
