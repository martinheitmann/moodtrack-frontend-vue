<template>
  <CDataTable
    hover
    striped
    :items="mostRecentUsers"
    :fields="fields"
    :items-per-page="5"
  >
  </CDataTable>
</template>

<script>
import { formatDate } from "../../util/DateUtils";
export default {
  name: "RecentUsersTable",
  props: {
    users: Array,
  },
  data() {
    return {
      limit: 5,
      fields: [
        { key: "email", label: "Email" },
        { key: "creationDate", label: "Created" },
      ],
    };
  },
  computed: {
    mostRecentUsers: function() {
      try {
        const _this = this;
        let users = this.users
          .sort(function(a, b) {
            return new Date(b.creationDate) - new Date(a.creationDate);
          })
          .slice(0, 4);
        return users.map(function(user) {
          return {
            email: user.email,
            creationDate: _this.formatCreationDate(user.creationDate),
          };
        });
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  },
  methods: {
    formatCreationDate(date) {
      return formatDate(date);
    },
  },
};
</script>
