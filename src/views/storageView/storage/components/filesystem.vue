<template>
  <div class="storage-content">
    <el-button
      color="#579cdc"
      style="color: #fff"
      type="primary"
      size="small"
      @click="mountFS"
      >{{ $t('storage.mount') }}</el-button
    >
    <div class="maincontents">
      <el-table
        :data="fileSystemData"
        v-loading="spinning"
        table-layout="auto"
        header-cell-class-name="table-header-row"
        element-loading-text="Loading..."
      >
        <el-table-column
          :label="$t('storage.filesystem')"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.fstype')"
          prop="fstype"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.mounton')"
          prop="mounton"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.availsize')"
          prop="avail"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.size')"
          prop="size"
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
        <el-table-column :label="$t('table.operate')" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="removeFileSystem(scope.row)"
              :disabled="scope.row.occupyname !== null"
              >{{ $t('storage.unmount') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <re-dialog v-model="mountFSVisible" :width="430">
      <template #title>
        {{ $t('storage.mount') }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="mountFSVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureMountFS"
            :loading="sureLoading"
            :disabled="sureLoading || !mountFSForm.name"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="mountFSForm"
        ref="mountFSForm"
        label-width="120px"
        :rules="mountFSRules"
        label-position="left"
      >
        <el-form-item
          :label="$t('storage.mounton')"
          style="width: 100%"
          prop="mounton"
        >
          <el-input
            v-model.trim="mountFSForm.mounton"
            :maxlength="128"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('storage.fstype')"
          style="width: 100%"
          v-show="mountFSForm.type == 0"
        >
          <el-select v-model="mountFSForm.fstype" style="width: 100%">
            <el-option
              v-for="item in fstypeList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <div style="width: 100%">
          <div style="margin-bottom: 10px">{{ $t('common.choosedevice') }}</div>
          <el-table
            v-loading="tableLoading"
            :data="tableFilter([...blockData, ...diskpartData, ...datasetData])"
            header-cell-class-name="table-header-row"
            element-loading-text="Loading..."
            highlight-current-row
            @current-change="handleCurrentChange"
            max-height="260px"
          >
            <el-table-column width="40px">
              <template #default="scope">
                <el-radio
                  v-model="mountFSForm.name"
                  :label="scope.row.name"
                ></el-radio>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('storage.devicename')"
              prop="name"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              :label="$t('storage.size')"
              prop="size"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </div>
        <div
          style="text-align: center; margin-top: 10px"
          v-show="mountFSForm.type == 0"
        >
          <el-checkbox v-model="mountFSForm.automount" class="checkbox">{{
            $t('storage.automount')
          }}</el-checkbox>
          <el-checkbox v-model="mountFSForm.format" class="checkbox">{{
            $t('storage.formatfs')
          }}</el-checkbox>
          <div style="color: red">
            {{ '(' + $t('storage.fsnote') + ' ! )' }}
          </div>
        </div>
      </el-form>
    </re-dialog>
  </div>
</template>

<script>
import { checkPath } from '@/assets/js/setting.js'
export default {
  name: 'FileSystem',
  components: {},
  data() {
    return {
      fileSystemData: [],
      spinning: false,
      tableLoading: false,
      sureLoading: false,
      mountFSVisible: false,
      mountFSForm: {
        fstype: 'ext4',
        mounton: null,
        format: true,
        automount: true,
        name: null,
        type: 0,
      },
      mountFSRules: {
        mounton: [{ required: true, validator: checkPath, trigger: 'blur' }],
      },
      fstypeList: ['ext2', 'ext3', 'ext4', 'xfs', 'fat', 'vfat'],
      blockData: [],
      diskpartData: [],
      datasetData: [],
    }
  },
  watch: {
    '$route.query.ip'(val) {
      if (val) this.getFSlist()
    },
  },
  mounted() {
    this.getFSlist()
  },
  methods: {
    tableFilter(arr) {
      let newArr = arr.filter((item) => item.occupyname === null)
      return newArr
    },
    removeFileSystem(row) {
      this.$messageBox
        .confirm(
          this.$t('storage.unmountfs') + ' - ' + row.name,
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
              '/webapp/delete_fs?remote_ip=' + this.$route.query.ip,
              {
                name: row.name,
                mounton: row.mounton,
                fstype: row.fstype,
              },
              true,
            )
            .then((res) => {
              this.spinning = false
              if (res.state == 0) {
                this.getFSlist()
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
              this.spinning = false
              this.$message.warning(this.$t('common.errmsg'))
            })
        })
    },
    getFSlist() {
      this.spinning = true
      this.$api
        .get('/webapp/get_fs?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          this.spinning = false
          if (res.state == 0) {
            this.fileSystemData = res.params.list
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
    mountFS() {
      this.mountFSVisible = true
      this.mountFSForm = {
        fstype: 'ext4',
        mounton: null,
        format: true,
        automount: true,
        name: null,
        type: -1,
      }
      this.$refs.mountFSForm && this.$refs.mountFSForm.clearValidate()
      this.blockData = []
      this.diskpartData = []
      this.datasetData = []
      this.getblklist()
    },
    getblklist() {
      this.tableLoading = true
      this.$api
        .get('/webapp/get_blk?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          this.getDiskPart()
          if (res.state == 0) {
            this.blockData = res.params.list
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
          this.tableLoading = false
        })
    },
    getDiskPart() {
      this.$api
        .get('/webapp/get_diskpart?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          this.getZfsDataSet()
          if (res.state == 0) {
            this.diskpartData = res.params.list
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
          this.tableLoading = false
        })
    },
    getZfsDataSet() {
      this.$api
        .get(
          '/webapp/get_zfs_dataset?remote_ip=' + this.$route.query.ip,
          {},
          true,
        )
        .then((res) => {
          this.tableLoading = false
          if (res.state == 0) {
            this.datasetData = res.params.list.filter((item) => {
              return item.type == 'filesystem'
            })
            this.datasetData.forEach((item) => {
              item.size = item.avaliable
              item.zfs = 1
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
        .catch(() => {
          this.tableLoading = false
        })
    },
    sureMountFS() {
      this.$refs.mountFSForm.validate((valid) => {
        if (valid) {
          let querydata = {
            fstype: this.mountFSForm.fstype,
            mounton: this.mountFSForm.mounton,
            name: this.mountFSForm.name,
            format: this.mountFSForm.format ? 1 : 0,
            automount: this.mountFSForm.automount ? 1 : 0,
            type: this.mountFSForm.type,
          }
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/set_fs?remote_ip=' + this.$route.query.ip,
              querydata,
              true,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.mountFSVisible = false
                this.getFSlist()
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
              this.sureLoading = false
            })
        }
      })
    },
    handleCurrentChange(val) {
      if (val) {
        this.mountFSForm.name = val.name
        this.mountFSForm.type = val.zfs ? 1 : 0
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-table--fit {
  border: 1px solid;
}
.storage-content {
  padding: 8px 10px;
  box-sizing: border-box;
}
.maincontents {
  margin-top: 8px;
  overflow: auto;
  height: calc(100% - 45px);
  box-sizing: border-box;
}
</style>
