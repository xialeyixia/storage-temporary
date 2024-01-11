<template>
  <div class="dataset-view">
    <el-table
      :data="datasetData"
      table-layout="auto"
      header-cell-class-name="table-header-row"
    >
      <el-table-column
        :label="$t('common.name')"
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
      <el-table-column
        :label="$t('storage.deduplication')"
        prop="deduplication"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :label="$t('storage.compression')"
        prop="compression"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :label="$t('storage.compressratio')"
        prop="compressratio"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :label="$t('common.type')"
        prop="type"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :label="$t('storage.volblocksize')"
        prop="volblocksize"
      />
      <el-table-column label="文件块大小" prop="recordsize" />
      <el-table-column
        :label="$t('storage.mounton')"
        prop="mounton"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column :label="$t('storage.occupiedstatus')">
        <template #default="scope">
          <div>
            {{ scope.row.occupyname }}
          </div>
          <div>
            {{ scope.row.occupycontent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('storage.size')">
        <template #default="scope">
          <div>
            {{
              scope.row.type === 'volume' ? scope.row.volsize : scope.row.quota
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="精简卷">
        <template #default="scope">
          <div>
            {{
              scope.row.type === 'volume'
                ? scope.row.isthinvol
                  ? '是'
                  : '否'
                : '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operate')" fixed="right">
        <template #default="scope">
          <el-dropdown trigger="click" @command="moreOperate">
            <el-button size="small" link>
              {{ $t('common.more') }}
              <el-icon style="margin-left: 3px"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :command="{ event: createSnapShot, row: scope.row }"
                  >{{ $t('storage.createSnapShot') }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ event: editDataSet, row: scope.row }"
                  >{{ $t('storage.editdataset') }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ event: setalgorithm, row: scope.row }"
                  >{{ $t('storage.setalgorithm') }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ event: resizeZfs, row: scope.row }"
                  >{{ $t('storage.resizeZfs') }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="scope.row.type === 'filesystem'"
                  :command="{ event: createDataset, row: scope.row }"
                  >{{ $t('storage.createdataset') }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="scope.row.type === 'filesystem'"
                  :command="{ event: changeRecord, row: scope.row }"
                  >修改文件块大小</el-dropdown-item
                >
                <el-dropdown-item
                  :disabled="scope.row.occupyname !== null"
                  :command="{ event: deleteDataSet, row: scope.row }"
                  >{{ $t('control.delete') }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 创建快照 -->
    <re-dialog v-model="snapshotVisible" :width="430">
      <template #title>
        {{
          $t('storage.createSnapShot') +
          ' ( ' +
          createSnapShotForm.dsname +
          ' )'
        }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="snapshotVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureCreateSnapShot"
            :loading="sureLoading"
            :disabled="sureLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="createSnapShotForm"
        ref="createSnapShotForm"
        label-width="80px"
        :rules="snapShotRules"
        label-position="left"
      >
        <el-form-item
          :label="$t('common.name')"
          style="width: 100%"
          prop="name"
        >
          <el-input
            v-model.trim="createSnapShotForm.name"
            :maxlength="128"
          ></el-input>
        </el-form-item>
      </el-form>
    </re-dialog>
    <!-- 创建数据集 -->
    <re-dialog v-model="createDataSetVisible" :width="350">
      <template #title>
        {{
          $t('storage.createdataset') +
          ' ( ' +
          createDataSetForm.parentfs +
          ' )'
        }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="createDataSetVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureCreateDataset"
            :loading="sureLoading"
            :disabled="disabled"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="createDataSetForm"
        ref="createDataSetForm"
        label-width="100px"
        :rules="datasetRules"
        label-position="left"
      >
        <el-form-item
          :label="$t('common.name')"
          style="width: 100%"
          prop="name"
        >
          <el-input
            v-model.trim="createDataSetForm.name"
            :maxlength="128"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('storage.size')"
          style="width: 100%"
          prop="size"
        >
          <InputSelect v-model="createDataSetForm.size"></InputSelect>
        </el-form-item>
        <el-form-item
          :label="$t('common.type')"
          style="width: 100%"
          prop="type"
        >
          <el-select v-model="createDataSetForm.type" style="width: 100%">
            <el-option value="volume" :label="$t('storage.volume')"></el-option>
            <el-option
              value="filesystem"
              :label="$t('storage.filesystem')"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="createDataSetForm.type === 'volume'"
          :label="$t('storage.volblocksize')"
          style="width: 100%"
          prop="volblocksize"
        >
          <InputSelect
            v-model="createDataSetForm.volblocksize"
            selectType="volume"
          ></InputSelect>
        </el-form-item>
        <el-form-item
          v-show="createDataSetForm.type === 'volume'"
          :label="$t('common.thinprovision')"
          style="width: 100%"
          prop="thinprovision"
        >
          <el-select
            v-model="createDataSetForm.thinprovision"
            style="width: 100%"
          >
            <el-option :value="0" :label="$t('common.yes')"></el-option>
            <el-option :value="-1" :label="$t('common.no')"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </re-dialog>
    <!-- 设置算法 -->
    <re-dialog v-model="setAlgorithmVisible" :width="350">
      <template #title>
        {{ $t('storage.setalgorithm') + ' ( ' + algorithmForm.name + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="setAlgorithmVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureSetAlgorithm"
            :loading="sureLoading"
            :disabled="sureLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="algorithmForm"
        ref="algorithmForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          :label="$t('storage.deduplication')"
          style="width: 100%"
          prop="deduplication"
        >
          <el-select v-model="algorithmForm.deduplication" style="width: 100%">
            <el-option
              v-for="item in deduplicationList"
              :key="item.value"
              :value="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('storage.compression')"
          style="width: 100%"
          prop="compression"
        >
          <el-select v-model="algorithmForm.compression" style="width: 100%">
            <el-option
              v-for="item in compressionList"
              :key="item.value"
              :value="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </re-dialog>
    <!-- 修改名称 -->
    <re-dialog v-model="editDataSetVisible" :width="350">
      <template #title>
        {{ $t('storage.editdataset') + ' ( ' + editDataSetForm.oldname + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="editDataSetVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureEditDataSet"
            :loading="sureLoading"
            :disabled="sureLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="editDataSetForm"
        ref="editDataSetForm"
        label-width="80px"
        label-position="left"
        :rules="editDataSetRules"
      >
        <el-form-item
          :label="$t('storage.parentdataset')"
          style="width: 100%"
          prop="newparentfs"
        >
          <el-select v-model="editDataSetForm.newparentfs" style="width: 100%">
            <el-option
              v-for="item in parentfsList"
              :key="item.dsname"
              :value="item.dsname"
              :label="item.dsname"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('common.name')"
          style="width: 100%"
          prop="newname"
        >
          <el-input
            v-model.trim="editDataSetForm.newname"
            :maxlength="128"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
    </re-dialog>
    <!-- 扩容 -->
    <re-dialog
      :modal-append-to-body="false"
      v-model="showResize"
      :title="'扩容数据集 - ' + resizeForm.dsname"
      :width="350"
    >
      <el-form
        :model="resizeForm"
        ref="resizeForm"
        label-width="100px"
        label-position="left"
        :rules="resizeRules"
      >
        <el-form-item
          :label="$t('storage.size')"
          prop="newsize"
          style="width: 100%"
        >
          <div class="resize">
            <InputSelect v-model="resizeForm.newsize"></InputSelect>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="showResize = false">{{
            $t('common.cancel')
          }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="onResize"
            :loading="btnResizeLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
    </re-dialog>
    <!-- 设文件块大小 -->
    <re-dialog
      :modal-append-to-body="false"
      v-model="showRecord"
      :title="'修改文件块大小 - ' + recordForm.name"
      :width="350"
    >
      <el-form
        :model="recordForm"
        ref="recordForm"
        label-width="100px"
        label-position="left"
        :rules="recordRules"
      >
        <el-form-item label="文件块大小" prop="size" style="width: 100%">
          <div class="resize">
            <InputSelect
              v-model="recordForm.size"
              selectType="volume"
            ></InputSelect>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="showRecord = false">{{
            $t('common.cancel')
          }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="onRecord"
            :loading="btnRecordLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
    </re-dialog>
  </div>
</template>

<script>
import { checkIDName, checkBytes } from '@/assets/js/setting.js'
import { ArrowDown } from '@element-plus/icons-vue'
import InputSelect from '@/common/inputselect.vue'
export default {
  name: 'DataSet',
  emits: ['snapshot'],
  components: {
    ArrowDown,
    InputSelect,
  },
  props: {
    datasetData: Array,
  },
  data() {
    return {
      sureLoading: false,
      snapshotVisible: false,
      disabled: false,
      createSnapShotForm: {
        name: null,
        dsname: null,
      },
      snapShotRules: {
        name: [{ required: true, validator: checkIDName, trigger: 'blur' }],
      },
      createDataSetVisible: false,
      createDataSetForm: {
        name: null,
        size: null,
        type: 'volume',
        parentfs: null,
      },
      datasetRules: {
        name: [{ required: true, validator: checkIDName, trigger: 'blur' }],
        size: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur',
          },
        ],
        volblocksize: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value.indexOf('null') > -1) {
                this.disabled = true
                return callback(new Error('Please input the size'))
              }
              if (this.createDataSetForm.type === 'volume') {
                let unit = value.split(/\d+/)[1]
                let num = value.match(/\d+/)[0]
                let result = 0
                if (unit === 'M') {
                  result = num * 1024 * 1024
                } else if (unit === 'K') {
                  result = num * 1024
                } else {
                  result = num
                }
                if (
                  !checkBytes(Number(result)) ||
                  result > 1024 * 1024 ||
                  result < 512
                ) {
                  this.disabled = true
                  callback(new Error(this.$t('validate.volSizeTips')))
                } else {
                  this.disabled = false
                  callback()
                }
              } else {
                this.disabled = false
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      setAlgorithmVisible: false,
      algorithmForm: {
        name: null,
        deduplication: 'off',
        compression: 'off',
      },
      compressionList: [
        {
          value: 'off',
        },
        {
          value: 'lzjb',
        },
        {
          value: 'gzip',
        },
        {
          value: 'zle',
        },
        {
          value: 'lz4',
        },
        {
          value: 'zstd',
        },
      ],
      deduplicationList: [
        {
          value: 'off',
        },
        {
          value: 'verify',
        },
        {
          value: 'sha256',
        },
        {
          value: 'sha512',
        },
        {
          value: 'skein',
        },
        {
          value: 'edonr,verify',
        },
        {
          value: 'sha256,verify',
        },
        {
          value: 'sha512,verify',
        },
        {
          value: 'skein,verify',
        },
      ],
      editDataSetVisible: false,
      editDataSetForm: {
        oldname: null,
        newparentfs: null,
        newname: null,
        type: null,
      },
      editDataSetRules: {
        newparentfs: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'change',
          },
        ],
        newname: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur',
          },
        ],
      },
      parentfsList: [],

      showResize: false,
      resizeDisabled: false,
      resizeForm: '',
      btnResizeLoading: false,
      resizeRules: {
        dsname: [{ required: true, validator: checkIDName, trigger: 'blur' }],
        newsize: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value.indexOf('null') > -1) {
                this.resizeDisabled = true
                return callback(new Error('Please input the size'))
              }
              return callback()
            },
            trigger: 'blur',
          },
        ],
      },
      showRecord: false,
      btnRecordLoading: false,
      recordForm: {
        name: '',
        size: '',
      },
      recordRules: {
        size: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value.indexOf('null') > -1) {
                this.disabled = true
                return callback(new Error('Please input the size'))
              }
              if (this.createDataSetForm.type === 'volume') {
                let unit = value.split(/\d+/)[1]
                let num = value.match(/\d+/)[0]
                let result = 0
                if (unit === 'M') {
                  result = num * 1024 * 1024
                } else if (unit === 'K') {
                  result = num * 1024
                } else {
                  result = num
                }
                if (
                  !checkBytes(Number(result)) ||
                  result > 1024 * 1024 ||
                  result < 512
                ) {
                  this.disabled = true
                  callback(new Error(this.$t('validate.volSizeTips')))
                } else {
                  this.disabled = false
                  callback()
                }
              } else {
                this.disabled = false
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    createSnapShot(row) {
      this.snapshotVisible = true
      this.createSnapShotForm = {
        name: null,
        dsname: row.dsname,
      }
      this.$refs.createSnapShotForm &&
        this.$refs.createSnapShotForm.clearValidate()
    },
    sureCreateSnapShot() {
      this.$refs.createSnapShotForm.validate((valid) => {
        if (valid) {
          this.$api
            .post(
              '/webapp/create_zfs_dataset_snapshot?remote_ip=' +
                this.$route.query.ip,
              this.createSnapShotForm,
              true,
            )
            .then((res) => {
              if (res.state == 0) {
                this.snapshotVisible = false
                this.$emit('snapshot', true)
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
        }
      })
    },
    deleteDataSet(row) {
      this.$messageBox
        .confirm(
          this.$t('storage.deldataset') + ' - ' + row.dsname,
          this.$t('common.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          },
        )
        .then(() => {
          this.$api
            .deletes(
              '/webapp/delete_zfs_dataset?remote_ip=' + this.$route.query.ip,
              {
                name: row.dsname,
                type: row.type,
              },
              true,
            )
            .then((res) => {
              if (res.state == 0) {
                this.$emit('snapshot', false)
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
        })
    },
    moreOperate(com) {
      com.event(com.row)
    },
    createDataset(row) {
      this.createDataSetVisible = true
      this.createDataSetForm = {
        name: null,
        size: '1G',
        parentfs: row.dsname,
        type: 'volume',
        volblocksize: '8192B',
        thinprovision: 0,
      }
      this.$refs.createDataSetForm &&
        this.$refs.createDataSetForm.clearValidate()
    },
    sureCreateDataset() {
      this.$refs.createDataSetForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/create_zfs_dataset?remote_ip=' + this.$route.query.ip,
              this.createDataSetForm,
              true,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.createDataSetVisible = false
                this.$emit('snapshot', false)
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
    changeRecord(row) {
      this.recordForm = {
        name: row.dsname,
        size: row.recordsize,
      }
      this.showRecord = true
    },
    onRecord() {
      this.btnRecordLoading = true
      this.$api
        .post(
          '/webapp/set_zfs_dataset_recordsize?remote_ip=' +
            this.$route.query.ip,
          {
            name: this.recordForm.name,
            recordsize: this.recordForm.size,
          },
          true,
        )
        .then((res) => {
          if (res.state === 0) {
            this.$message.success(res.message || '修文件块大小成功！')
            this.$emit('snapshot', false)
            this.showRecord = false
          } else {
            this.$message.warning(res.message || '修文件块大小失败！')
          }
          this.btnRecordLoading = false
        })
    },
    setalgorithm(row) {
      this.setAlgorithmVisible = true
      this.algorithmForm = {
        name: row.dsname,
        deduplication: row.deduplication,
        compression: row.compression,
      }
    },
    resizeZfs(row) {
      this.resizeForm = {
        dsname: row.dsname,
        newsize: '0B',
        quota: row.quota,
        volsize: row.volsize,
        type: row.type,
      }
      this.showResize = true
    },
    onResize() {
      this.btnResizeLoading = true
      this.$api
        .post(
          '/webapp/resize_zfs_dataset?remote_ip=' + this.$route.query.ip,
          {
            dsname: this.resizeForm.dsname,
            newsize: this.resizeForm.newsize,
            quota: this.resizeForm.quota,
            volsize: this.resizeForm.volsize,
            type: this.resizeForm.type,
          },
          true,
        )
        .then((res) => {
          if (res.state === 0) {
            this.$message.success('扩容成功！')
            this.$emit('snapshot', false)
            this.showResize = false
          } else {
            this.$message.warning(res.message || '扩容失败！')
          }
          this.btnResizeLoading = false
        })
    },
    sureSetAlgorithm() {
      this.$refs.algorithmForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/set_zfs_dataset_algorithm?remote_ip=' +
                this.$route.query.ip,
              this.algorithmForm,
              true,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.setAlgorithmVisible = false
                this.$emit('snapshot', false)
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
    editDataSet(row) {
      this.editDataSetVisible = true
      this.editDataSetForm = {
        oldname: row.dsname,
        newparentfs: null,
        newname: null,
        type: row.type,
      }
      this.$refs.editDataSetForm && this.$refs.editDataSetForm.clearValidate()
      this.parentfsList = this.datasetData.filter((item) => {
        return (
          item.sourcepool == row.sourcepool &&
          item.type == 'filesystem' &&
          item.dsname != row.dsname
        )
      })
    },
    sureEditDataSet() {
      this.$refs.editDataSetForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/edit_zfs_dataset?remote_ip=' + this.$route.query.ip,
              this.editDataSetForm,
              true,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.editDataSetVisible = false
                this.$emit('snapshot', false)
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
  },
}
</script>

<style lang="scss" scoped>
.el-table--fit {
  border: 1px solid;
}
</style>
<style lang="scss">
.resize {
  .is-without-controls {
    min-width: 50px;
  }
  .el-input-number.is-without-controls .el-input__wrapper {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
