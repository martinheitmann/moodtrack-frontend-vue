<template>
  <CCol>
    <CCard
      v-for="notificationQuestionnaire in notificationQuestionnaires"
      v-bind:key="notificationQuestionnaire._id"
      v-on:click="onListItemClicked(notificationQuestionnaire)"
    >
      <CCardHeader>
        <CRow align-vertical="center">
          <CCol>
            <h5 style="color:red;">{{ notificationQuestionnaire.name }}</h5>
          </CCol>
          <CCol xs>
            <CButton
              class="m-1"
              :size="'sm'"
              :color="'info'"
              v-on:click.stop="onRestoreItemClicked(notificationQuestionnaire)"
            >
              <CIcon :content="$options.undo" />
            </CButton>
          </CCol>
          <CCol xs>
            <CButton
              class="m-1"
              :size="'sm'"
              :color="'danger'"
              v-on:click.stop="onDeleteItemClicked(notificationQuestionnaire)"
            >
              <CIcon :content="$options.X" />
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CCol v-if="notificationQuestionnaire">
          <CRow>
            <CCol
              ><span
                >Created:
                {{ dateFormat(notificationQuestionnaire.created) }}</span
              ></CCol
            >
          </CRow>
          <CRow>
            <CCol
              ><span
                >Description:
                {{
                  notificationQuestionnaire.description || "No description"
                }}</span
              ></CCol
            >
          </CRow>
          <CRow
            align-horizontal="start"
            align-vertical="center"
            class="ml-1 mt-2"
          >
            <CCol xs>
              <span style="color:red;">
                Restore to activate
              </span>
            </CCol>
          </CRow>
        </CCol>
      </CCardBody>
    </CCard>
    <CRow
      align-horizontal="center"
      v-if="notificationQuestionnaires && notificationQuestionnaires.length < 1"
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
  name: "ArchivedNotificationQuestionnairesList",
  props: {
    onRestoreItem: Function,
    onDeleteItem: Function,
    notificationQuestionnaires: Array,
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
        throw "Cannot open notification questionnaire without a valid _id property. Offending item received: " +
          JSON.stringify(item);
      const id = item._id;
      this.$router.push({
        path: `notification_questionnaires/notification_questionnaire=${id}`,
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
