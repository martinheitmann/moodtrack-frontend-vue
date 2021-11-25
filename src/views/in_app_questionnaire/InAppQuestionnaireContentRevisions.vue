<template>
  <CCol>
    <!---------------- Content revision modal ----------------->
    <CModal
      title="In-App Questionnaire Rev. "
      color="info"
      :show.sync="selectedRevisionModal"
    >
      <div slot="default">
        <CCol v-if="selectedRevision">
          <CRow v-for="(element, index) in selectedRevision" :key="index">
            <CCol>
              <CContainer v-if="element.type === itemType.FREE_TEXT">
                <CCard class="w-100">
                  <CCardBody>
                    <CCol>
                      <CRow>
                        {{ element.question }}
                      </CRow>
                    </CCol>
                  </CCardBody>
                </CCard>
              </CContainer>
              <CContainer v-if="element.type === itemType.MULTI_CHOICE">
                <CCard class="w-100">
                  <CCardBody>
                    <CCol>
                      <CRow>
                        {{ element.question }}
                      </CRow>
                      <CRow>
                        <CCol>
                          <CRow
                            v-for="(item, index) in element.choices"
                            :key="index"
                            class="mb-2 mt-2 border rounded"
                            align-vertical="center"
                          >
                            <CCol class="m-2">
                              {{ item.display || item.value }}
                            </CCol>
                          </CRow>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CCardBody>
                </CCard>
              </CContainer>
            </CCol>
          </CRow>
        </CCol>
      </div>
      <div slot="footer">
        <CRow align-horizontal="end">
          <CCol xs class="m-1">
            <CButton
              color="danger"
              size="lg"
              v-on:click="selectedRevisionModal = false"
            >
              Close
            </CButton>
          </CCol>
        </CRow>
      </div>
    </CModal>
    <!-------------- Modal end ---------------------------->
    <CCard>
      <CCardHeader>
        Revision History
      </CCardHeader>
      <CCardBody>
        <CCol>
          <CRow v-for="contents in slicedContents" :key="contents._id">
            <CCol>
              <CCard v-on:click="queryInAppQuestonnaireContent(contents._id)">
                <CCardHeader>
                  {{ truncateString(contents._id) }}
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol>
                      {{ formatDateHS(contents.creationDate) }}
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script>
import { formatDateWithHourAndSeconds, formatDate } from "../../util/DateUtils";
import InAppQuestionnaireContentQuery from "../../graphql/queries/IN_APP_QUESTIONNAIRE_CONTENT.gql";
import { createList } from "./InAppQuestionnaireUtils";
import { ItemType } from "./InAppQuestionnaireQuestionTypes";
export default {
  name: "InAppQuestionnaireContentRevisions",
  props: {
    inAppQuestionnaireContents: Array,
    questionnaireId: String,
  },
  data() {
    return {
      selectedRevision: null,
      selectedRevisionModal: false,
      loading: 0,
    };
  },
  computed: {
    title() {
      return "In-app Questionnaire Rev " + this.id;
    },
    itemType() {
      return ItemType;
    },
    slicedContents: function() {
      return this.inAppQuestionnaireContents
        .sort(function(a, b) {
          return new Date(b.creationDate) - new Date(a.creationDate);
        })
        .slice(0, 5);
    },
  },
  methods: {
    formatDateHS(date) {
      return formatDateWithHourAndSeconds(date);
    },
    formatDate(date) {
      return formatDate(date);
    },
    truncateString(str) {
      if (str.length > 10) {
        const substr1 = str.slice(str.length - 5, str.length);
        const substr2 = str.slice(0, 4);
        const substr3 = "...".concat(substr1);
        const ellipsis = substr2.concat(substr3);
        return ellipsis;
      }
      return str;
    },
    queryInAppQuestonnaireContent(id) {
      const _this = this;
      this.$apollo
        .query({
          query: InAppQuestionnaireContentQuery,
          loadingKey: "loading",
          variables: {
            questionnaireId: this.questionnaireId,
            _id: id,
          },
        })
        .then((result) => {
          console.log(result);
          const contents = result.data.inAppQuestionnaireContent;
          const list = createList(
            contents.freeTextItems,
            contents.multipleChoiceItems
          );
          _this.selectedRevision = list;
          _this.selectedRevisionModal = true;
        })
        .catch((error) => {
          console.log(error);
          _this.selectedRevision = null;
        });
    },
  },
};
</script>
