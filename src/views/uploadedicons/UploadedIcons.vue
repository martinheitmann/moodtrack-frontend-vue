<template>
  <CCard w-100>
    <CCardHeader>
      <CRow align-horizontal="between" align-vertical="center">
        <CCol xs class="ml-4">
          <h4>Uploaded Icons</h4>
        </CCol>
      </CRow>
    </CCardHeader>
    <CCardBody>
      <CCol>
        <CRow>
          <CCol xs>
            <CContainer>
              <form>
                <div class="form-group">
                  <label for="exampleFormControlFile1">Upload a file</label>
                  <input
                    type="file"
                    class="form-control-file"
                    id="formControlFile"
                    ref="fileupload"
                    v-on:change="onFileSelected"
                  />
                </div>
              </form>
            </CContainer>
          </CCol>
        </CRow>
        <CRow v-if="selectedFile">
          <CCol xs>
            <CButton :color="'info'" class="m-2" v-on:click="onUpload()">
              Submit
            </CButton>
          </CCol>
          <CCol xs>
            <CButton :color="'danger'" class="m-2" v-on:click="onFileCleard()">
              Clear
            </CButton>
          </CCol>
        </CRow>
        <CRow v-if="uploadErrorMessage" class="mt-1">
          <CCol xs class="mr-2">
            <span style="color:red;">{{ uploadErrorMessage }}</span>
          </CCol>
          <CCol xs>
            <CButtonClose
              buttonClasses="text-danger close"
              v-on:click="uploadErrorMessage = null"
            />
          </CCol>
        </CRow>
        <CRow class="mt-2" align-vertical="center">
          <CCol>
            <h5>Available icons</h5>
          </CCol>
          <CCol xs>
            <Multiselect
              v-model="dropDownOption"
              :options="dropdownOptions"
              placeholder="Sort by"
              label="name"
              track-by="name"
              @select="onDropdownSelected"
            >
            </Multiselect>
          </CCol>
        </CRow>
        <CRow>
          <CCard v-for="(item, index) in icons" v-bind:key="index" class="m-2">
            <CCardBody>
              <CCol xs>
                <CRow align-horizontal="end">
                  <CCol xs>
                    <CButton
                      :color="'danger'"
                      :size="'sm'"
                      class="m-2"
                      v-on:click="onDeleteIcon(item._id)"
                    >
                      <CIcon :content="$options.X" />
                    </CButton>
                  </CCol>
                </CRow>
                <CRow align-horizontal="center">
                  <CCol xs v-if="getFileExtension(item.filename) === 'png'">
                    <!--<img :src="`data:image/png;base64,${item.data}`" />-->
                    <CImg
                      :src="`data:image/png;base64,${item.data}`"
                      width="48"
                      height="48"
                    />
                  </CCol>
                </CRow>
                <CRow align-horizontal="center">
                  <CCol xs v-if="getFileExtension(item.filename) === 'svg'">
                    <!--<img :src="`data:image/png;base64,${item.data}`" />-->
                    <CImg
                      :src="`data:image/svg+xml;base64,${item.data}`"
                      width="48"
                      height="48"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    {{ item.filename }}
                  </CCol>
                </CRow>
              </CCol>
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </CCardBody>
  </CCard>
</template>

<script>
import Multiselect from "vue-multiselect";
import { cilX } from "@coreui/icons";
import uploadIconMutation from "../../graphql/mutations/UPLOAD_ICON.gql";
import deleteIconMutation from "../../graphql/mutations/DELETE_ICON.gql";
import findIconQuery from "../../graphql/queries/ICON_BY_NAME.gql";
import iconsQuery from "../../graphql/queries/ICONS.gql";
export default {
  name: "UploadedIcons",
  components: { Multiselect },
  X: cilX,
  data() {
    return {
      selectedFile: null,
      selectedFileName: null,
      uploadErrorMessage: null,
      uploadLoading: true,
      icons: [],
      dropDownOption: null,
      dropdownOptions: [
        { name: "Name", value: "NAME" },
        { name: "Upload date", value: "UPLOAD_DATE" },
      ],
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = event.target.files[0].name;
    },
    onFileCleard() {
      this.selectedFile = null;
      this.selectedFileName = null;
      this.$refs.fileupload.value = null;
    },
    onUpload() {
      const _this = this;
      if (this.selectedFile && this.selectedFileName) {
        this.checkIfIconExists(this.selectedFileName)
          .then((success) => {
            if (!success.data.iconByName) {
              _this.$apollo
                .mutate({
                  mutation: uploadIconMutation,
                  variables: {
                    file: _this.selectedFile,
                  },
                  refetchQueries: [
                    {
                      query: iconsQuery,
                    },
                  ],
                  context: { hasUpload: true },
                })
                .then((data) => {
                  console.log("success!");
                  _this.uploadErrorMessage = null;
                  _this.onFileCleard();
                })
                .catch((error) => {
                  console.log("Oh no! Error: " + error);
                });
            } else {
              _this.uploadErrorMessage =
                "A file with that name already exists in your library.";
            }
          })
          .catch((error) => {
            console.log("Oh no! Error: " + error);
          });
      }
    },
    onDeleteIcon(id) {
      this.$apollo
        .mutate({
          mutation: deleteIconMutation,
          variables: {
            _id: id,
          },
          refetchQueries: [
            {
              query: iconsQuery,
            },
          ],
        })
        .then((data) => {
          console.log("success!");
        })
        .catch((error) => {
          console.log("Oh no! Error: " + error);
        });
    },
    getFileExtension(fname) {
      return fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2);
    },
    sortByString() {
      const files = this.icons;
      files.sort(function(a, b) {
        if (a.filename < b.filename) {
          return -1;
        }
        if (a.filename > b.filename) {
          return 1;
        }
        this.icons = files;
      });
    },
    sortByDate() {
      const files = this.icons;
      files.sort(function(a, b) {
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      });
      this.icons = files;
    },
    onDropdownSelected(option, id) {
      console.log(JSON.stringify(option));
      if (option.value === "UPLOAD_DATE") {
        this.sortByDate();
      }
      if (option.value === "NAME") {
        this.sortByString();
      }
    },
    checkIfIconExists(filename) {
      const _this = this;
      return new Promise((resolve, reject) => {
        _this.$apollo
          .query({
            query: findIconQuery,
            variables: {
              filename: filename,
            },
          })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  apollo: {
    icons: {
      loadingKey: "loading",
      query: iconsQuery,
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
