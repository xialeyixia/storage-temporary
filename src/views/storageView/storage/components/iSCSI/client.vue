<template>
  <div class="block">
    <el-button type="primary" class="createbtn" @click="createNbdclient">{{
      $t('storage.create')
    }}</el-button>
    <el-table
      :data="clientData"
      v-loading="spinning"
      element-loading-text="Loading..."
      table-layout="auto"
    >
      <el-table-column :label="$t('common.name')" prop="name"></el-table-column>
      <el-table-column
        :label="$t('storage.device')"
        prop="path"
      ></el-table-column>
      <el-table-column
        :label="$t('storage.protocol')"
        prop="protocol"
      ></el-table-column>
      <el-table-column label="IP" prop="ip"></el-table-column>
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
      <el-table-column :label="$t('table.operate')">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            @click="disconnentNbdClient(scope.row)"
            >{{ $t('control.disconnect') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <re-dialog v-model="clientVisible" :width="400">
      <template #title>
        {{ $t('storage.create') + ' iSCSI' + $t('storage.client') }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="clientVisible = false"
            :disabled="sureLoading"
            >{{ $t('common.cancel') }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="sureAddNbdclient"
            :disabled="sureLoading"
            :loading="sureLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="clientForm"
        ref="clientForm"
        label-width="50px"
        :rules="clientRules"
        label-position="left"
      >
        <el-form-item label="IP" style="width: 100%" prop="ip">
          <el-input v-model="clientForm.ip" :maxlength="30">
            <template #append>
              <el-button :loading="tableLoading" @click="onSearchiSCSIClient"
                ><el-icon v-show="!tableLoading"><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <div style="width: 100%">
          <div style="margin-bottom: 10px">{{ $t('common.choosedevice') }}</div>
          <el-table
            v-loading="tableLoading"
            element-loading-text="Loading..."
            :data="searchData"
            highlight-current-row
            @current-change="handleCurrentChange"
            max-height="260px"
          >
            <el-table-column
              :label="$t('common.name')"
              prop="name"
            ></el-table-column>
          </el-table>
          <el-checkbox v-model="clientForm.automount" class="checkbox">{{
            $t('storage.automount')
          }}</el-checkbox>
        </div>
      </el-form>
    </re-dialog>
  </div>
</template>

<script>
import { checkIP } from '@/assets/js/setting.js'
import { Search } from '@element-plus/icons-vue'
export default {
  name: 'iSCSIClient',
  components: {
    Search,
  },
  data() {
    return {
      clientData: [],
      spinning: false,
      sureLoading: false,
      tableLoading: false,
      clientVisible: false,
      clientForm: {
        ip: null,
        name: null,
        automount: true,
      },
      clientRules: {
        ip: [{ required: true, validator: checkIP, trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.getNbdClientList()
  },
  methods: {
    getNbdClientList() {
      this.spinning = true
      this.$api
        .get('/webapp/get_client_nbd', {}, true)
        .then((res) => {
          this.spinning = false
          if (res.state == 0) {
            this.clientData = res.params.list
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
    createNbdclient() {
      this.clientVisible = true
      this.searchData = []
      this.clientForm = {
        ip: null,
        name: [],
        automount: true,
      }
      this.$refs.clientForm && this.$refs.clientForm.clearValidate()
    },
    onSearchiSCSIClient() {
      this.$refs.clientForm.validate((valid) => {
        if (valid) {
          this.tableLoading = true
          this.$api
            .get(
              '/webapp/get_remote_nbd',
              {
                protocol: 'iSCSI',
                ip: this.clientForm.ip,
              },
              true,
            )
            .then((res) => {
              this.tableLoading = false
              if (res.state == 0) {
                this.searchData = res.params.list
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
              this.$message.warning(this.$t('common.errmsg'))
            })
        }
      })
    },
    sureAddNbdclient() {
      this.$refs.clientForm.validate((valid) => {
        if (valid) {
          let querydata = {
            name: this.clientForm.name,
            ip: this.clientForm.ip,
            automount: this.clientForm.automount ? 1 : 0,
            protocol: 'iSCSI',
          }
          this.sureLoading = true
          this.$api
            .post('/webapp/set_client_nbd', querydata, true)
            .then((res) => {
              this.sureLoading = false
              if (res.state == 0) {
                this.clientVisible = false
                this.getNbdClientList()
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
              this.$message.warning(this.$t('common.errmsg'))
            })
        }
      })
    },
    disconnentNbdClient(row) {
      this.$messageBox
        .confirm(
          this.$t('control.disconnect') +
            ' iSCSI ' +
            this.$t('storage.client') +
            ' - ' +
            row.name,
          this.$t('common.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          },
        )
        .then(() => {
          let romovedata = {
            protocol: row.protocol,
            name: row.name,
            ip: row.ip,
          }
          this.spinning = true
          this.$api
            .deletes('/webapp/delete_client_nbd', romovedata, true)
            .then((res) => {
              this.spinning = false
              if (res.state == 0) {
                this.getNbdClientList()
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
    handleCurrentChange(val) {
      if (val) this.clientForm.name = val.name
    },
  },
}
</script>

<style lang="scss" scoped>
.block {
  text-align: left;
}
.el-table--fit {
  border: 1px solid;
}
.createbtn {
  margin-bottom: 10px;
}
</style>
