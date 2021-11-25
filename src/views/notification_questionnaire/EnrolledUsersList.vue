<template>
  <CRow v-if="users" class="w-100">
    <CCol>
      <CDataTable
        class="w-100"
        hover
        striped
        :items="users"
        :fields="fields"
        :items-per-page="50"
        clickable-rows
        :active-page="activePage"
        :pagination="{ doubleArrows: false, align: 'center' }"
        @page-change="pageChange"
      >
        <template #remove="{item}">
          <td class="py-2">
            <CButton
              color="danger"
              variant="outline"
              square
              size="sm"
              v-on:click="onDelete(item)"
            >
              Remove
            </CButton>
          </td>
        </template>
      </CDataTable>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: "EnrolledUsersList",
  props: {
    users: Array,
    onDeleteUser: Function,
  },
  data() {
    return {
      fields: [
        { key: "email", label: "Email" },
        {
          key: "remove",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],
      activePage: 1,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    onDelete(item) {
      this.onDeleteUser(item);
    },
  },
};
</script>
