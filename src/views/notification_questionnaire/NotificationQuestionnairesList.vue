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
            <h5>{{ notificationQuestionnaire.name }}</h5>
          </CCol>
          <CCol xs>
            <CButton
              class="m-1"
              :size="'sm'"
              :color="'warning'"
              v-on:click.stop="onArchiveItemClicked(notificationQuestionnaire)"
            >
              <CIcon :content="$options.folder" />
            </CButton>
          </CCol>
          <CCol xs>
            <CButton
              class="m-1"
              :size="'sm'"
              :color="'danger'"
              v-on:click.stop="onDeleteItem(notificationQuestionnaire)"
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
              ><h6>{{ notificationQuestionnaire.description }}</h6></CCol
            >
          </CRow>
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
            v-if="!isActivated(notificationQuestionnaire)"
            align-horizontal="start"
            class="mt-2"
          >
            <CCol>
              <CButton
                :color="'info'"
                class="mt-2"
                v-bind="{ variant: 'outline' }"
                v-on:click.stop="onToggleClicked(notificationQuestionnaire)"
              >
                Activate
              </CButton>
            </CCol>
          </CRow>
          <CRow
            v-if="isActivated(notificationQuestionnaire)"
            align-horizontal="start"
            align-vertical="center"
            class="ml-1 mt-2"
          >
            <CCol xs>
              <CButton
                :color="'success'"
                class="mt-2"
                v-bind="{ variant: 'outline' }"
                v-on:click.stop="onToggleClicked(notificationQuestionnaire)"
              >
                Activated! (click to disable)
              </CButton>
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
import { cilX, cilFolderOpen } from "@coreui/icons";
import { formatDate } from "../../util/DateUtils";
export default {
  folder: cilFolderOpen,
  X: cilX,
  name: "NotificationQuestionnairesList",
  props: {
    onToggleActivation: Function,
    onDeleteItem: Function,
    onArchiveItem: Function,
    notificationQuestionnaires: Array,
    activatedNotificationQuestionnaires: Array,
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
    onArchiveItemClicked(item) {
      this.onArchiveItem(item._id);
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
