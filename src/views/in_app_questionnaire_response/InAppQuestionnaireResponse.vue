<template>
  <CCard>
    <CCardHeader>
      In-app Questionnaire Response
    </CCardHeader>
    <CCardBody>
      <CCol>
        <CRow
          class="mb-2 ml-2"
          v-if="
            inAppQuestionnaireResponse &&
              inAppQuestionnaireResponse.questionnaire &&
              inAppQuestionnaireResponse.questionnaire.name
          "
        >
          <h4>{{ inAppQuestionnaireResponse.questionnaire.name }}</h4>
        </CRow>
        <CCard
          v-for="(item, index) in inAppQuestionnaireResponseListElements"
          v-bind:key="index"
        >
          <CCardBody v-if="item.type === 'free_text'">
            <CCol>
              <CRow>
                <p class="font-weight-bold">{{ item.question }}</p>
              </CRow>
              <CRow>
                {{ item.response }}
              </CRow>
            </CCol>
          </CCardBody>
          <CCardBody v-if="item.type === 'multi_choice'">
            <CCol>
              <CRow>
                <p class="font-weight-bold">{{ item.question }}</p>
              </CRow>
              <CRow>
                <p class="font-italic">Selected choice:</p>
              </CRow>
              <CRow>
                <CCard class="w-50">
                  <CCardBody>
                    {{
                      item.selectedChoice.display || item.selectedChoice.value
                    }}
                  </CCardBody>
                </CCard>
              </CRow>
              <CRow>
                <p class="font-italic">Available choices:</p>
              </CRow>
              <CRow>
                <CCol>
                  <CRow v-for="(alt, index) in item.choices" v-bind:key="index">
                    <CCard class="w-50">
                      <CCardBody>
                        {{ alt.display || alt.value }}
                      </CCardBody>
                    </CCard>
                  </CRow>
                </CCol>
              </CRow>
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import InAppQuestionnaireResponseQuery from "../../graphql/queries/IN_APP_QUESTIONNAIRE_RESPONSE.gql";
export default {
  props: {
    id: String,
  },
  data() {
    return {
      inAppQuestionnaireResponse: null,
      inAppQuestionnaireResponseListElements: [],
    };
  },
  watch: {
    inAppQuestionnaireResponse: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.inAppQuestionnaireResponseListElements = this.createInAppQuestionnaireResponseListElements(
            val
          );
        } else this.inAppQuestionnaireResponseListElements = [];
      },
    },
  },
  methods: {
    createInAppQuestionnaireResponseListElements(inAppQuestionnaireResponse) {
      const freeTextResponses = inAppQuestionnaireResponse.freeTextItems.map(
        (q) => this.mapFreeTextQuestion(q)
      );
      const multiChoiceResponses = inAppQuestionnaireResponse.multipleChoiceItems.map(
        (q) => this.mapMultiChoiceQuestion(q)
      );

      const combined = freeTextResponses.concat(multiChoiceResponses);
      combined.sort((a, b) => {
        return a.index - b.index;
      });
      return combined;
    },
    mapFreeTextQuestion(q) {
      return {
        type: "free_text",
        index: q.index,
        question: q.question,
        response: q.response,
      };
    },
    mapMultiChoiceQuestion(q) {
      return {
        type: "multi_choice",
        index: q.index,
        question: q.question,
        selectedChoice: q.selectedChoice,
        choices: q.choices,
      };
    },
  },
  apollo: {
    inAppQuestionnaireResponse: {
      query: InAppQuestionnaireResponseQuery,
      variables() {
        return {
          _id: this.id,
        };
      },
    },
  },
};
</script>
