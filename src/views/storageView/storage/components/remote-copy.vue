<template>
  <div class="remote-copy-view" v-loading="loading">
    <div class="title">
      <el-button
        color="#579cdc"
        style="color: #fff"
        size="small"
        type="primary"
        @click="onShowCreateRDBD"
        >创建</el-button
      >
    </div>

    <!-- DRBD表格 -->
    <el-table :data="DRBDList" style="width: 100%">
      <el-table-column prop="name" :label="$t('common.name')" fixed />
      <el-table-column label="本地节点">
        <el-table-column prop="localId" label="ID" width="50" />
        <el-table-column prop="localIpv4" label="IP" width="130" />
        <el-table-column prop="localRole" label="角色" width="100" />
        <el-table-column prop="protocol" label="协议" width="90" />
        <!-- <el-table-column prop="occupy" label="占用状态" width="90" /> -->
        <el-table-column label="占用设备" width="90">
          <template #default="scope">
            <div v-if="scope.row.occupyname">
              {{ scope.row.occupyname }}
            </div>
            <div v-if="scope.row.occupycontent">
              {{ scope.row.occupycontent }}
            </div>
            <div v-if="!(scope.row.occupyname || scope.row.occupycontent)">
              -
            </div>
          </template>
        </el-table-column>
        <el-table-column label="块">
          <el-table-column
            prop="localDevice"
            :label="$t('common.disks') + $t('common.name')"
            width="140"
          />
          <el-table-column
            prop="localDstate"
            :label="$t('common.disks') + $t('common.status')"
            width="100"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column label="远端节点">
        <el-table-column prop="remoteId" label="ID" width="50" />
        <el-table-column prop="remoteIpv4" label="IP" width="130" />
        <el-table-column prop="remoteRole" label="角色" width="100" />
        <el-table-column label="块">
          <el-table-column
            prop="remoteDevice"
            :label="$t('common.disks') + $t('common.name')"
            width="140"
          />
          <el-table-column
            prop="remoteDstate"
            :label="$t('common.disks') + $t('common.status')"
            width="100"
          />
          <el-table-column prop="remoteDsync" label="同步进度" width="100" />
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="cstate"
        :label="$t('common.network') + $t('common.status')"
        width="120"
      >
        <template #default="scope">
          <span>{{ scope.row.cstate }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="state" :label="$t('common.status')" width="70">
        <template #default="scope">
          <span>{{ scope.row.state === 0 ? '启动' : '关闭' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('table.operate')" width="140" fixed="right">
        <template #default="scope">
          <el-dropdown
            trigger="click"
            @command="onManage"
            style="margin-left: 8px"
          >
            <el-button size="small" link
              >{{ $t('control.more')
              }}<el-icon style="margin-left: 3px"><ArrowDown /></el-icon
            ></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :command="{ event: 'delete', row: scope.row }"
                  :disabled="scope.row.occupyState"
                  >{{ $t('control.delete') }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ event: 'role', row: scope.row }"
                  :disabled="scope.row.occupyState"
                  >设置为{{
                    scope.row.localRole === 'Secondary'
                      ? 'Primary'
                      : 'Secondary'
                  }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ event: 'up', row: scope.row }"
                  :disabled="scope.row.state === 0"
                  >{{ $t('control.start') }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ event: 'down', row: scope.row }"
                  :disabled="scope.row.state === -1"
                  >{{ $t('control.stop') }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ event: 'connect', row: scope.row }"
                  :disabled="
                    scope.row.cstate === 'Connected' ||
                    scope.row.cstate === 'Connecting' ||
                    scope.row.state === -1
                  "
                  >{{ $t('control.connect') }}</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ event: 'disconnect', row: scope.row }"
                  :disabled="scope.row.state === -1"
                  >{{ $t('control.disconnect') }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建DRBD弹框 -->
    <el-dialog
      v-model="showCreateDRBD"
      :title="$t('table.copy')"
      center
      :before-close="onCloseDRBD"
    >
      <el-form
        :model="createDRBDForm"
        ref="createDRBDForm"
        :rules="createDRBDRules"
      >
        <el-form-item
          class="selfLabel"
          label-width="100px"
          :label="$t('common.name') + '：'"
          prop="name"
          style="width: 100%"
        >
          <el-input
            v-model.trim="createDRBDForm.name"
            :placeholder="$t('validate.nameCheckTips')"
            :maxlength="128"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="selfLabel"
          label-width="100px"
          :label="$t('storage.protocol') + '：'"
          prop="protocol"
        >
          <el-select
            v-model="createDRBDForm.protocol"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              key="A"
              value="A"
              :label="$t('storage.aCopy')"
            ></el-option>
            <el-option
              key="C"
              value="C"
              :label="$t('storage.cCopy')"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="form-title">本地节点：</div>
        <el-form-item label-width="100px" label="ID：" prop="localId">
          <el-input-number
            v-model="createDRBDForm.localId"
            :min="0"
            :max="10"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="IP：" prop="localIp">
          <el-input v-model="createDRBDForm.localIp" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="PORT：" prop="localPort">
          <el-input-number
            v-model="createDRBDForm.localPort"
            :min="7788"
            :max="65535"
          />
        </el-form-item>
        <el-form-item
          label-width="100px"
          :label="$t('common.disks') + '：'"
          prop="localDevice"
        >
          <el-select
            v-model="createDRBDForm.localDevice"
            clearable
            placeholder=" "
            style="width: 100%"
          >
            <el-option
              v-for="item in diskpartNames"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
            <el-option
              v-for="item in blkNames"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label-width="100px"
          :label="$t('storage.minor') + '：'"
          prop="localMinor"
        >
          <el-input-number
            v-model="createDRBDForm.localMinor"
            :min="0"
            :max="32767"
          />
        </el-form-item>
        <div class="form-title">远端节点：</div>
        <el-form-item label-width="100px" label="ID：" prop="remoteId">
          <el-input-number
            v-model="createDRBDForm.remoteId"
            :min="0"
            :max="10"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="IP：" prop="remoteIp">
          <el-input
            v-model="createDRBDForm.remoteIp"
            :maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="PORT：" prop="remotePort">
          <el-input-number
            v-model="createDRBDForm.remotePort"
            :min="7788"
            :max="65535"
          />
        </el-form-item>
        <el-form-item
          label-width="100px"
          :label="$t('common.disks') + '：'"
          prop="remoteDevice"
        >
          <el-input
            v-model="createDRBDForm.remoteDevice"
            placeholder="建议输入设备 by-id 名称"
            :maxlength="128"
          ></el-input>
        </el-form-item>
        <el-form-item
          label-width="100px"
          :label="$t('storage.minor') + '：'"
          prop="remoteMinor"
        >
          <el-input-number
            v-model="createDRBDForm.remoteMinor"
            :min="0"
            :max="32767"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="onCloseDRBD">{{
            $t('common.cancel')
          }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="onCreateDRBD"
            :loading="showLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 连接弹框 -->
    <el-dialog v-model="showConnect" title="是否丢弃数据" center width="30%">
      <el-radio-group v-model="discarddata" class="ml-4">
        <el-radio :label="0" size="large">丢弃数据</el-radio>
        <el-radio :label="-1" size="large">不丢弃数据</el-radio>
      </el-radio-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="showConnect = false">{{
            $t('common.cancel')
          }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="onConnect"
            :loading="showConnectLoading"
            >确认连接</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { ArrowDown } from '@element-plus/icons-vue'
export default {
  data() {
    return {
      loading: false,
      DRBDList: [],
      showCreateDRBD: false,
      showLoading: false,
      showConnect: false,
      discarddata: 0,
      showConnectLoading: false,
      command: {},

      diskpartNames: [],
      blkNames: [],
      createDRBDForm: {
        name: '',
        protocol: '',
        localId: 0,
        localIp: '',
        localPort: '',
        localDevice: '',
        localMinor: '',
        remoteId: 1,
        remoteIp: '',
        remotePort: '',
        remoteDevice: '',
        remoteMinor: '',
      },
      createDRBDRules: {
        name: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              let re = /^[0-9A-Za-z\.+-]+$/
              if (!re.test(value)) {
                return callback(this.$t('validate.nameCheckTips'))
              }
              return callback()
            },
            trigger: 'blur',
          },
        ],
        protocol: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'change',
          },
        ],
        localId: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') return callback(this.$t('validate.required'))
              this.$refs.createDRBDForm.validateField('remoteId')
              return callback()
            },
            trigger: 'blur',
          },
        ],
        localIp: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'blur',
          },
        ],
        localPort: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'blur',
          },
        ],
        localDevice: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'change',
          },
        ],
        localMinor: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'blur',
          },
        ],
        remoteId: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') return callback(this.$t('validate.required'))
              if (value === this.createDRBDForm.localId) {
                return callback(this.$t('validate.sameLocaleId'))
              }
              return callback()
            },
            trigger: 'blur',
          },
        ],
        remoteIp: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'blur',
          },
        ],
        remotePort: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'blur',
          },
        ],
        remoteDevice: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'blur',
          },
        ],
        remoteMinor: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') return callback(this.$t('validate.required'))
              return callback()
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },
  components: {
    ArrowDown,
  },
  watch: {
    '$route.query.ip'(val) {
      if (val) this.getLists()
    },
  },
  created() {
    this.getLists()
  },
  methods: {
    onShowCreateRDBD() {
      this.showCreateDRBD = true
      this.getDiskpart()
    },
    getLists() {
      this.loading = true
      this.$api
        .get(
          '/webapp/get_drbd_list?remote_ip=' + this.$route.query.ip,
          {},
          true,
        )
        .then((res) => {
          if (res.state === 0) {
            this.DRBDList = []
            res.params.list.forEach((item) => {
              let temp = {}
              temp.name = item.name
              temp.cstate = item.cstate || '-'
              temp.state = item.state
              temp.protocol = item.protocol === 'C' ? '同步复制' : '异步复制'
              temp.occupy = item.occupyname ? '占用' : '未占用'
              temp.occupyState = item.occupyname ? true : false
              temp.occupyname = item.occupyname
              temp.occupycontent = item.occupycontent
              temp.localId = item.node_local.id
              temp.localIpv4 = item.node_local.ipv4
              temp.localRole = item.node_local.role || '-'
              temp.localDevice = item.node_local.volume[0].device || '-'
              temp.localDstate = item.node_local.volume[0].dstate || '-'
              temp.remoteId = item.node_remote.id
              temp.remoteIpv4 = item.node_remote.ipv4
              temp.remoteRole = item.node_remote.role || '-'
              temp.remoteDevice = item.node_remote.volume[0].device || '-'
              temp.remoteDstate = item.node_remote.volume[0].dstate || '-'
              temp.remoteDsync = item.node_remote.volume[0].dsync
                ? item.node_remote.volume[0].dsync + '%'
                : '-'
              this.DRBDList.push(temp)
            })
          } else {
            this.$message.warning(
              res.message ? res.message : this.$t('common.errmsg'),
            )
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          this.$message.warning(
            err.message ? err.message : this.$t('common.errmsg'),
          )
        })
    },
    onCloseDRBD() {
      this.$refs.createDRBDForm.resetFields()
      this.showCreateDRBD = false
    },
    del(row) {
      this.$messageBox
        .confirm('删除远程复制 - ' + row.name, this.$t('common.warning'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        })
        .then(() => {
          this.loading = true
          this.$api
            .deletes(
              '/webapp/delete_drbd_resource?remote_ip=' + this.$route.query.ip,
              {
                name: row.name,
                device: row.localDevice,
              },
              true,
            )
            .then((res) => {
              if (res.state === 0) {
                this.$message.success('删除DRBD成功！')
              } else {
                this.$message.warning(res.message || '删除DRBD失败！')
              }
              this.getLists()
            })
        })
    },
    setRole(row) {
      let data = {
        name: row.name,
        role: row.localRole === 'Secondary' ? 'primary' : 'secondary',
      }
      this.$api
        .post(
          '/webapp/set_drbd_role?remote_ip=' + this.$route.query.ip,
          data,
          true,
        )
        .then((res) => {
          if (res.state === 0) {
            this.$message.success('角色设置成功！')
          } else {
            this.$message.warning(
              res.message ? res.message : this.$t('common.errmsg'),
            )
          }
          this.getLists()
        })
    },
    onManage(command) {
      this.command = command
      if (command.event === 'delete') {
        this.del(command.row)
      } else if (command.event === 'role') {
        this.setRole(command.row)
      } else if (command.event === 'connect') {
        this.showConnect = true
      } else {
        this.manage()
      }
    },
    onConnect() {
      this.showConnectLoading = true
      this.manage(this.discarddata)
    },
    manage(discarddata) {
      this.loading = true
      let type = {
        up: '启动',
        down: '停止',
        connect: '连接',
        disconnect: '断开连接',
      }
      let data = {
        name: this.command.row.name,
        operation: this.command.event,
      }
      if (this.command.event === 'connect') {
        data.discarddata = discarddata
      }
      this.$api
        .post(
          '/webapp/set_drbd_resource?remote_ip=' + this.$route.query.ip,
          data,
          true,
        )
        .then((res) => {
          let first = this.command.event.substring(0, 1).toUpperCase()
          let second = this.command.event.substring(1)
          let command = first + second
          if (res.state === 0) {
            this.$message.success(type[this.command.event] + '成功！')
          } else {
            this.$message.warning(
              res.message || type[this.command.event] + '失败！',
            )
          }
          if (this.command.event === 'connect') {
            this.showConnectLoading = false
            this.showConnect = false
          }
          this.getLists()
        })
    },
    getDiskpart() {
      this.$api
        .get('/webapp/get_diskpart?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          this.diskpartNames = []
          if (res.state === 0) {
            res.params.list.forEach((item) => {
              if (item.occupycontent === null && item.occupyname === null) {
                this.diskpartNames.push(item.name)
              }
            })
            this.getBlk()
          } else {
            this.$message.warning(
              res.message ? res.message : this.$t('common.errmsg'),
            )
          }
        })
        .catch(() => {})
    },
    getBlk() {
      this.$api
        .get('/webapp/get_blk?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          this.blkNames = []
          if (res.state === 0) {
            res.params.list.forEach((item) => {
              if (item.occupycontent === null && item.occupyname === null) {
                this.blkNames.push(item.name)
              }
            })
          } else {
            this.$message.warning(
              res.message ? res.message : this.$t('common.errmsg'),
            )
          }
        })
        .catch(() => {})
    },
    onCreateDRBD() {
      this.$refs.createDRBDForm.validate((valid) => {
        if (valid) {
          this.showLoading = true
          let data = {
            name: this.createDRBDForm.name,
            protocol: this.createDRBDForm.protocol,
            node_local: {
              id: this.createDRBDForm.localId,
              ip: this.createDRBDForm.localIp,
              port: this.createDRBDForm.localPort,
              volume: [
                {
                  device: this.createDRBDForm.localDevice,
                  minor: this.createDRBDForm.localMinor,
                },
              ],
            },
            node_remote: {
              id: this.createDRBDForm.remoteId,
              ip: this.createDRBDForm.remoteIp,
              port: this.createDRBDForm.remotePort,
              volume: [
                {
                  device: this.createDRBDForm.remoteDevice,
                  minor: this.createDRBDForm.remoteMinor,
                },
              ],
            },
          }
          this.$api
            .post(
              '/webapp/create_drbd_resource?remote_ip=' + this.$route.query.ip,
              data,
              true,
            )
            .then((res) => {
              if (res.state === 0) {
                this.$message.success('创建 DRBD 资源成功')
                this.showLoading = false
                this.$refs.createDRBDForm.resetFields()
                this.showCreateDRBD = false
                this.getLists()
              } else {
                this.showLoading = false
                this.$message.warning(res.message || '创建 DRBD 资源失败')
              }
            }, 1000)
            .catch((err) => {
              this.showLoading = false
              this.$message.warning(err.message || '创建 DRBD 资源失败')
            })
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.remote-copy-view {
  .title {
    text-align: left;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.remote-copy-view {
  .el-dialog {
    .form-title {
      width: 100%;
      margin-bottom: 10px;
    }
    .selfLabel {
      .el-form-item__label {
        justify-content: flex-start;
      }
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      display: none;
    }
  }
}
.el-scrollbar__view {
  width: 326px;
  min-width: 326px;
}
</style>
