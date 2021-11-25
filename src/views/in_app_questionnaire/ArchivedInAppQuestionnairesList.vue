<template>
  <!--  
    List showing archived in-app questionnaires.
  -->
  <CCol>
    <CCard
      v-for="questionnaire in questionnaires"
      v-bind:key="questionnaire._id"
      v-on:click="onListItemClicked(questionnaire)"
    >
      <CCardHeader>
        <CRow align-vertical="center">
          <CCol>
            <h5 style="color:red;">{{ questionnaire.name }}</h5>
          </CCol>
          <CCol xs>
            <CButton
              class="m-1"
              :size="'sm'"
              :color="'info'"
              v-on:click.stop="onRestoreItemClicked(questionnaire)"
            >
              <CIcon :content="$options.undo" />
            </CButton>
          </CCol>
          <CCol xs>
            <CButton
              class="m-1"
              :size="'sm'"
              :color="'danger'"
              v-on:click.stop="onDeleteItemClicked(questionnaire)"
            >
              <CIcon :content="$options.X" />
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CCol v-if="questionnaire">
          <CRow>
            <CCol
              ><span
                >Created: {{ dateFormat(questionnaire.creationDate) }}</span
              ></CCol
            >
          </CRow>
          <CRow>
            <CCol
              ><span
                >Description:
                {{ questionnaire.description || "No description" }}</span
              ></CCol
            >
          </CRow>
        </CCol>
      </CCardBody>
    </CCard>
    <CRow
      align-horizontal="center"
      v-if="questionnaires && questionnaires.length < 1"
    >
      Nothing to show...
    </CRow>
  </CCol>
</template>

<script>
import { cilX, cilActionUndo } from "@coreui/icons";
import { formatDate } from "../../util/DateUtils";
export default {
  undo: cilActionUndo,
  X: cilX,
  name: "ArchivedInAppQuestionnairesList",
  props: {
    onRestoreItem: Function,
    onDeleteItem: Function,
    questionnaires: Array,
  },
  methods: {
    isActivated(item) {
      return item.isActive || false;
    },
    dateFormat(val) {
      return formatDate(val);
    },
    onListItemClicked(item) {
      if (!item._id)
        throw "Cannot open in-app questionnaire without a valid _id property. Offending item received: " +
          JSON.stringify(item);
      const id = item._id;
      this.$router.push({
        path: `in_app_questionnaires/in_app_questionnaire=${id}`,
      });
    },
    onDeleteItemClicked(item) {
      this.onDeleteItem(item);
    },
    onRestoreItemClicked(item) {
      this.onRestoreItem(item._id);
    },
    onToggleClicked(item) {
      const id = item._id;
      const name = item.name || "";
      const desc = item.description || "";
      const isActive = !item.isActive || false;
      if (id) this.onToggleActivation(id, name, desc, isActive);
    },
  },
};
</script>
