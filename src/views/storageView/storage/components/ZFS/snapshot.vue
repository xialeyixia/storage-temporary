<template>
  <div class="pool">
    <div class="buttongroups">
      <el-button color="#dbdbdb" size="small" @click="importSnapShot">{{
        $t('control.import')
      }}</el-button>
    </div>
    <div class="maincontents">
      <el-table
        :data="snapshotData"
        v-loading="spinning"
        table-layout="auto"
        header-cell-class-name="table-header-row"
        element-loading-text="Loading..."
      >
        <el-table-column
          :label="$t('common.name')"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.dataset')"
          prop="dsname"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.availsize')"
          prop="avaliable"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.usedsize')"
          prop="used"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column :label="$t('table.operate')">
          <template #default="scope">
            <el-dropdown trigger="click" @command="moreOperate">
              <el-button size="small" link>
                {{ $t('common.more') }}
                <el-icon style="margin-left: 3px"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :command="{ event: rollbackSnapShot, row: scope.row }"
                    >{{ $t('control.rollback') }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ event: editSnapShot, row: scope.row }"
                    >{{ $t('control.edit') }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ event: cloneDataSet, row: scope.row }"
                    >{{ $t('control.clone') }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ event: exportSnapShot, row: scope.row }"
                    >{{ $t('control.export') }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ event: removeSnapShot, row: scope.row }"
                    >{{ $t('control.delete') }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 导入 -->
    <re-dialog v-model="imporSnapShotVisible" :width="430">
      <template #title>
        {{ $t('control.import') }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="imporSnapShotVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureImportSnapShot"
            :loading="sureLoading"
            :disabled="sureLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="imporSnapShotForm"
        ref="imporSnapShotForm"
        label-width="80px"
        :rules="imporSnapShotRules"
        label-position="left"
      >
        <el-form-item
          :label="$t('storage.parentdataset')"
          style="width: 100%"
          prop="parentfs"
        >
          <el-select v-model="imporSnapShotForm.parentfs" style="width: 100%">
            <el-option
              :value="item.name"
              v-for="item in datasetList"
              :key="item.name"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('storage.dataset')"
          style="width: 100%"
          prop="dsname"
        >
          <el-input
            v-model.trim="imporSnapShotForm.dsname"
            :maxlength="256"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('storage.fname')"
          style="width: 100%"
          prop="filename"
        >
          <el-input
            v-model.trim="imporSnapShotForm.filename"
            :maxlength="256"
          ></el-input>
        </el-form-item>
      </el-form>
    </re-dialog>
    <!-- 编辑 -->
    <re-dialog v-model="editSnapShotVisible" :width="430">
      <template #title>
        {{ $t('control.edit') + ' ( ' + editSnapShotForm.oldname + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="editSnapShotVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureEditSnapShot"
            :loading="sureLoading"
            :disabled="sureLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="editSnapShotForm"
        ref="editSnapShotForm"
        label-width="80px"
        :rules="editSnapShotRules"
        label-position="left"
      >
        <el-form-item
          :label="$t('common.name')"
          style="width: 100%"
          prop="newname"
        >
          <el-input
            v-model.trim="editSnapShotForm.newname"
            :maxlength="256"
          ></el-input>
        </el-form-item>
      </el-form>
    </re-dialog>
    <!-- 导出 -->
    <re-dialog v-model="exportSnapShotVisible" :width="430">
      <template #title>
        {{ $t('control.export') + ' ( ' + exportSnapShotForm.snapname + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="exportSnapShotVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureExportSnapShot"
            :loading="sureLoading"
            :disabled="sureLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="exportSnapShotForm"
        ref="exportSnapShotForm"
        label-width="80px"
        :rules="exportSnapShotRules"
        label-position="left"
      >
        <el-form-item
          :label="$t('storage.fname')"
          style="width: 100%"
          prop="filename"
        >
          <el-input
            v-model.trim="exportSnapShotForm.filename"
            :maxlength="256"
          ></el-input>
        </el-form-item>
      </el-form>
    </re-dialog>
    <!-- 克隆 -->
    <re-dialog v-model="cloneDataSetVisible" :width="430">
      <template #title>
        {{ $t('control.clone') + ' ( ' + cloneDataSetForm.snapname + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="cloneDataSetVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureCloneDataSet"
            :loading="sureLoading"
            :disabled="sureLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="cloneDataSetForm"
        ref="cloneDataSetForm"
        label-width="80px"
        :rules="cloneDataSetRules"
        label-position="left"
      >
        <el-form-item
          :label="$t('storage.parentdataset')"
          style="width: 100%"
          prop="newparentfs"
        >
          <el-select v-model="cloneDataSetForm.newparentfs" style="width: 100%">
            <el-option
              :value="item.name"
              v-for="item in datasetList"
              :key="item.name"
              :label="item.name"
              :disabled="!(item.sourcepool == currentRow.sourcepool)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('storage.dataset')"
          style="width: 100%"
          prop="newdsname"
        >
          <el-input
            v-model.trim="cloneDataSetForm.newdsname"
            :maxlength="256"
          ></el-input>
        </el-form-item>
      </el-form>
    </re-dialog>
    <re-dialog v-model="progressVisible" :width="430">
      <template #title>
        {{ $t('control.export') + ' ( ' + exportSnapShotForm.snapname + ' )' }}
      </template>
      <el-progress
        :percentage="progress"
        :stroke-width="15"
        status="success"
        striped
        striped-flow
        :duration="duration"
      />
    </re-dialog>
  </div>
</template>

<script>
import { checkIDName, checkPath, getProgress } from '@/assets/js/setting.js'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
export default {
  name: 'SnapShot',
  components: {
    ArrowDown,
  },
  data() {
    return {
      spinning: false,
      sureLoading: false,
      snapshotData: [],
      datasetList: [],
      currentRow: null,
      imporSnapShotVisible: false,
      imporSnapShotForm: {
        parentfs: null,
        dsname: null,
        filename: null,
      },
      imporSnapShotRules: {
        parentfs: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur',
          },
        ],
        filename: [
          {
            required: true,
            validator: checkPath,
            trigger: 'blur',
          },
        ],
        dsname: [{ required: true, validator: checkIDName, trigger: 'blur' }],
      },
      editSnapShotVisible: false,
      editSnapShotForm: {
        oldname: null,
        dsname: null,
        newname: null,
      },
      editSnapShotRules: {
        newname: [{ required: true, validator: checkIDName, trigger: 'blur' }],
      },
      exportSnapShotVisible: false,
      exportSnapShotForm: {
        snapname: null,
        dsname: null,
        filename: null,
      },
      exportSnapShotRules: {
        filename: [{ required: true, validator: checkPath, trigger: 'blur' }],
      },
      cloneDataSetVisible: false,
      cloneDataSetForm: {
        snapname: null,
        dsname: null,
        newparentfs: null,
        newdsname: null,
      },
      cloneDataSetRules: {
        newparentfs: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur',
          },
        ],
        newdsname: [
          { required: true, validator: checkIDName, trigger: 'blur' },
        ],
      },
      exportedFilesList: [],
      buf: null,
      progressVisible: false,
      progress: 0,
    }
  },
  mounted() {
    this.getDataSetSnapShotData()
  },
  watch: {
    '$route.query.ip'(val) {
      if (val) this.getDataSetSnapShotData()
    },
  },
  methods: {
    getDatasetList() {
      this.$api
        .get(
          '/webapp/get_zfs_dataset?remote_ip=' + this.$route.query.ip,
          {},
          true,
        )
        .then((res) => {
          if (res.state == 0) {
            this.datasetList = res.params.list.filter((item) => {
              return item.type == 'filesystem'
            })
          } else {
            this.$message.warning({
              message: (
                <div class="warning-message">
                  {res.message ? res.message : this.$t('common.errmsg')}
                </div>
              ),
            })
          }
        })
    },
    getDataSetSnapShotData() {
      this.spinning = true
      this.$api
        .get(
          '/webapp/get_zfs_dataset_snapshot?remote_ip=' + this.$route.query.ip,
          {},
          true,
        )
        .then((res) => {
          this.spinning = false
          if (res.state == 0) {
            this.snapshotData = res.params.list
          } else {
            this.$message.warning({
              message: (
                <div class="warning-message">
                  {res.message ? res.message : this.$t('common.errmsg')}
                </div>
              ),
            })
          }
        })
        .catch(() => {
          this.spinning = false
        })
    },
    importSnapShot() {
      this.imporSnapShotVisible = true
      this.imporSnapShotForm = {
        parentfs: null,
        dsname: null,
        filename: null,
      }
      this.$refs.imporSnapShotForm &&
        this.$refs.imporSnapShotForm.clearValidate()
      this.getexportfile()
    },
    sureImportSnapShot() {
      this.$refs.imporSnapShotForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/import_zfs_dataset_snapshot?remote_ip=' +
                this.$route.query.ip,
              this.imporSnapShotForm,
              true,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.imporSnapShotVisible = false
                this.getDataSetSnapShotData()
                this.$message.success(res.message)
              } else {
                this.$message.warning({
                  message: (
                    <div class="warning-message">
                      {res.message ? res.message : this.$t('common.errmsg')}
                    </div>
                  ),
                })
              }
            })
            .catch(() => {
              this.$message.warning(this.$t('common.errmsg'))
              this.sureLoading = false
            })
        }
      })
    },
    removeSnapShot(row) {
      this.$messageBox
        .confirm(
          this.$t('storage.deldssnapshot') + ' - ' + row.name,
          this.$t('common.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          },
        )
        .then(() => {
          this.spinning = true
          this.$api
            .deletes(
              '/webapp/delete_zfs_dataset_snapshot?remote_ip=' +
                this.$route.query.ip,
              {
                name: row.name,
                dsname: row.dsname,
              },
              true,
            )
            .then((res) => {
              this.spinning = false
              if (res.state == 0) {
                this.getDataSetSnapShotData()
                this.$message.success(res.message)
              } else {
                this.$message.warning({
                  message: (
                    <div class="warning-message">
                      {res.message ? res.message : this.$t('common.errmsg')}
                    </div>
                  ),
                })
              }
            })
            .catch(() => {
              this.$message.warning(this.$t('common.errmsg'))
              this.spinning = false
            })
        })
    },
    rollbackSnapShot(row) {
      this.spinning = true
      this.$api
        .post(
          '/webapp/rollback_zfs_dataset_snapshot?remote_ip=' +
            this.$route.query.ip,
          {
            name: row.name,
            dsname: row.dsname,
          },
          true,
        )
        .then((res) => {
          this.spinning = false
          if (res.state == 0) {
            this.getDataSetSnapShotData()
            this.$message.success(res.message)
          } else {
            this.$message.warning({
              message: (
                <div class="warning-message">
                  {res.message ? res.message : this.$t('common.errmsg')}
                </div>
              ),
            })
          }
        })
        .catch(() => {
          this.$message.warning(this.$t('common.errmsg'))
          this.spinning = false
        })
    },
    editSnapShot(row) {
      this.editSnapShotForm = {
        oldname: row.name,
        dsname: row.dsname,
        newname: row.name,
      }
      this.editSnapShotVisible = true
      this.$refs.editSnapShotForm && this.$refs.editSnapShotForm.clearValidate()
    },
    sureEditSnapShot() {
      this.$refs.editSnapShotForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/edit_zfs_dataset_snapshot?remote_ip=' +
                this.$route.query.ip,
              this.editSnapShotForm,
              true,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.editSnapShotVisible = false
                this.getDataSetSnapShotData()
                this.$message.success(res.message)
              } else {
                this.$message.warning({
                  message: (
                    <div class="warning-message">
                      {res.message ? res.message : this.$t('common.errmsg')}
                    </div>
                  ),
                })
              }
            })
            .catch(() => {
              this.$message.warning(this.$t('common.errmsg'))
              this.sureLoading = false
            })
        }
      })
    },
    exportSnapShot(row) {
      this.exportSnapShotVisible = true
      this.exportSnapShotForm = {
        snapname: row.name,
        dsname: row.dsname,
        filename: null,
      }
      this.$refs.exportSnapShotForm &&
        this.$refs.exportSnapShotForm.clearValidate()
    },
    sureExportSnapShot() {
      this.$refs.exportSnapShotForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/export_zfs_dataset_snapshot?remote_ip=' +
                this.$route.query.ip,
              this.exportSnapShotForm,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
              } else if (res.state === 1001) {
                this.buf = setInterval(() => {
                  this.$api
                    .get('/webapp/get_buf', {
                      method: res.task,
                      method_uuid: res.uuid,
                    })
                    .then((ress) => {
                      if (ress.state === 1001) {
                        this.sureLoading = false
                        this.exportSnapShotVisible = false
                        this.progressVisible = true
                        let arr = ress.message.split('is')
                        let send = arr[1].split('\n')[0]
                        let total = arr[2].split('\n')[0]
                        this.progress = getProgress(send, total) * 100
                      } else if (ress.state === 0) {
                        clearInterval(this.buf)
                        this.buf = null
                        this.sureLoading = false
                        this.exportSnapShotVisible = false
                        this.progress = 100
                        this.progressVisible = false
                        this.getDataSetSnapShotData()
                        this.$message.success(ress.message)
                      } else {
                        clearInterval(this.buf)
                        this.buf = null
                        this.$message.warning({
                          message: (
                            <div class="warning-message">
                              {ress.message
                                ? ress.message
                                : this.$t('common.errmsg')}
                            </div>
                          ),
                        })
                      }
                    })
                    .catch(() => {
                      clearInterval(this.buf)
                      this.buf = null
                      this.sureLoading = false
                      this.exportSnapShotVisible = false
                      this.$message.warning({
                        message: (
                          <div class="warning-message">
                            {ress.message
                              ? ress.message
                              : this.$t('common.errmsg')}
                          </div>
                        ),
                      })
                    })
                }, 500)
              } else {
                this.sureLoading = false
                this.$message.warning({
                  message: (
                    <div class="warning-message">
                      {res.message ? res.message : this.$t('common.errmsg')}
                    </div>
                  ),
                })
              }
            })
            .catch(() => {
              this.$message.warning(this.$t('common.errmsg'))
              this.sureLoading = false
            })
        }
      })
    },
    cloneDataSet(row) {
      this.currentRow = row
      this.cloneDataSetVisible = true
      this.cloneDataSetForm = {
        snapname: row.name,
        dsname: row.dsname,
        newparentfs: null,
        newdsname: null,
      }
      this.getDatasetList()
      this.$refs.cloneDataSetForm && this.$refs.cloneDataSetForm.clearValidate()
    },
    sureCloneDataSet() {
      this.$refs.cloneDataSetForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/clone_zfs_dataset?remote_ip=' + this.$route.query.ip,
              this.cloneDataSetForm,
              true,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.cloneDataSetVisible = false
                this.getDataSetSnapShotData()
                this.$message.success(res.message)
              } else {
                this.$message.warning({
                  message: (
                    <div class="warning-message">
                      {res.message ? res.message : this.$t('common.errmsg')}
                    </div>
                  ),
                })
              }
            })
            .catch(() => {
              this.$message.warning(this.$t('common.errmsg'))
              this.sureLoading = false
            })
        }
      })
    },
    moreOperate(com) {
      com.event(com.row)
    },
    getexportfile() {
      this.$api
        .get(
          '/webapp/get_zfs_dataset_snapshot_export_file?remote_ip=' +
            this.$route.query.ip,
          {},
          true,
        )
        .then((res) => {
          this.exportedFilesList = []
          if (res.state == 0) {
            this.exportedFilesList = res.params.list
            this.getDatasetList()
          } else {
            this.$message.warning({
              message: (
                <div class="warning-message">
                  {res.message ? res.message : this.$t('common.errmsg')}
                </div>
              ),
            })
          }
        })
        .catch(() => {
          this.$message.warning(this.$t('common.errmsg'))
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.pool {
  text-align: left;
}
.el-table--fit {
  border: 1px solid;
}
.buttongroups {
  padding: 0px 10px 8px 10px;
  box-sizing: border-box;
}
.maincontents {
  overflow: auto;
  height: calc(100% - 45px);
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
