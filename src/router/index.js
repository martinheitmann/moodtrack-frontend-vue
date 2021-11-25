import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";
import store from "../store";

// Containers
const TheContainer = () => import("@/containers/TheContainer");

// Views
const Dashboard = () => import("@/views/Dashboard");

const Colors = () => import("@/views/theme/Colors");
const Typography = () => import("@/views/theme/Typography");

// Views - Pages
const Page404 = () => import("@/views/pages/Page404");
const Page500 = () => import("@/views/pages/Page500");
const Login = () => import("@/views/pages/Login");
const Register = () => import("@/views/pages/Register");

// Users
const Users = () => import("@/views/users/Users");
const User = () => import("@/views/users/User");

// Notification Questionnaires
const NotificationQuestionnaires = () =>
  import("@/views/notification_questionnaire/NotificationQuestionnaires");
const NotificationQuestionnaire = () =>
  import("@/views/notification_questionnaire/NotificationQuestionnaire");

// Notification Questionnaire Responses
const NotificationQuestionnaireResponses = () =>
  import(
    "@/views/notification_questionnaire_response/NotificationQuestionnaireResponses"
  );
const NotificationQuestionnaireResponse = () =>
  import(
    "@/views/notification_questionnaire_response/NotificationQuestionnaireResponse"
  );

// In-app Questionnaires
const InAppQuestionnaires = () =>
  import("@/views/in_app_questionnaire/InAppQuestionnaires");
const InAppQuestionnaire = () =>
  import("@/views/in_app_questionnaire/InAppQuestionnaire");

// In-app Questionnaire Responses
const InAppQuestionnaireResponses = () =>
  import("@/views/in_app_questionnaire_response/InAppQuestionnaireResponses");
const InAppQuestionnaireResponse = () =>
  import("@/views/in_app_questionnaire_response/InAppQuestionnaireResponse");

// UploadedIcons
const UploadedIcons = () => import("@/views/uploadedicons/UploadedIcons");

// Responses
const Responses = () => import("@/views/responses/Responses");

// Test Messaging
const TestMessaging = () => import("@/views/messaging/TestMessaging");

// Settings/config
const Configuration = () => import("@/views/settings/Settings");

Vue.use(Router);

const router = new Router({
  //mode: "hash", // https://router.vuejs.org/api/#mode
  mode: "hash",
  base: process.env.NODE_ENV === "production" ? "/moodtrack-control/" : "/",
  linkActiveClass: "open active",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      name: "Home",
      component: TheContainer,
      meta: {
        requiresAuth: true,
      },
      beforeEnter: checkToken,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "notification_questionnaires",
          meta: { label: "Notification Questionnaire" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "Notification Questionnaires",
              component: NotificationQuestionnaires,
            },
            {
              path: "notification_questionnaire=:id",
              meta: {
                label: "Notification Questionnaire",
              },
              name: "Notification Questionnaire",
              props: true,
              component: NotificationQuestionnaire,
            },
          ],
        },
        {
          path: "notification_questionnaire_responses",
          meta: { label: "Notification Questionnaire Responses" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "Notification Questionnaire Responses",
              component: NotificationQuestionnaireResponses,
            },
            {
              path: "notification_questionnaire_response=:id",
              meta: {
                label: "Notification Questionnaire Response",
              },
              name: "Notification Questionnaire Response",
              props: true,
              component: NotificationQuestionnaireResponse,
            },
          ],
        },
        {
          path: "users",
          meta: { label: "Users" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "Users",
              component: Users,
            },
            {
              path: ":id",
              meta: {
                label: "User Details",
              },
              name: "User",
              props: true,
              component: User,
            },
          ],
        },
        {
          path: "uploadedicons",
          meta: { label: "Uploaded Icons" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "UploadedIcons",
              component: UploadedIcons,
            },
          ],
        },
        {
          path: "responses",
          meta: { label: "Responses" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "Responses",
              component: Responses,
            },
          ],
        },
        {
          path: "testmessaging",
          meta: { label: "Test Messaging" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "Test Messaging",
              component: TestMessaging,
            },
          ],
        },
        {
          path: "in_app_questionnaires",
          meta: { label: "In-App Questionnaires" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "In-App Questionnaires",
              component: InAppQuestionnaires,
            },
            {
              path: "in_app_questionnaire=:id",
              meta: {
                label: "In-App Questionnaire",
              },
              name: "In-App Questionnaire",
              props: true,
              component: InAppQuestionnaire,
            },
          ],
        },
        {
          path: "in_app_questionnaire_responses",
          meta: { label: "In-App Questionnaire Responses" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "In-App Questionnaire Responses",
              component: InAppQuestionnaireResponses,
            },
            {
              path: "in_app_questionnaire_response=:id",
              meta: {
                label: "In-App Questionnaire Response",
              },
              name: "In-App Questionnaire Response",
              props: true,
              component: InAppQuestionnaireResponse,
            },
          ],
        },
        {
          path: "configuration",
          meta: { label: "Configuation" },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "Configuration",
              component: Configuration,
            },
          ],
        },

        //---------------------------------------------------
        {
          path: "theme",
          redirect: "/theme/colors",
          name: "Theme",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "colors",
              name: "Colors",
              component: Colors,
            },
            {
              path: "typography",
              name: "Typography",
              component: Typography,
            },
          ],
        },
      ],
    },
    {
      path: "/pages",
      redirect: "/pages/404",
      name: "Pages",
      component: {
        render(c) {
          return c("router-view");
        },
      },
      children: [
        {
          path: "404",
          name: "Page404",
          component: Page404,
        },
        {
          path: "500",
          name: "Page500",
          component: Page500,
        },
        {
          path: "login",
          name: "Login",
          component: Login,
          beforeEnter: redirectFromLoginIfAuthenticated,
        },
        {
          path: "register",
          name: "Register",
          component: Register,
        },
      ],
    },
    {
      path: "*",
      name: "catchAll",
      component: Page404,
    },
  ],
});

router.beforeEach(checkAuth);

function redirectFromLoginIfAuthenticated(to, from, next) {
  console.log("Router: redirectFromLoginIfAuthenticated");
  firebase
    .getCurrentUser()
    .then(function(user) {
      if (user) next({ name: "Dashboard" });
      else next();
    })
    .catch(function(error) {
      next();
    });
}

function checkAuth(to, from, next) {
  console.log("Router beforeEach");
  if (to.meta.requiresAuth) {
    firebase
      .getCurrentUser()
      .then(function(user) {
        if (user) next();
        else next({ name: "Login" });
      })
      .catch(function(error) {
        next({ name: "Login" });
      });
  } else {
    next();
  }
}

function checkToken(from, to, next) {
  const storeIdToken = store.getters.getIdToken;
  console.log("TheContainer beforeEnter token: " + storeIdToken);
  if (!storeIdToken) {
    console.log("TheContainer beforeEnter: token invalid");
    firebase
      .getCurrentUser()
      .then((user) => {
        console.log("beforeEnter -> getCurrentUser -> then");
        user
          .getIdToken(true)
          .then((idToken) => {
            if (idToken) {
              store.commit("setIdToken", idToken);
              next();
            } else next({ name: "Login" });
          })
          .catch((error) => {
            console.log(error);
            next({ name: "Login" });
          });
      })
      .catch((error) => {
        console.log("beforeEnter -> getCurrentUser -> catch");
        console.log(error);
        next({ name: "Login" });
      });
  } else next();
}

export default router;
