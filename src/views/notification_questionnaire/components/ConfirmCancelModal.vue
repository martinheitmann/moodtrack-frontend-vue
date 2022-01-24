<template>
  <!---------------- Archive node modal ----------------->
  <CModal title="Archive node " color="info" :show.sync="isVisible">
    <div slot="default">
      <CCol>
        {{ message }}
      </CCol>
    </div>
    <div slot="footer">
      <CRow align-horizontal="end">
        <CCol class="m-1" v-if="isLoading">
          <CSpinner color="primary" style="width:3rem;height:3rem;" />
        </CCol>
        <CCol xs class="m-1" v-if="!isLoading">
          <CButton color="success" size="lg" v-on:click="positiveClicked()">
            Yes
          </CButton>
        </CCol>
        <CCol xs class="m-1" v-if="!isLoading">
          <CButton color="danger" size="lg" v-on:click="negativeClicked()">
            No
          </CButton>
        </CCol>
      </CRow>
    </div>
  </CModal>
  <!--------------- End modal ------------->
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    message: String,
    isLoading: Number,
    onPositive: Function,
    onNegative: Function,
  },
  methods: {
    closeModal() {
      this.onComplete();
    },
    positiveClicked() {
      this.onPositive();
    },
    negativeClicked() {
      this.onNegative();
    },
  },
};
</script>
