<template>
  <CCard>
    <CCardHeader>
      In-app Questionnaire Responses Submitted By User
    </CCardHeader>
    <CCardBody>
      <CDataTable
        :items="tableData"
        :fields="fields"
        column-filter
        table-filter
        items-per-page-select
        :items-per-page="25"
        hover
        sorter
        pagination
        :sorterValue.sync="sorterState"
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
import { formatDateWithHourAndSeconds, formatDate } from "../../util/DateUtils";
export default {
  name: "UserIAResponsesTable",
  props: {
    responses: Array,
    onRowSelected: Function,
  },
  computed: {
    tableData: function() {
      const data = this.responses.map(function(response) {
        return {
          questionnaire_name:
            response?.questionnaire?.name || "Unknown Questionnaire",
          timestamp: response.timestamp,
        };
      });
      return data;
    },
  },
  data() {
    return {
      fields: [
        { key: "questionnaire_name", label: "Questionnaire Name" },
        { key: "timestamp", label: "Timestamp" },
      ],
      sorterState: { column: "timestamp", asc: false },
    };
  },
  methods: {
    formatDate(d) {
      return formatDateWithHourAndSeconds(d);
    },
  },
  watch: {},
};
</script>
