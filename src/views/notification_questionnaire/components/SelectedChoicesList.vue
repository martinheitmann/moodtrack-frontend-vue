<template>
  <CCol>
    <CRow
      v-for="(choice, index) in choices"
      :key="index"
      class="border rounded p-1 mt-1 mb-1"
      align-vertical="center"
    >
      <CCol xs class="mr-2 ml-2">
        {{ choice.choiceIcon }}
      </CCol>
      <CCol xs class="mr-2 ml-2">
        {{ choice.choiceValueType }}
      </CCol>
      <CCol xs class="mr-2 ml-2">
        {{ choice.choiceValue }}
      </CCol>
      <CCol></CCol>
      <CCol xs class="mr-1 ml-1">
        <CButton :size="'sm'" :color="'info'" v-on:click="onSwitchUp(index)">
          <CIcon :content="$options.bottom" />
        </CButton>
      </CCol>
      <CCol xs class="mr-1 ml-1">
        <CButton :size="'sm'" :color="'info'" v-on:click="onSwitchDown(index)">
          <CIcon :content="$options.top" />
        </CButton>
      </CCol>
      <CCol xs class="mr-1 ml-1">
        <CButton :size="'sm'" :color="'danger'" v-on:click="onDelete(index)">
          <CIcon :content="$options.X" />
        </CButton>
      </CCol>
    </CRow>
  </CCol>
</template>

<script>
import { cilX, cilChevronTop, cilChevronBottom } from "@coreui/icons";
export default {
  props: {
    choices: Array,
    onSwitchDown: Function,
    onSwitchUp: Function,
    onDelete: Function,
  },
  X: cilX,
  top: cilChevronTop,
  bottom: cilChevronBottom,
};
</script>
