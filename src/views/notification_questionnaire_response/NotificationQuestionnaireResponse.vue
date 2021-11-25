<template>
  <CCard>
    <CCardHeader>
      Notification Questionnaire Response
    </CCardHeader>
    <CCardBody v-if="notificationQuestionnaireResponse">
      <CCol>
        <!-- Timestamp -->
        <CRow>
          <CCol>
            <CRow>
              Timestamp:
            </CRow>
            <CRow>
              <h5>{{ formattedDate }}</h5>
            </CRow>
          </CCol>
        </CRow>
        <!-- Timestamp end -->
        <!-- User -->
        <CRow>
          <CCol>
            <CRow>
              User:
            </CRow>
            <CRow>
              <h5>{{ userName }}</h5>
            </CRow>
          </CCol>
        </CRow>
        <!-- User end -->
        <!-- Message ID -->
        <CRow>
          <CCol>
            <CRow>
              Message ID:
            </CRow>
            <CRow>
              <h5>{{ messageId }}</h5>
            </CRow>
          </CCol>
        </CRow>
        <!-- Message ID end -->
        <!-- Question Text -->
        <CRow>
          <CCol>
            <CRow>
              Question Text:
            </CRow>
            <CRow>
              <h4>{{ questionText }}</h4>
            </CRow>
          </CCol>
        </CRow>
        <!-- Question Text -->
        <!-- Selected choice -->
        <CRow v-if="selectedChoice">
          <CCol>
            <CRow class="mb-1">
              Selected Choice:
            </CRow>
            <CRow>
              <CCard class="w-50">
                <CCardBody>
                  <CCol>
                    <CRow>
                      <CCol>
                        <CRow>
                          Icon:
                        </CRow>
                        <CRow>
                          <h6>{{ selectedChoice.choiceIcon }}</h6>
                        </CRow>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CRow>
                          Type:
                        </CRow>
                        <CRow>
                          <h6>{{ selectedChoice.choiceValueType }}</h6>
                        </CRow>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CRow>
                          Value:
                        </CRow>
                        <CRow>
                          <h6>{{ selectedChoice.choiceValue }}</h6>
                        </CRow>
                      </CCol>
                    </CRow>
                  </CCol>
                </CCardBody>
              </CCard>
            </CRow>
          </CCol>
        </CRow>
        <CRow v-if="!selectedChoice">
          No data available
        </CRow>
        <!-- Selected choice end -->
        <!-- Available choices start -->
        <CRow>
          All choices:
        </CRow>
        <CRow v-for="(item, index) in allChoices" v-bind:key="index">
          <CCard class="w-50">
            <CCardBody>
              <CCol>
                <CRow>
                  <CCol>
                    <CRow>
                      Icon:
                    </CRow>
                    <CRow>
                      <h6>{{ item.choiceIcon }}</h6>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CRow>
                      Type:
                    </CRow>
                    <CRow>
                      <h6>{{ item.choiceValueType }}</h6>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CRow>
                      Value:
                    </CRow>
                    <CRow>
                      <h6>{{ item.choiceValue }}</h6>
                    </CRow>
                  </CCol>
                </CRow>
              </CCol>
            </CCardBody>
          </CCard>
        </CRow>
        <!-- Available choices end -->
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import NotificationQuestionnaireResponseQuery from "../../graphql/queries/NOTIFICATION_QUESTIONNAIRE_RESPONSE.gql";
import { formatDate, formatDateWithHourAndSeconds } from "../../util/DateUtils";
export default {
  name: "NotificationQuestionnaireResponse",
  props: {
    id: String,
  },
  data() {
    return {
      notificationQuestionnaireResponse: null,
      nextNotificationQuestionnaireResponse: null,
    };
  },
  computed: {
    questionText: function() {
      if (this.notificationQuestionnaireResponse.responseData) {
        if (this.notificationQuestionnaireResponse.responseData.questionText) {
          return this.notificationQuestionnaireResponse.responseData
            .questionText;
        }
      }
    },
    formattedDate: function() {
      return formatDateWithHourAndSeconds(
        this.notificationQuestionnaireResponse.timestamp
      );
    },
    userName: function() {
      if (this.notificationQuestionnaireResponse.user) {
        return (
          this.notificationQuestionnaireResponse.user.email ||
          this.notificationQuestionnaireResponse.user._id ||
          "User ID/email unavailable"
        );
      }
      return "User unavailable";
    },
    messageId: function() {
      if (this.notificationQuestionnaireResponse.messageId) {
        return this.notificationQuestionnaireResponse.messageId;
      }
      return "No associated message ID";
    },
    selectedChoice: function() {
      if (this.notificationQuestionnaireResponse.responseData) {
        if (
          this.notificationQuestionnaireResponse.responseData.selectedChoice
        ) {
          return this.notificationQuestionnaireResponse.responseData
            .selectedChoice;
        }
      }
      return null;
    },
    allChoices: function() {
      if (this.notificationQuestionnaireResponse.responseData) {
        if (this.notificationQuestionnaireResponse.responseData.choices) {
          return this.notificationQuestionnaireResponse.responseData.choices;
        }
      }
      return [];
    },
  },
  methods: {},
  apollo: {
    notificationQuestionnaireResponse: {
      query: NotificationQuestionnaireResponseQuery,
      variables() {
        return { _id: this.id };
      },
    },
  },
};
</script>
