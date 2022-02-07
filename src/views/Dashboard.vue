<template>
  <div>
    <CCol>
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" class="card-title mb-0">Recent responses</h4>
              <div class="small text-muted">
                {{ monthNames[new Date().getMonth()] }}
              </div>
            </CCol>
          </CRow>
          <MainChart style="height:300px;margin-top:40px;" :data="chartData" />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" class="card-title mb-0">Recent users</h4>
              <div class="small text-muted">
                {{ monthNames[new Date().getMonth()] }}
              </div>
            </CCol>
          </CRow>
          <RecentUsersTable :users="users" />
        </CCardBody>
      </CCard>
    </CCol>
  </div>
</template>

<script>
import MainChart from "./charts/MainChart";
import RecentUsersTable from "./tables/RecentUsersTable.vue";
import NotificationResponsesPerDayQuery from "../graphql/queries/NOTIFICATION_RESPONSES_PER_DAY.gql";
import UsersQuery from "../graphql/queries/USERS.gql";
export default {
  name: "Dashboard",
  components: {
    MainChart,
    RecentUsersTable,
  },
  data() {
    return {
      users: [],
      numberOfResponsesForEachDay: null,
      numberOfResponsesForEachDayParsed: [],
      graphStart: this.getFirstDayOfCurrentMonth(),
      graphEnd: this.getLastDayOfCurrentMonth(),
      selected: "Month",
      chartData: [],
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  watch: {
    numberOfResponsesForEachDay: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val || val !== "") {
          let parsedResponse = JSON.parse(val);
          this.numberOfResponsesForEachDayParsed = JSON.parse(val);
          this.chartData = this.combineDataAndLabels(parsedResponse);
        }
      },
    },
  },
  methods: {
    getLastDayOfCurrentMonth() {
      let today = new Date();
      return new Date(today.getFullYear(), today.getMonth() + 1, 0);
    },
    getFirstDayOfCurrentMonth() {
      let date = new Date();
      return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    daysInCurrentMonthToArray() {
      let now = new Date();
      const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysArray = [];
      for (let i = 0; i < days; i++) {
        daysArray.push({
          day: i + 1,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
      }
      return daysArray;
    },
    combineDataAndLabels(data) {
      const _this = this;
      const daysLabels = this.daysInCurrentMonthToArray();
      return daysLabels.map(function(label) {
        const value = _this.getChartDataForDay(
          label.day,
          label.month,
          label.year,
          data
        );
        //console.log(value);
        if (value) {
          return {
            label: label,
            value: value.count,
          };
        } else
          return {
            label: label,
            value: 0,
          };
      });
    },
    getChartDataForDay(day, month, year, data) {
      if (!data) return null;
      return data.find(
        (e) =>
          (e._id.year === year || e._id.year === 0) &&
          (e._id.month === month || e._id.month === 0) &&
          (e._id.day === day || e._id.day === 0)
      );
    },
  },
  apollo: {
    numberOfResponsesForEachDay: {
      query: NotificationResponsesPerDayQuery,
      variables() {
        //console.log(this.graphStart);
        //console.log(this.graphEnd);
        return {
          startDate: this.graphStart,
          endDate: this.graphEnd,
        };
      },
    },
    users: {
      query: UsersQuery,
    },
  },
};
</script>
