export default [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavTitle",
        _children: ["Users"],
      },
      {
        _name: "CSidebarNavItem",
        name: "Users",
        to: "/users",
        icon: "cil-user",
      },
      {
        _name: "CSidebarNavTitle",
        _children: ["Content"],
      },
      {
        _name: "CSidebarNavItem",
        name: "Posts & News",
        to: "/posts",
        icon: "cil-comment-square",
      },
      {
        _name: "CSidebarNavTitle",
        _children: ["Notification Questionnaire"],
      },
      {
        _name: "CSidebarNavItem",
        name: "Questionnaires",
        to: "/notification_questionnaires",
        icon: "cil-bell",
      },
      {
        _name: "CSidebarNavItem",
        name: "Responses",
        to: "/notification_questionnaire_responses",
        icon: "cil-cursor",
      },
      {
        _name: "CSidebarNavTitle",
        _children: ["In-app Questionnaire"],
      },
      {
        _name: "CSidebarNavItem",
        name: "Questionnaires",
        to: "/in_app_questionnaires",
        icon: "cil-list",
      },
      {
        _name: "CSidebarNavItem",
        name: "Responses",
        to: "/in_app_questionnaire_responses",
        icon: "cil-cursor",
      },
      {
        _name: "CSidebarNavTitle",
        _children: ["Media"],
      },
      {
        _name: "CSidebarNavItem",
        name: "Icons",
        to: "/uploadedicons",
        icon: "cil-image-1",
      },
      {
        _name: "CSidebarNavTitle",
        _children: ["Tools"],
      },
      {
        _name: "CSidebarNavItem",
        name: "Test Messaging",
        to: "/testmessaging",
        icon: "cil-screen-smartphone",
      },
      {
        _name: "CSidebarNavItem",
        name: "Configuration",
        to: "/configuration",
        icon: "cil-settings",
      },
    ],
  },
];
