<template>
  <CCol>
    <CCard
      v-for="questionnaire in questionnaires"
      v-bind:key="questionnaire._id"
      v-on:click="onListItemClicked(questionnaire)"
    >
      <CCardHeader>
        <CRow align-vertical="center">
          <CCol>
            <h5>{{ questionnaire.name }}</h5>
          </CCol>
          <CCol xs>
            <CButton
              class="m-1"
              :size="'sm'"
              :color="'warning'"
              v-on:click.stop="onArchiveItemClicked(questionnaire)"
            >
              <CIcon :content="$options.folder" />
            </CButton>
          </CCol>
          <CCol xs>
            <CButton
              class="m-1"
              :size="'sm'"
              :color="'danger'"
              v-on:click.stop="onDeleteItem(questionnaire)"
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
import { cilX, cilFolderOpen } from "@coreui/icons";
import { formatDate } from "../../util/DateUtils";
export default {
  folder: cilFolderOpen,
  X: cilX,
  name: "InAppQuestionnairesList",
  props: {
    onDeleteItem: Function,
    onArchiveItem: Function,
    questionnaires: Array,
  },
  methods: {
    dateFormat(val) {
      return formatDate(val);
    },
    onListItemClicked(item) {
      if (!item._id)
        throw "Cannot open  questionnaire without a valid _id property. Offending item received: " +
          JSON.stringify(item);
      const id = item._id;
      this.$router.push({
        path: `in_app_questionnaires/in_app_questionnaire=${id}`,
      });
    },
    onDeleteItemClicked(item) {
      this.onDeleteItem(item);
    },
    onArchiveItemClicked(item) {
      this.onArchiveItem(item._id);
    },
  },
};
</script>
