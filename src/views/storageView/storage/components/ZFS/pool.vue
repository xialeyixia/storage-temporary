<template>
  <div class="pool">
    <el-button
      color="#579cdc"
      style="color: #fff"
      type="primary"
      size="small"
      @click="createPool"
      >{{ $t('storage.create') }}</el-button
    >
    <div class="maincontents">
      <el-table
        :data="poolData"
        v-loading="spinning"
        element-loading-text="Loading..."
        header-cell-class-name="table-header-row"
        :row-class-name="getRowClassName"
        row-key="name"
        :expand-row-keys="expandRowKeys"
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div style="padding: 5px 20px">
              <div class="expand-title">{{ $t('storage.device') + ' :' }}</div>
              <PoolDevice
                :deviceData="props.row.device"
                :poolname="props.row.name"
                @updatedata="getPoolList"
              ></PoolDevice>
            </div>
            <div style="padding: 5px 20px">
              <div class="expand-title">{{ $t('storage.dataset') + ' :' }}</div>
              <DataSet
                :datasetData="props.row.dslist"
                @snapshot="statuschange"
              ></DataSet>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.name')"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.size')"
          prop="size"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.availsize')"
          prop="free"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.usedsize')"
          prop="capacity"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('common.status')"
          prop="state"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.errdata')"
          prop="errors"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('storage.Hotbackupautoreplace')"
          prop="autoreplace"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.autoreplace"
              active-value="on"
              inactive-value="off"
              @change="
                changeHotbackupStatus(scope.row.name, scope.row.autoreplace)
              "
            ></el-switch>
          </template>
        </el-table-column>
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
            <el-dropdown trigger="click" @command="moreOperate">
              <el-button size="small" link>
                {{ $t('common.more') }}
                <el-icon style="margin-left: 3px"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :command="{ event: getZfsPoolState, row: scope.row }"
                    >{{ $t('storage.viewpoolstatus') }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ event: addDevice, row: scope.row }"
                    >{{ $t('storage.adddevice') }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :disabled="scope.row.occupyname !== null"
                    :command="{ event: removePool, row: scope.row }"
                    >{{ $t('control.delete') }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 创建存储池 -->
    <re-dialog v-model="poolVisible" :width="430">
      <template #title>
        {{ $t('storage.createpool') }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="poolVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureCreatePool"
            :loading="sureLoading"
            :disabled="sureLoading || poolForm.device.length == 0"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="poolForm"
        ref="poolForm"
        label-width="60px"
        :rules="poolRules"
        label-position="left"
      >
        <el-form-item
          :label="$t('common.name')"
          style="width: 100%"
          prop="name"
        >
          <el-input v-model.trim="poolForm.name" :maxlength="128"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('common.level')"
          style="width: 100%"
          prop="level"
        >
          <el-select v-model="poolForm.level" style="width: 100%">
            <el-option
              :value="item.value"
              v-for="item in levelList"
              :key="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('storage.sparenum')"
          label-width="120px"
          style="width: 100%"
          prop="sparenum"
          v-show="
            poolForm.level == 'draid' ||
            poolForm.level == 'draid2' ||
            poolForm.level == 'draid3'
          "
        >
          <el-input-number
            v-model="poolForm.sparenum"
            :min="0"
            :max="4"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <div style="width: 100%">
          <div style="margin-bottom: 10px">{{ $t('common.choosedevice') }}</div>
          <el-table
            v-loading="tableLoading"
            element-loading-text="Loading..."
            :data="tableFilter(blockData)"
            @selection-change="handleSelectionChange"
            max-height="260px"
            header-cell-class-name="table-header-row"
          >
            <el-table-column type="selection" width="55" />
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
      </el-form>
    </re-dialog>
    <re-dialog v-model="addDeviceVisible" :width="430">
      <template #title>
        {{ $t('storage.adddevice') + ' ( ' + addDeviceForm.name + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="addDeviceVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureAddDevice"
            :loading="sureLoading"
            :disabled="sureLoading || addDeviceForm.device.length == 0"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="addDeviceForm"
        ref="addDeviceForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          :label="$t('common.type')"
          style="width: 100%"
          prop="type"
        >
          <el-select
            v-model="addDeviceForm.type"
            style="width: 100%"
            @change="
              (val) => {
                if (val != 'data') {
                  this.addDeviceForm.level = 'RAID0'
                }
              }
            "
          >
            <el-option value="data" label="data"></el-option>
            <el-option value="spare" label="spare"></el-option>
            <el-option value="log" label="log"></el-option>
            <el-option value="cache" label="cache"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('common.level')"
          style="width: 100%"
          prop="level"
        >
          <el-select
            v-show="addDeviceForm.type == 'data'"
            v-model="addDeviceForm.level"
            style="width: 100%"
            :disabled="
              addDeviceForm.type != 'data' && addDeviceForm.type != 'log'
            "
          >
            <el-option
              :value="item.value"
              v-for="item in levelList"
              :key="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-show="addDeviceForm.type != 'data'"
            v-model="addDeviceForm.level"
            style="width: 100%"
            :disabled="
              addDeviceForm.type != 'data' && addDeviceForm.type != 'log'
            "
          >
            <el-option
              :value="item.value"
              v-for="item in levelList.slice(0, 2)"
              :key="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('storage.sparenum')"
          label-width="120px"
          style="width: 100%"
          prop="sparenum"
          v-show="
            addDeviceForm.level == 'draid' ||
            addDeviceForm.level == 'draid2' ||
            addDeviceForm.level == 'draid3'
          "
        >
          <el-input-number
            v-model="addDeviceForm.sparenum"
            :min="0"
            :max="4"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <div style="width: 100%">
          <div style="margin-bottom: 10px">{{ $t('common.choosedevice') }}</div>
          <el-table
            v-loading="tableLoading"
            element-loading-text="Loading..."
            :data="tableFilter(blockData)"
            @selection-change="handleSelectionChange"
            max-height="260px"
            header-cell-class-name="table-header-row"
          >
            <el-table-column type="selection" width="55" />
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
      </el-form>
    </re-dialog>
    <re-dialog v-model="PoolStatusVisible" :width="750">
      <template #title>
        {{ $t('storage.poolstatus') + ' ( ' + poolStatus.name + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="PoolStatusVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.close') }}</el-button
          >
        </span>
      </template>
      <el-tabs v-model="poolStatusActiveName" type="card">
        <el-tab-pane :label="$t('storage.statusinfo')" name="status">
          <pre class="text-show">{{ poolStatus.status }}</pre>
        </el-tab-pane>
        <el-tab-pane :label="$t('storage.iostatusinfo')" name="iostat">
          <pre class="text-show">{{ poolStatus.iostat }}</pre>
        </el-tab-pane>
      </el-tabs>
    </re-dialog>
  </div>
</template>

<script>
import { checkIDName } from '@/assets/js/setting.js'
import { ArrowDown } from '@element-plus/icons-vue'
import PoolDevice from './pooldevice.vue'
import DataSet from './dataset.vue'
export default {
  name: 'StoragePool',
  components: {
    PoolDevice,
    DataSet,
    ArrowDown,
  },
  data() {
    return {
      spinning: false,
      sureLoading: false,
      tableLoading: false,
      expandRowKeys: [],
      poolData: [],
      poolVisible: false,
      poolForm: {
        name: null,
        level: 'RAID0',
        sparenum: 0,
        device: null,
      },
      levelList: [
        {
          value: 'RAID0',
        },
        {
          value: 'RAID1',
        },
        {
          value: 'RAID5',
        },
        {
          value: 'RAID6',
        },
      ],
      blockData: [],
      poolRules: {
        name: [{ required: true, validator: checkIDName, trigger: 'blur' }],
      },
      addDeviceVisible: false,
      addDeviceForm: {
        name: null,
        type: 'data',
        level: 'RAID0',
        sparenum: 0,
        device: [],
      },
      PoolStatusVisible: false,
      poolStatus: {
        name: null,
        iostat: null,
        status: null,
      },
      poolStatusActiveName: 'status',
    }
  },
  mounted() {
    this.getPoolList()
  },
  watch: {
    '$route.query.ip'(val) {
      if (val) this.getPoolList()
    },
  },
  methods: {
    expandChange(row, expandrow) {
      let expand = []
      expandrow.forEach((item) => {
        expand.push(item.name)
      })
      this.expandRowKeys = expand
    },
    getRowClassName({ row }) {
      if (row.dslist.length == 0 && row.device.length == 0) {
        return 'row-expand-cover'
      }
    },
    createPool() {
      this.poolVisible = true
      this.poolForm = {
        name: null,
        level: 'RAID0',
        sparenum: 0,
        device: [],
      }
      this.blockData = []
      this.getblklist()
    },
    //获取zfs存储池列表
    getPoolList() {
      this.spinning = true
      this.$api
        .get('/webapp/get_zfs?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          console.log(res, 78456)
          this.spinning = false
          if (res.state == 0) {
            this.poolData = res.params.list
            this.poolData.forEach((item) => {
              this.searchForDisk(item.device)
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
          this.spinning = false
        })
    },
    searchForDisk(val) {
      val.forEach((item) => {
        if (!item.disk) {
          item.disk = item.groupid
        }
        if (item.children) this.searchForDisk(item.children)
      })
    },
    tableFilter(arr) {
      let newArr = arr.filter((item) => item.occupyname === null)
      return newArr
    },
    getZfsPoolState(row) {
      this.$api
        .get(
          '/webapp/get_zfs_pool_status?remote_ip=' + this.$route.query.ip,
          {
            name: row.name,
          },
          true,
        )
        .then((res) => {
          if (res.state == 0) {
            this.PoolStatusVisible = true
            this.poolStatus = res.params
            this.poolStatus.name = row.name
          }
        })
    },
    getblklist() {
      this.tableLoading = true
      this.$api
        .get('/webapp/get_blk_raw?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          if (res.state == 0) {
            this.blockData = res.params.list
            console.log('blockData----->', this.blockData)
          } else {
            this.$message.warning({
              message: (
                <div class="warning-message">
                  {res.message ? res.message : this.$t('common.errmsg')}
                </div>
              ),
            })
          }
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    sureCreatePool() {
      this.$refs.poolForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api
            .post(
              '/webapp/create_zfs_pool?remote_ip=' + this.$route.query.ip,
              this.poolForm,
              true,
            )
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.poolVisible = false
                this.getPoolList()
                this.$message.success(
                  this.$t('storage.create') + this.$t('common.success'),
                )
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
              this.$message.warning(this.$t('common.errmsg'))
            })
        }
      })
    },
    removePool(row) {
      this.$messageBox
        .confirm(
          this.$t('storage.delpool') + ' - ' + row.name,
          this.$t('common.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          },
        )
        .then(() => {
          let querydata = {
            name: row.name,
            device: [],
          }
          this.recursionForDevice(row.device, querydata)
          this.spinning = true
          this.$api
            .deletes(
              '/webapp/delete_zfs_pool?remote_ip=' + this.$route.query.ip,
              querydata,
              true,
            )
            .then((res) => {
              this.spinning = false
              if (res.state == 0) {
                this.getPoolList()
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
    recursionForDevice(device, querydata) {
      device.forEach((item) => {
        if (item.children) {
          this.recursionForDevice(item.children, querydata)
        } else {
          querydata.device.push(item.disk)
        }
      })
    },
    handleSelectionChange(val) {
      let device = []
      val.forEach((item) => {
        device.push(item.name)
      })
      if (this.poolVisible) this.poolForm.device = device
      else if (this.addDeviceVisible) this.addDeviceForm.device = device
    },
    addDevice(row) {
      this.addDeviceVisible = true
      this.addDeviceForm = {
        name: row.name,
        type: 'data',
        level: 'RAID0',
        sparenum: 0,
        device: [],
      }
      this.blockData = []
      this.getblklist()
    },
    sureAddDevice() {
      this.sureLoading = true
      this.$api
        .post(
          '/webapp/add_zfs_pool_disk?remote_ip=' + this.$route.query.ip,
          this.addDeviceForm,
          true,
        )
        .then((res) => {
          this.sureLoading = false
          if (res.state == 0) {
            this.addDeviceVisible = false
            this.getPoolList()
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
    },
    statuschange(val) {
      if (!val) {
        this.getPoolList()
      }
    },
    moreOperate(com) {
      com.event(com.row)
    },
    changeHotbackupStatus(name, status) {
      this.sureLoading = true
      this.$api
        .post(
          '/webapp/set_zfs_pool_autoreplace?remote_ip=' + this.$route.query.ip,
          {
            name: name,
            operation: status,
          },
          true,
        )
        .then((res) => {
          this.sureLoading = false
          this.getPoolList()
          if (res.state == 0) {
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
:deep(.row-expand-cover .el-table__expand-icon) {
  visibility: hidden;
}
.expand-title {
  margin-bottom: 7px;
}
.text-show {
  font-size: 15px;
  margin: 0;
  overflow: auto;
}
.maincontents {
  overflow: auto;
  height: calc(100% - 45px);
  box-sizing: border-box;
  margin-top: 8px;
}
</style>
