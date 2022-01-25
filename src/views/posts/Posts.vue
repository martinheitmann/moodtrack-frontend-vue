<template>
  <CCard>
    <CCardHeader>
      Posts
    </CCardHeader>
    <CCardBody>
      <CCol v-if="!postsLoading">
        <PostModal
          :isVisible="showModal"
          :onClose="closeNewPostModal"
          :onSubmit="createPost"
          :onEdit="editPost"
          :editMode="editMode"
          :postData="postData"
          :availableIcons="icons"
        />
        <CRow class="mb-4">
          <CCol>
            <CButton
              v-if="!createPostLoading"
              color="info"
              v-on:click="openNewPostModal"
              >New Post
            </CButton>
            <CSpinner
              v-if="createPostLoading"
              color="primary"
              style="width:3rem;height:3rem;"
            />
          </CCol>
        </CRow>
        <CRow>
          <PostsList
            :posts="posts"
            :onEdit="openEditPostModal"
            :onDelete="deletePost"
          />
        </CRow>
      </CCol>
      <CCol v-if="postsLoading">
        <CSpinner color="primary" style="width:3rem;height:3rem;" />
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import PostsQuery from "../../graphql/queries/POSTS.gql";
import IconsQuery from "../../graphql/queries/ICONS.gql";
import CreatePostMutation from "../../graphql/mutations/CREATE_POST.gql";
import EditPostMutation from "../../graphql/mutations/EDIT_POST.gql";
import DeletePostMutation from "../../graphql/mutations/DELETE_POST.gql";
export default {
  components: {
    PostsList: () => import("./PostsList.vue"),
    PostModal: () => import("./PostModal.vue"),
  },
  data() {
    return {
      showModal: false,
      createPostLoading: 0,
      postsLoading: 0,
      iconsLoading: 0,
      posts: [],
      icons: [],
      editMode: null,
      postData: null,
    };
  },
  methods: {
    openEditPostModal(postId) {
      console.log("openEditPostModal: " + postId);
      const post = this.posts.find((p) => p._id === postId);
      console.log("openEditPostModal post: " + JSON.stringify(post));
      if (post) {
        this.postData = {
          id: post._id,
          body: post.body || "",
          title: post.title || "",
          pinned: post.pinned || false,
        };
        this.editMode = true;
        this.showModal = true;
      }
    },
    closeEditPostModal() {
      this.editMode = false;
      this.showModal = false;
      this.postData = null;
    },
    openNewPostModal() {
      this.postData = null;
      this.editMode = false;
      this.showModal = true;
    },
    closeNewPostModal() {
      this.editMode = null;
      this.showModal = false;
    },
    createPost(title, body, pinned) {
      console.log(title, body);
      const postData = {
        title: title,
        body: body,
        pinned: pinned,
      };
      this.closeNewPostModal();
      this.createPostMutation(postData);
    },
    editPost(id, title, body, isPinned) {
      if (id) {
        const postData = {
          title: title,
          body: body,
          pinned: isPinned,
        };
        this.editPostMutation(id, postData);
        this.closeEditPostModal();
      }
    },
    deletePost(id) {
      this.deletePostMutation(id);
    },
    createPostMutation(postData) {
      const _this = this;
      _this.createPostLoading = true;
      this.$apollo
        .mutate({
          mutation: CreatePostMutation,
          variables: {
            post: postData,
          },
          loadingKey: "createPostLoading",
          refetchQueries: [
            {
              query: PostsQuery,
              loadingKey: "postsLoading",
            },
          ],
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          _this.createPostLoading = 0;
        });
    },
    editPostMutation(id, postData) {
      this.$apollo
        .mutate({
          mutation: EditPostMutation,
          variables: {
            _id: id,
            post: postData,
          },
          refetchQueries: [
            {
              query: PostsQuery,
              loadingKey: "postsLoading",
            },
          ],
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    deletePostMutation(id) {
      this.$apollo
        .mutate({
          mutation: DeletePostMutation,
          variables: {
            _id: id,
          },
          refetchQueries: [
            {
              query: PostsQuery,
              loadingKey: "postsLoading",
            },
          ],
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  apollo: {
    posts: {
      query: PostsQuery,
      loadingKey: "postsLoading",
    },
    icons: {
      query: IconsQuery,
      loadingKey: "iconsLoading",
    },
  },
};
</script>
