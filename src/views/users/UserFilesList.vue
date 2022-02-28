<template>
  <CCard>
    <CCardHeader>
      Files uploaded by user
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
        <template #uploadDate="{item}">
          <td>
            {{ formatDate(item.uploadDate) }}
          </td>
        </template>
        <template #showDoc="{item, index}">
          <td>
            <CButton color="info" v-on:click="onDownloadClicked(index)">
              Download
            </CButton>
          </td>
        </template>
        <template #deleteDoc="{item, index}">
          <td>
            <CButton color="danger" v-on:click="onDeleteClicked(index)">
              Delete
            </CButton>
          </td>
        </template>
      </CDataTable>
    </CCardBody>
  </CCard>
</template>

<script>
import { formatDateWithHourAndSeconds } from "../../util/DateUtils";
export default {
  name: "UserFilesList",
  props: {
    files: Array,
    onDownload: Function,
    onDelete: Function,
  },
  data() {
    return {
      fields: [
        { key: "fileName", label: "File Name" },
        { key: "uploadDate", label: "Uploaded" },
        { key: "showDoc", label: "" },
        { key: "deleteDoc", label: "" },
      ],
      sorterState: { column: "timestamp", asc: false },
    };
  },
  computed: {
    tableData: function() {
      const data = this.files.map(function(file) {
        return {
          fileName: file?.filename || "N/A",
          uploadDate: file?.uploadDate,
        };
      });
      return data;
    },
  },
  methods: {
    onDownloadClicked(index) {
      this.onDownload(index);
    },
    onDeleteClicked(index) {
      this.onDelete(index);
    },
    formatDate(d) {
      return formatDateWithHourAndSeconds(d);
    },
  },
};
</script>
