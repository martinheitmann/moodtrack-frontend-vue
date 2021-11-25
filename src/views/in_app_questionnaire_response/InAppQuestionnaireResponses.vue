<template>
  <CCard>
    <CCardHeader>
      In-app Questionnaire Responses
    </CCardHeader>
    <CCardBody>
      <CDataTable
        :items="tableData"
        :fields="tableFields"
        column-filter
        @row-clicked="onTableRowClicked"
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
import InAppQuestionnaireResponseQuery from "../../graphql/queries/IN_APP_QUESTIONNAIRE_RESPONSES.gql";
import { formatDateWithHourAndSeconds } from "../../util/DateUtils";
export default {
  name: "InAppQuestionaireResponses",
  data() {
    return {
      inAppQuestionnaireResponses: [],
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
      return this.inAppQuestionnaireResponses.map((q) => {
        return {
          _id: q._id,
          timestamp: q.timestamp,
          email: q.user.email,
          questionnaire: q.questionnaire?.name || "[Deleted Questionnaire]",
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
        throw "Cannot open in app questionnaire response without a valid _id property. Offending item received: " +
          JSON.stringify(item);
      const id = item._id;
      this.$router.push({
        path: `in_app_questionnaire_responses/in_app_questionnaire_response=${id}`,
      });
    },
  },
  apollo: {
    inAppQuestionnaireResponses: {
      query: InAppQuestionnaireResponseQuery,
    },
  },
};
</script>
