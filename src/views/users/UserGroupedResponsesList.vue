<template>
  <CCard>
    <CCardHeader>
      Grouped Questionnaire Responses For User
    </CCardHeader>
    <CCardBody>
      <CCol>
        <CRow align-horizontal="end" class="mb-2">
          <CCol xs class="my-auto">
            Items per page:
          </CCol>
          <CCol xs>
            <CDropdown
              color="primary"
              :toggler-text="perPage.toString()"
              class="m-2"
            >
              <CDropdownItem v-on:click="perPage = 5">5</CDropdownItem>
              <CDropdownItem v-on:click="perPage = 10">10</CDropdownItem>
              <CDropdownItem v-on:click="perPage = 25">25</CDropdownItem>
              <CDropdownItem v-on:click="perPage = 50">50</CDropdownItem>
            </CDropdown>
          </CCol>
        </CRow>
        <CRow v-for="(value, index) in pageData" :key="index">
          <CCard class="w-100 ml-2 mr-2">
            <CCardHeader>
              {{ value.messageId }}
            </CCardHeader>
            <CCardBody>
              <CRow v-for="(item, i) in value.entries" :key="i" class="m-2">
                <CCol>
                  <CRow>
                    <CCol
                      v-if="item.type === notification"
                      xs
                      class="border rounded text-primary p-1"
                    >
                      {{ getElementTypeString(item) }}
                    </CCol>
                    <CCol v-else xs class="border rounded text-info p-1">
                      {{ getElementTypeString(item) }}
                    </CCol>
                    <CCol class="p-1 ml-2">
                      {{ item.questionnaire }}
                    </CCol>
                  </CRow>
                </CCol>
                <CCol class="p-1">
                  {{ truncateString(item.id) }}
                </CCol>
                <CCol class="p-1">
                  {{ formatDate(item.timestamp) }}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>
        <CRow>
          <Pagination
            v-model="page"
            :records="Object.keys(viewData).length"
            :per-page="perPage"
            @paginate="setPageData"
          />
        </CRow>
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import { formatDateWithHourAndSeconds } from "../../util/DateUtils";
import {
  cilCircle,
  cilArrowLeft,
  cilArrowRight,
  cilChevronRight,
  cilChevronLeft,
} from "@coreui/icons";
export default {
  name: "UserGroupedResponsesList",
  circle: cilCircle,
  left: cilArrowLeft,
  right: cilArrowRight,
  cLeft: cilChevronLeft,
  cRight: cilChevronRight,
  props: {
    app_responses: Array,
    notif_responses: Array,
    onRowSelected: Function,
  },
  components: {
    Pagination: () => import("vue-pagination-2"),
  },
  data() {
    return {
      fields: [
        { key: "questionnaire_name", label: "Questionnaire Name" },
        { key: "timestamp", label: "Timestamp" },
      ],
      sorterState: { column: "timestamp", asc: false },
      notification: 1,
      inApp: 2,
      perPage: 5,
      page: 1,
    };
  },
  computed: {
    pageData() {
      const maxIndex = this.page * this.perPage;
      const minIndex = (this.page - 1) * this.perPage;
      const list = this.objectToList(this.viewData);
      const slicedList = list.slice(minIndex, maxIndex);
      return slicedList;
    },
    viewData: function() {
      try {
        const inappr = this.getInAppResponseData(this.app_responses);
        const notifr = this.getNotificationResponseData(this.notif_responses);
        const all = inappr.concat(notifr);
        const filtered = this.removeElementsWithoutMessageId(all);
        const grouped = this.groupByMessageId(filtered);
        return grouped;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
  },
  methods: {
    truncateString(str) {
      if (str.length > 10) {
        const substr1 = str.slice(str.length - 6, str.length);
        const substr2 = str.slice(0, 5);
        const substr3 = "...".concat(substr1);
        const ellipsis = substr2.concat(substr3);
        return ellipsis;
      }
      return str;
    },
    setPageData(page) {
      const maxIndex = page * this.perPage;
      const minIndex = (page - 1) * this.perPage;
      const list = this.objectToList(this.viewData);
      const slicedList = list.slice(minIndex, maxIndex);
      return slicedList;
    },
    objectToList(obj) {
      const items = [];
      for (const [key, value] of Object.entries(obj)) {
        const subitems = value.map(function(v) {
          return {
            messageId: key,
            id: v.id,
            questionnaire: v.questionnaire,
            timestamp: v.timestamp,
            type: v.type,
          };
        });
        const item = {
          messageId: key,
          entries: subitems,
        };
        items.push(item);
      }
      return items;
    },
    getElementTypeString(item) {
      if (item.type === this.notification) return "Notification";
      if (item.type === this.inApp) return "In-app";
      return "";
    },
    formatDate(d) {
      return formatDateWithHourAndSeconds(d);
    },
    groupByMessageId(elements) {
      let groups = {};
      for (const element of elements) {
        if (!groups[element.messageId]) {
          groups[element.messageId] = [element];
        } else {
          groups[element.messageId].push(element);
        }
      }
      return groups;
    },
    removeElementsWithoutMessageId(elements) {
      return elements.filter((el) => el.messageId);
    },
    getNotificationResponseData(responses) {
      const _this = this;
      return responses.map(function(el) {
        return {
          messageId: el.messageId,
          id: el._id,
          questionnaire:
            el.notificationQuestionnaire?.name || "Unknown Questionnaire",
          timestamp: el.timestamp,
          type: _this.notification,
        };
      });
    },
    getInAppResponseData(responses) {
      const _this = this;
      return responses.map(function(el) {
        return {
          messageId: el.messageId,
          id: el._id,
          questionnaire: el?.questionnaire?.name || "Unknown Questionnaire",
          timestamp: el.timestamp,
          type: _this.inApp,
        };
      });
    },
  },
};
</script>
