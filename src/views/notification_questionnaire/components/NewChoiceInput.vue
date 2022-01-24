<template>
  <CCol>
    <CRow>
      <Multiselect
        v-model="choiceIconInput"
        :options="availableIcons"
        label="filename"
        track-by="_id"
        placeholder="Select a icon filename..."
      />
    </CRow>
    <CRow class="mt-2">
      <Multiselect
        v-model="choiceValueTypeInput"
        :options="choiceTypeOptions"
        label="display"
        track-by="value"
        placeholder="Select a choice data type..."
      />
    </CRow>
    <CRow class="mt-2">
      <CInput
        v-model="choiceValueInput"
        class="w-100"
        placeholder="Provide your choice value..."
      />
    </CRow>
    <CRow class="mt-2">
      <CButton :color="'info'" :block="true" v-on:click="submit">
        Add New Choice
      </CButton>
    </CRow>
  </CCol>
</template>

<script>
export default {
  components: {
    Multiselect: () => import("vue-multiselect"),
  },
  props: {
    availableIcons: Array,
    choiceTypeOptions: Array,
    onSubmit: Function,
  },
  data() {
    return {
      choiceIconInput: null,
      choiceValueTypeInput: null,
      choiceValueInput: "",
    };
  },
  methods: {
    submit() {
      const data = {
        choiceIconMd5: this.choiceIconInput.md5,
        choiceIconId: this.choiceIconInput._id,
        choiceIcon: this.choiceIconInput.filename,
        choiceValue: this.choiceValueInput,
        choiceValueType: this.choiceValueTypeInput.value,
      };
      this.onSubmit(data);
    },
  },
};
</script>
