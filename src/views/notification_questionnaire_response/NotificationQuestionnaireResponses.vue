<template>
  <CCard>
    <CCardHeader>
      Notification Questionnaire Responses
    </CCardHeader>
    <CCardBody>
      <CDataTable
        :items="tableData"
        :fields="tableFields"
        @row-clicked="onTableRowClicked"
        column-filter
        table-filter
        items-per-page-select
        :items-per-page="5"
        hover
        sorter
        pagination
      >
        <template #timestamp="{item}">
          <td>
            {{ formatDate(item.timestamp) }}
          </td>
        </template>
      </CDataTable>
    </CCardBody>
  </CCard>
</template>

<script>
import NotificationQuestionnaireResponsesQuery from "../../graphql/queries/NOTIFICATION_QUESTIONNAIRE_RESPONSES.gql";
import { formatDateWithHourAndSeconds } from "../../util/DateUtils";
export default {
  name: "NotificationQuestionnaireResponses",
  data() {
    return {
      notificationQuestionnaireResponses: [],
      tableFields: [
        {
          key: "email",
          _style: "min-width:200px",
        },
        {
          key: "questionnaire",
          _style: "min-width:200px",
        },
        {
          key: "timestamp",
          _style: "min-width:200px",
        },
      ],
    };
  },
  computed: {
    tableData: function() {
      return this.notificationQuestionnaireResponses.map((q) => {
        return {
          _id: q._id,
          timestamp: q.timestamp,
          email: q.user.email,
          questionnaire: q.notificationQuestionnaire.name,
        };
      });
    },
  },
  methods: {
    formatDate(date) {
      return formatDateWithHourAndSeconds(date);
    },
    onTableRowClicked(item, index, colname, event) {
      console.log("onTableRowClicked");
      if (!item._id)
        throw "Cannot open notification questionnaire response without a valid _id property. Offending item received: " +
          JSON.stringify(item);
      const id = item._id;
      this.$router.push({
        path: `notification_questionnaire_responses/notification_questionnaire_response=${id}`,
      });
    },
  },
  apollo: {
    notificationQuestionnaireResponses: {
      query: NotificationQuestionnaireResponsesQuery,
    },
  },
};
</script>
