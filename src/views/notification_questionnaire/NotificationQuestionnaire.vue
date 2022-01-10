<template>
  <CCol>
    <CRow>
      <!-- ERROR TOASTER -->
      <CToaster :autohide="3000">
        <template v-for="toast in errorToasts">
          <CToast
            :key="'toast' + toast"
            :show="true"
            header="An error occured..."
          >
            {{ errorMessage }}
          </CToast>
        </template>
      </CToaster>

      <!-- SUCCESS TOASTER -->
      <CToaster :autohide="3000">
        <template v-for="toast in successToasts">
          <CToast :key="'toast' + toast" :show="true" header="Success!">
            Action performed successfully!
          </CToast>
        </template>
      </CToaster>

      <!-- NETWORK AND ENROLLMENT -->
      <CCol class="col-8">
        <!-- NETWORK -->
        <CRow>
          <div id="mynetwork"></div>
        </CRow>
        <!------------->

        <!-- ENROLLMENT -->
        <CRow class="m-2">
          <CCol>
            <CCard>
              <CCardHeader>
                Register users to receive notifications from this questionnaire
              </CCardHeader>
              <CCardBody>
                <CCol>
                  <CRow>
                    <CCol>
                      <Multiselect
                        v-model="selectedUserToRegister"
                        :options="users"
                        label="email"
                        track-by="_id"
                        placeholder="Select a user to register for notifications..."
                      />
                    </CCol>
                    <CCol xs>
                      <CButton
                        :color="'info'"
                        class="m-1"
                        v-on:click="addUserToNotificationQuestionnaire"
                      >
                        Add
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow
                    v-if="
                      notificationQuestionnaire &&
                        notificationQuestionnaire.enrolledUsers
                    "
                    class="mt-2"
                  >
                    <EnrolledUsersList
                      :users="notificationQuestionnaire.enrolledUsers"
                      :onDeleteUser="removeUserFromNotificationQuestionnaire"
                    />
                  </CRow>
                </CCol>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <!---------------->
      </CCol>
      <!-------->

      <!-- SIDE PANEL VIEW -->
      <CCol>
        <!-- BUTTONS -->
        <CRow class="m-2" v-if="currentMode === 'NONE'">
          <CButton
            :color="'info'"
            v-on:click="switchMode('ADD_NODE')"
            class="m-1"
          >
            Add Node
          </CButton>
          <CButton
            :color="'info'"
            class="m-1"
            v-on:click="switchMode('CONNECT_NODES')"
          >
            Connect Nodes
          </CButton>
          <CButton
            :color="'info'"
            class="m-1"
            v-on:click="switchMode('DELETE_NODE')"
          >
            Delete Node
          </CButton>
          <CButton
            :color="'info'"
            class="m-1"
            v-on:click="switchMode('DISCONNECT_NODES')"
          >
            Disconnect Nodes
          </CButton>
          <CButton
            :color="'info'"
            class="m-1"
            v-on:click="switchMode('ARCHIVED_NODES')"
          >
            Show Archived Nodes
          </CButton>
        </CRow>
        <!-- BUTTONS -->

        <AddNode
          :onSubmit="addNode"
          :onClose="switchMode"
          :icons="icons"
          :inAppQuestionnaires="inAppQuestionnaires"
          v-if="currentMode && currentMode === 'ADD_NODE'"
        />

        <ConnectNodes
          :onClose="switchMode"
          :onSubmit="addEdge"
          :nodes="activeNodes"
          :edges="activeEdges"
          v-if="currentMode && currentMode === 'CONNECT_NODES'"
        />

        <DeleteEdge
          :onSubmit="deleteEdge"
          :onClose="switchMode"
          :edges="activeEdges"
          v-if="currentMode && currentMode === 'DISCONNECT_NODES'"
        />

        <DeleteNode
          :onSubmit="deleteNode"
          :onClose="switchMode"
          :nodes="activeNodes"
          v-if="currentMode && currentMode === 'DELETE_NODE'"
        />

        <EditNode
          :onSubmit="editNode"
          :onCopy="copyNode"
          :onClose="switchMode"
          :onArchive="archiveNode"
          :node="selectedNode"
          :icons="icons"
          :inAppQuestionnaires="inAppQuestionnaires"
          v-if="currentMode && currentMode === 'EDIT_NODE'"
        />

        <EditConnection
          :onSubmit="editEdge"
          :onClose="switchMode"
          :nodes="activeNodes"
          :edges="activeEdges"
          :edge="selectedEdge"
          v-if="currentMode && currentMode === 'EDIT_CONNECTION'"
        />

        <ArchivedNodes
          :onClose="switchMode"
          :nodes="archivedNodes"
          :onRestore="restoreNode"
          v-if="currentMode && currentMode === 'ARCHIVED_NODES'"
        />
      </CCol>
      <!-- -->
    </CRow>
    <!-- <CRow class="m-2">
      <CCol col="8">
        <CCard>
          <CCardHeader>
            Register users to receive notifications from this questionnaire
          </CCardHeader>
          <CCardBody>
            <CCol>
              <CRow>
                <CCol>
                  <Multiselect
                    v-model="selectedUserToRegister"
                    :options="users"
                    label="email"
                    track-by="_id"
                    placeholder="Select a user to register for notifications..."
                  />
                </CCol>
                <CCol xs>
                  <CButton
                    :color="'info'"
                    class="m-1"
                    v-on:click="addUserToNotificationQuestionnaire"
                  >
                    Add
                  </CButton>
                </CCol>
              </CRow>
              <CRow
                v-if="
                  notificationQuestionnaire &&
                    notificationQuestionnaire.enrolledUsers
                "
                class="mt-2"
              >
                <EnrolledUsersList
                  :users="notificationQuestionnaire.enrolledUsers"
                  :onDeleteUser="removeUserFromNotificationQuestionnaire"
                />
              </CRow>
            </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow> -->
  </CCol>
</template>

<script>
import { Network } from "vis-network";
import EdgesQuery from "../../graphql/queries/EDGES.gql";
import NodesQuery from "../../graphql/queries/NODES.gql";
import IconNamesQuery from "../../graphql/queries/ICONS.gql";
import UsersQuery from "../../graphql/queries/USERS.gql";
import InAppQuestionnairesQuery from "../../graphql/queries/IN_APP_QUESTIONNAIRES.gql";
import NotificationQuestionnaireQuery from "../../graphql/queries/NOTIFICATION_QUESTIONNAIRE.gql";
import RemoveUserFromNotificationQuestionaireMutation from "../../graphql/mutations/REMOVE_USER_FROM_NOTIFICATION_QUESTIONNAIRE.gql";
import AddUserToNotificationQuestionaireMutation from "../../graphql/mutations/ADD_USER_TO_NOTIFICATION_QUESTIONNAIRE.gql";
import CreateNodeMutation from "../../graphql/mutations/CREATE_NODE.gql";
import CreateEdgeMutation from "../../graphql/mutations/CREATE_EDGE.gql";
import DeleteNodeMutation from "../../graphql/mutations/DELETE_NODE.gql";
import DeleteEdgeMutation from "../../graphql/mutations/DELETE_EDGE.gql";
import EditNodeMutation from "../../graphql/mutations/EDIT_NODE.gql";
import EditEdgeMutation from "../../graphql/mutations/EDIT_EDGE.gql";
import ArchiveNodeMutation from "../../graphql/mutations/MARK_NODE_AS_ARCHIVED.gql";
import RestoreNodeMutation from "../../graphql/mutations/RESTORE_ARCHIVED_NODE.gql";
import { cilX, cilChevronTop, cilChevronBottom } from "@coreui/icons";
export default {
  // Icons
  X: cilX,
  top: cilChevronTop,
  bottom: cilChevronBottom,
  name: "NotificationQuestionnaire",
  props: { id: String },
  components: {
    Multiselect: () => import("vue-multiselect"),
    AddNode: () => import("./AddNode"),
    ConnectNodes: () => import("./ConnectNodes"),
    DeleteEdge: () => import("./DeleteEdge"),
    DeleteNode: () => import("./DeleteNode"),
    EditNode: () => import("./EditNode"),
    EditConnection: () => import("./EditConnection"),
    EnrolledUsersList: () => import("./EnrolledUsersList.vue"),
    ArchivedNodes: () => import("./ArchivedNodes.vue"),
  },
  data() {
    return {
      icons: [],
      activeNodes: [],
      activeEdges: [],
      users: [],
      archivedNodes: [],
      notificationQuestionnaire: null,
      selectedUserToRegister: null,
      inAppQuestionnaires: [],
      mappedNodes: [],
      mappedEdges: [],
      currentMode: "NONE",
      container: "",
      network: null,
      selectedNode: null,
      selectedEdge: null,
      iconOptions: ["Hello", "World"],
      choiceTypeOptions: ["Number", "Boolean", "Text"],
      errorMessage: "",
      errorToasts: 0,
      successToasts: 0,
      options: {
        edges: {
          arrows: {
            to: {
              enabled: true,
            },
          },
        },
        manipulation: {
          enabled: true,
          initiallyActive: true,
        },
        nodes: {
          physics: false,
        },
        interaction: {
          selectConnectedEdges: false,
          navigationButtons: true,
          keyboard: {
            enabled: true,
            bindToWindow: false,
          },
        },
      },
    };
  },
  watch: {
    mappedEdges: {
      immediate: true,
      handler(val) {
        try {
          console.log("mappedEdges watcher triggered.");
          const graph_data = {
            edges: val,
            nodes: this.mappedNodes,
          };
          this.setNetwork(graph_data);
        } catch (error) {}
      },
    },
    mappedNodes: {
      immediate: true,
      handler(val) {
        try {
          console.log("mappedNodes watcher triggered.");
          const graph_data = {
            edges: this.mappedEdges,
            nodes: val,
          };
          this.setNetwork(graph_data);
        } catch (error) {
          console.log(error);
        }
      },
    },
    activeEdges: {
      immediate: true,
      handler(val) {
        console.log("edges watcher triggered.");
        this.mappedEdges = this.mapEdges(val);
      },
    },
    activeNodes: {
      immediate: true,
      handler(val) {
        console.log("nodes watcher triggered.");
        this.mappedNodes = this.mapNodes(val);
      },
    },
  },
  apollo: {
    edges: {
      query: EdgesQuery,
      variables() {
        return {
          nqId: this.id,
        };
      },
      update(data) {
        console.log(data.nodes);
        console.log(this);
        if (data.edges && data.edges.length > 0) {
          const mEdges = data.edges.filter(
            (node) => !node.isArchived || node.isArchived === false
          );
          this.activeEdges = mEdges;
        }
      },
    },
    nodes: {
      query: NodesQuery,
      variables() {
        return {
          nqId: this.id,
        };
      },
      update(data) {
        console.log(data.nodes);
        console.log(this);
        if (data.nodes && data.nodes.length > 0) {
          const mNodes = data.nodes.filter(
            (node) => !node.isArchived || node.isArchived === false
          );
          const mArchivedNodes = data.nodes.filter(
            (node) => node.isArchived && node.isArchived === true
          );
          this.activeNodes = mNodes;
          this.archivedNodes = mArchivedNodes;
        }
      },
    },
    icons: {
      loadingKey: "loading",
      query: IconNamesQuery,
    },
    inAppQuestionnaires: {
      loadingKey: "loading",
      query: InAppQuestionnairesQuery,
    },
    notificationQuestionnaire: {
      loadingKey: "loading",
      query: NotificationQuestionnaireQuery,
      variables() {
        return {
          _id: this.id,
        };
      },
    },
    users: {
      loadingKey: "loading",
      query: UsersQuery,
    },
  },
  methods: {
    selectNode(params) {
      if (params.nodes && params.nodes.length === 1) {
        const nodeId = params.nodes[0];
        const node = this.activeNodes.find((n) => n._id === nodeId);
        if (node) {
          this.selectedNode = node;
          this.currentMode = "EDIT_NODE";
        }
      }
    },
    selectEdge(params) {
      if (params.edges && params.edges.length === 1) {
        const edgeId = params.edges[0];
        console.log("Edge id: " + edgeId);
        const edge = this.activeEdges.find((e) => e._id === edgeId);
        console.log("Edge data: " + JSON.stringify(edge));
        if (edge) {
          this.selectedEdge = edge;
          this.currentMode = "EDIT_CONNECTION";
        }
      }
    },
    setNetwork(graphData) {
      this.container = document.getElementById("mynetwork");
      if (this.container) {
        this.network = new Network(this.container, graphData, this.options);
        this.network.on("selectNode", (params) => {
          console.log("selectNode: " + JSON.stringify(params));
          this.selectNode(params);
        });
        this.network.on("selectEdge", (params) => {
          console.log("selectEdge: " + JSON.stringify(params));
          this.selectEdge(params);
        });
      }
    },
    getNodePosition(nodeId) {
      const nodePos = this.network.getPosition(nodeId);
      if (nodePos) {
        console.log("Node Pos: ", nodePos);
        return nodePos;
      }
      return null;
    },
    /**
     * Call to refetch nodes.
     */
    refetchNodes() {
      this.$apollo.queries.nodes.refetch();
    },
    /**
     * Call to refetch edges.
     */
    refetchEdges() {
      this.$apollo.queries.edges.refetch();
    },
    /**
     * Updates an existing node from the graph. Calls the
     * mutation with the arguments received from
     * the EditNode component.
     */
    editNode(node) {
      if (this.validateNodeInputs(node)) {
        const _id = node._id;
        const editedNode = node;
        editedNode.nqId = this.id;
        const position = this.getNodePosition(node._id);
        if (position) {
          editedNode.position = {
            xPos: position.x || null,
            yPos: position.y || null,
          };
        }
        this.$apollo
          .mutate({
            mutation: EditNodeMutation,
            variables: {
              _id: _id,
              node: editedNode,
            },
          })
          .then((data) => {
            console.log("Success (editNode): " + data);
            this.refetchNodes();
            this.showSuccessToast();
          })
          .catch((error) => console.log("Oh no(editNode): " + error));
      } else {
        this.showErrorToast();
      }
    },
    copyNode(node) {
      // Validate fields. If error, display toast.
      if (this.validateNodeInputs(node)) {
        const newQuestionNode = node;
        // Remove primary key/_id
        delete newQuestionNode._id;
        newQuestionNode.nqId = this.id;
        this.$apollo
          .mutate({
            mutation: CreateNodeMutation,
            variables: {
              node: newQuestionNode,
            },
          })
          .then((data) => {
            console.log("Success (addNode): " + data);
            this.refetchNodes();
            this.showSuccessToast();
          })
          .catch((error) => console.log("Oh no(addNode): " + error));
      } else {
        this.showErrorToast();
      }
    },
    /**
     * Deletes an existing node from the graph. Calls the
     * mutation with the arguments received from
     * the DeleteNode component.
     */
    deleteNode(node) {
      const nodeId = node._id;
      this.$apollo
        .mutate({
          mutation: DeleteNodeMutation,
          variables: {
            _id: nodeId,
          },
        })
        .then((data) => {
          console.log("Success (deleteNode): " + data);
          this.refetchNodes();
          this.showSuccessToast();
        })
        .catch((error) => console.log("Oh no(deleteNode): " + error));
    },
    /**
     * Archives an existing node from the graph. Calls the
     * mutation with the arguments received from
     * the ArchiveNodes component.
     */
    archiveNode(id) {
      this.$apollo
        .mutate({
          mutation: ArchiveNodeMutation,
          variables: {
            _id: id,
          },
        })
        .then((data) => {
          console.log("Success (archiveNode): " + data);
          this.refetchNodes();
          this.refetchEdges();
          this.showSuccessToast();
          this.mode = "NONE";
        })
        .catch((error) => console.log("Oh no(archiveNode): " + error));
    },
    /**
     * Restores an archived node from the graph. Calls the
     * mutation with the arguments received from
     * the ArchiveNodes component.
     */
    restoreNode(id) {
      this.$apollo
        .mutate({
          mutation: RestoreNodeMutation,
          variables: {
            _id: id,
          },
        })
        .then((data) => {
          console.log("Success (restoreNode): " + data);
          this.refetchNodes();
          this.refetchEdges();
          this.showSuccessToast();
          this.mode = "NONE";
        })
        .catch((error) => console.log("Oh no(restoreNode): " + error));
    },
    /**
     * Deletes an existing edge from the graph. Calls the
     * mutation with the arguments received from
     * the DeleteEdge component.
     */
    deleteEdge(edge) {
      const edgeId = edge._id;
      this.$apollo
        .mutate({
          mutation: DeleteEdgeMutation,
          variables: {
            _id: edgeId,
          },
        })
        .then((data) => {
          console.log("Success (deleteEdge): " + data);
          this.refetchEdges();
          this.showSuccessToast();
        })
        .catch((error) => console.log("Oh no(deleteEdge): " + error));
    },
    /**
     * Updates an existing edge from the graph. Calls the
     * mutation with the arguments received from
     * the EditConection component.
     */
    editEdge(edge) {
      console.log("editEdge received data: " + JSON.stringify(edge));
      const id = edge._id;
      this.$apollo
        .mutate({
          mutation: EditEdgeMutation,
          variables: {
            _id: id,
            edge: edge,
          },
        })
        .then((data) => {
          console.log("Success (editEdge): " + data);
          this.refetchEdges();
          this.showSuccessToast();
        })
        .catch((error) => console.log("Oh no (editEdge): " + error));
    },
    /**
     * Add a new edge to the graph. Calls the
     * muation with the arguments received from
     * the ConnectNodes component.
     */
    addEdge(edge) {
      console.log("addEdge called with arg: " + JSON.stringify(edge));
      if (this.validateEdgeInputs(edge)) {
        const newEdge = edge;
        newEdge.nqId = this.id;
        this.$apollo
          .mutate({
            mutation: CreateEdgeMutation,
            variables: {
              edge: newEdge,
            },
          })
          .then((data) => {
            console.log("Success (addEdge): " + data);
            this.refetchEdges();
            this.showSuccessToast();
          })
          .catch((error) => console.log("Oh no(addEdge): " + error));
      } else {
        this.showErrorToast();
      }
    },
    /**
     * Add a new node to the graph. Calls the
     * muation with the arguments received from
     * the AddNode component.
     */
    addNode(node) {
      // Validate fields. If error, display toast.
      if (this.validateNodeInputs(node)) {
        const newQuestionNode = node;
        newQuestionNode.nqId = this.id;
        this.$apollo
          .mutate({
            mutation: CreateNodeMutation,
            variables: {
              node: newQuestionNode,
            },
          })
          .then((data) => {
            console.log("Success (addNode): " + data);
            this.refetchNodes();
            this.showSuccessToast();
          })
          .catch((error) => console.log("Oh no(addNode): " + error));
      } else {
        this.showErrorToast();
      }
    },
    /**
     * Maps the nodes to data presentable
     * by visjs.
     */
    mapNodes(data) {
      console.log(JSON.stringify(data));
      const mappedNodes = [];
      for (const node of data) {
        const newNode = {
          id: node._id,
          label: node.nodeLabel,
          data: node.data,
        };
        if (node.isSourceNode) {
          newNode.color = "orange";
          newNode.font = {
            color: "white",
          };
        }
        if (node.position) {
          if (node.position.xPos && node.position.yPos) {
            newNode.x = node.position.xPos;
            newNode.y = node.position.yPos;
          }
        }
        mappedNodes.push(newNode);
      }
      return mappedNodes;
    },
    /**
     * Maps the edges to data presentable
     * by visjs.
     */
    mapEdges(data) {
      console.log(JSON.stringify(data));
      const mappedEdges = [];
      for (const edge of data) {
        const newEdge = {
          _id: edge._id,
          from: edge.source,
          to: edge.target,
          label: edge.edgeLabel,
          id: edge._id,
          data: {
            condition: edge.condition,
          },
        };
        mappedEdges.push(newEdge);
      }
      return mappedEdges;
    },
    /**
     * Switches the current mode for the
     * different node/edge operations.
     */
    switchMode(mode) {
      this.currentMode = mode;
      if (mode === "NONE") {
        this.network.selectEdges([]);
        this.network.selectNodes([]);
      }
    },
    /**
     * Shows an error toast with the string
     * contained by this.errorToasts.
     */
    showErrorToast() {
      this.errorToasts = this.errorToasts + 1;
    },
    /**
     * Shows a success toast.
     */
    showSuccessToast() {
      this.successToasts = this.successToasts + 1;
    },
    /**
     * Validates the node form data.
     * @return True if the form data is valid, false otherwise.
     */
    validateNodeInputs(node) {
      if (!node.data) {
        this.errorMessage =
          "There was an error submitting the data for the new node, try again later.";
        return false;
      }
      if (!node.nodeLabel) {
        this.errorMessage = "A label is required for the node.";
        return false;
      }
      if (!node.data.type) {
        this.errorMessage =
          "A type must be defined in order to create a new node.";
        return false;
      }
      if (node.data.type === "question") {
        if (!node.data.question) {
          this.errorMessage =
            "The submitted data did not contain any question data.";
          return false;
        }
        if (
          !node.data.question.questionText ||
          node.data.question.questionText === ""
        ) {
          this.errorMessage =
            "The submitted question did not contain any question text.";
          return false;
        }
        if (
          !node.data.question.questionChoices ||
          node.data.question.questionChoices.length === 0
        ) {
          this.errorMessage =
            "The submitted question did not contain any question choices.";
          return false;
        }
        if (
          node.data.question.questionChoices ||
          node.data.question.questionChoices.length > 0
        ) {
          for (const choice of node.data.question.questionChoices) {
            if (!choice.choiceIconId) {
              this.errorMessage =
                "One or more icons were missing an internal identifer. Try removing and adding the choices for the question.";
              return false;
            }
          }
        }
      }
      if (node.data.type === "appquestionnaire") {
        if (!node.data.appquestionnaire || !node.data.appquestionnaire.qid) {
          this.errorMessage = "A valid in-app questionnaire must be submitted.";
          return false;
        }
      }
      return true;
    },
    /**
     * Validates the edge form data.
     * @return True if the form data is valid, false otherwise.
     */
    validateEdgeInputs(edge) {
      if (!edge.edgeLabel) {
        this.errorMessage = "A label is required for the relation.";
        return false;
      }
      if (!edge.condition) {
        this.errorMessage =
          "There was an error submitting the data for the new connection, try again later.";
        return false;
      }
      if (!edge.source) {
        this.errorMessage = "A source node must be declared.";
        return false;
      }
      if (!edge.target) {
        this.errorMessage = "A target node must be declared.";
        return false;
      }
      if (!edge.condition.condition) {
        this.errorMessage = "A condition is required.";
        return false;
      }
      if (!edge.condition.conditionValue) {
        this.errorMessage = "A condition value is required.";
        return false;
      }
      if (!edge.condition.conditionType) {
        this.errorMessage = "A condition type is required.";
        return false;
      }
      return true;
    },
    addUserToNotificationQuestionnaire() {
      if (this.selectedUserToRegister && this.selectedUserToRegister._id) {
        const userId = this.selectedUserToRegister._id;
        const nqId = this.id;
        this.$apollo.mutate({
          mutation: AddUserToNotificationQuestionaireMutation,
          variables: {
            _id: nqId,
            userId: userId,
          },
          refetchQueries: [
            {
              query: NotificationQuestionnaireQuery,
              variables: {
                _id: nqId,
              },
            },
          ],
        });
      }
    },
    removeUserFromNotificationQuestionnaire(user) {
      if (user && user._id) {
        const userId = user._id;
        const nqId = this.id;
        this.$apollo.mutate({
          mutation: RemoveUserFromNotificationQuestionaireMutation,
          variables: {
            _id: nqId,
            userId: userId,
          },
          refetchQueries: [
            {
              query: NotificationQuestionnaireQuery,
              variables: {
                _id: nqId,
              },
            },
          ],
        });
      }
    },
  },
};
</script>

<style type="text/css">
#mynetwork {
  width: 100%;
  height: 600px;
  border: 1px solid lightgray;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
