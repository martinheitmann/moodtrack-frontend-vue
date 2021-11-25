<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <CContainer>
          <CIcon :content="$options.user" />
        </CContainer>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem :disabled="true">
      <CIcon name="cil-user" /> {{ currentUserEmail }}
    </CDropdownItem>
    <CDropdownDivider />
    <CDropdownItem v-on:click="signOut">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import firebase from "firebase";
import { cilUser } from "@coreui/icons";
export default {
  name: "TheHeaderDropdownAccnt",
  user: cilUser,
  data() {
    return {
      itemsCount: 42,
    };
  },
  computed: {
    currentUserEmail: function() {
      return this.$store.state.currentUserEmail;
    },
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("TheHeaderDropdownAccnt: signOut successful");
          this.$router.push({
            name: "Login",
          });
        })
        .catch((error) => {
          console.log("TheHeaderDropdownAccnt: signOut failed: " + error);
          // An error happened.
        });
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
