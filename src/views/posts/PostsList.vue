<template>
  <CCol>
    <CCard v-for="post in posts" :key="post._id">
      <CCardHeader>
        <CRow>
          <CCol xs class="ml-1" v-if="post.pinned">
            <CIcon :content="$options.pinned" />
          </CCol>
          <CCol>
            {{ post.title }}
          </CCol>
          <CCol xs class="mr-2">
            <CButton color="info" v-on:click="onEdit(post._id)"
              ><CIcon :content="$options.edit" />
            </CButton>
          </CCol>
          <CCol xs>
            <CButton color="danger" v-on:click="onDelete(post._id)"
              ><CIcon :content="$options.delete" />
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            {{ post.body }}
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script>
import { cilX, cilPencil, cilPin } from "@coreui/icons";
export default {
  delete: cilX,
  edit: cilPencil,
  pinned: cilPin,
  props: {
    posts: Array,
    onDelete: Function,
    onEdit: Function,
  },
};
</script>
