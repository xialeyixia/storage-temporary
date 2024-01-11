<template>
  <div class="storage-content">
    <div class="btn">
      <el-button
        color="#579cdc"
        style="color: #fff"
        type="primary"
        size="small"
        @click="saveConfig"
        >{{ $t('common.save') }}</el-button
      >
      <div>
        <!-- <el-button color="#579cdc" style="color: #fff;" type="primary" size="small" @click="showChangePwd = true">修改密码</el-button>
        <el-button color="#579cdc" style="color: #fff;" type="primary" size="small" @click="onLogout">退出登录</el-button> -->
        <el-button
          color="#579cdc"
          style="color: #fff"
          type="primary"
          size="small"
          @click="onShowProver"
          >{{ $t('common.prover') }}</el-button
        >
      </div>
    </div>
    <el-form
      class="system-form"
      label-suffix="："
      label-width="115px"
      label-position="left"
    >
      <el-form-item :label="$t('storage.device') + 'ID'">
        <el-input v-model="systemInfo.machine_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="总容量">
        <el-input v-model="systemInfo.totalDiskSize" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('storage.maxnumoflogs')">
        <el-input-number
          v-model="systemInfo.maxLogNum"
          :controls="false"
          style="width: 100%; text-align: left"
          :max="1000000000"
        ></el-input-number>
      </el-form-item>
      <!-- <el-form-item :label="'HA' + $t('common.mode')">
        <el-select v-model="systemInfo.UseHAMode" disabled>
          <el-option :label="$t('common.open')" :value="1"></el-option>
          <el-option :label="$t('common.close')" :value="0"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item
        :label="'HA' + $t('storage.partnernode') + 'IP'"
        v-if="systemInfo.UseHAMode != 0"
      >
        <el-select
          v-model="systemInfo.HAPartnerIP"
          @visible-change="getNodesConfig"
          placeholder=" "
          clearable
        >
          <el-option
            v-for="(val, index) in nodesData"
            :key="index"
            :label="val.ip"
            :value="val.ip"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item :label="$t('common.systemdisk')">
        <el-input v-model="systemInfo.disk" readonly></el-input>
      </el-form-item> -->
    </el-form>
    <!-- <div style="width:360px;margin-left:115px;padding-left: 1%;">
      <el-table :data="blockData" border ref="blockData" header-cell-class-name="table-header-row" @selection-change="selectChange" style="width:360px;">
        <el-table-column type="selection"></el-table-column>
        <el-table-column :label="$t('storage.devicename')" prop="name" :formatter="formatvalue"></el-table-column>
        <el-table-column :label="$t('storage.size')" prop="size" :formatter="formatvalue" width="100"></el-table-column>
      </el-table>
    </div> -->
    <!-- 修改密码 -->
    <re-dialog v-model="showChangePwd" :width="500" :before-close="onClose">
      <template #title>修改密码</template>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="onClose">{{
            $t('common.cancel')
          }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="onChangePwd"
            :loading="showPwdLoading"
            >{{ $t('common.confirm') }}</el-button
          >
        </span>
      </template>
      <el-form
        :model="pwdForm"
        ref="pwdForm"
        label-width="100px"
        :rules="pwdRules"
        label-position="left"
        label-suffix=" : "
      >
        <el-form-item label="原始密码" prop="oldPwd" style="width: 100%">
          <el-input
            v-model="pwdForm.oldPwd"
            type="password"
            show-password
            :maxlength="128"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="firstPwd" style="width: 100%">
          <el-input
            v-model="pwdForm.firstPwd"
            type="password"
            show-password
            :maxlength="128"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="secondPwd" style="width: 100%">
          <el-input
            v-model="pwdForm.secondPwd"
            type="password"
            show-password
            :maxlength="128"
          ></el-input>
        </el-form-item>
      </el-form>
    </re-dialog>
  </div>
</template>

<script>
const versions = require('../../../../../package.json')
import { decode } from '@/assets/js/base64.js'
export default {
  name: 'StorageSystem',
  components: {},
  data() {
    return {
      systemInfo: {
        machine_id: null,
        maxLogNum: 0,
        HAPartnerIP: '',
        disk: '',
        systemdisk: [],
      },
      blockData: [],
      tableLoading: false,
      nodesData: [],

      showChangePwd: false,
      pwdForm: {
        oldPwd: '',
        firstPwd: '',
        secondPwd: '',
      },
      pwdRules: {
        oldPwd: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur',
          },
        ],
        firstPwd: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur',
          },
        ],
        secondPwd: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(this.$t('validate.required'))
              if (value !== this.pwdForm.firstPwd) {
                return callback('两次新密码输入不一致')
              }
              return callback()
            },
            trigger: 'blur',
          },
        ],
      },
      showPwdLoading: false,
    }
  },
  mounted() {
    this.getSystemConfig()
    this.getblklist()
  },
  watch: {
    '$route.query.ip'(val) {
      if (val) {
        this.getSystemConfig()
        this.getblklist()
      }
    },
  },
  methods: {
    getSystemConfig() {
      this.$api
        .get('/webapp/get_sysconfig?remote_ip=' + this.$route.query.ip)
        .then((response) => {
          console.log(response)
          if (response.state == 0) {
            this.systemInfo = response.params
            this.systemInfo['machine_id'] = response.machine_id
            this.systemInfo['disk'] = response.params.systemdisk.join(' , ')
          }
        })
    },
    getblklist() {
      this.tableLoading = true
      this.$api
        .get('/webapp/get_blk?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          if (res.state == 0) {
            this.blockData = res.params.list
            this.systemInfo.systemdisk.forEach((item) => {
              let disk = this.blockData.find((data) => {
                return data.name == item
              })
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
    selectChange(val) {
      console.log(val)
      this.systemInfo.systemdisk = []
      val.forEach((item) => {
        this.systemInfo.systemdisk.push(item.name)
      })
      this.systemInfo.disk = this.systemInfo.systemdisk.join(' , ')
    },
    formatvalue(row, column, cellValue) {
      if (!cellValue && cellValue !== 0) {
        return '-'
      }
      return cellValue
    },
    saveConfig() {
      this.$api
        .post(
          '/webapp/set_sysconfig?remote_ip=' + this.$route.query.ip,
          {
            systemdisk: this.systemInfo.systemdisk,
            HAPartnerIP: this.systemInfo.HAPartnerIP,
            maxLogNum: this.systemInfo.maxLogNum,
          },
          true,
        )
        .then((res) => {
          if (res.state == 0) {
            this.getSystemConfig()
            this.getblklist()
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
    },
    getNodesConfig() {
      this.$api
        .get('/webapp/get_clusterconfig')
        .then((response) => {
          if (response.state == 0) {
            this.nodesData = response.params.clusterlist.filter((item) => {
              return item.ip != this.$route.query.ip
            })
          } else {
            this.$message.warning(this.$t('common.errmsg'))
          }
        })
        .catch(() => {
          this.spinning = false
        })
    },
    onShowProver() {
      this.$api
        .get('/webapp/get_version?remote_ip=' + this.$route.query.ip, {}, true)
        .then((res) => {
          if (res.state == 0) {
            this.$messageBox
              .alert(
                '<div class="prover"><div>' +
                  this.$t('common.provernum') +
                  '：</div><div class="indent">' +
                  res.params.shortver.app_version +
                  '</div><div class="indent">' +
                  versions.name +
                  '-' +
                  versions.version +
                  '</div></div>',
                this.$t('common.prover'),
                {
                  dangerouslyUseHTMLString: true,
                  'confirm-button-text': '关闭',
                  'show-cancel-button': false,
                  'custom-class': 'test',
                },
              )
              .then((res) => {
                console.log(res)
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            this.$message.warning(res.message || this.$t('common.errmsg'))
          }
        })
        .catch((err) => {
          this.$message.warning(err.message || this.$t('common.errmsg'))
        })
    },
    onChangePwd() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.$api
            .post('/webapp/edit_user_account', {
              user: decode(localStorage.getItem('token')),
              oldpwd: this.pwdForm.oldPwd,
              newpwd: this.pwdForm.firstPwd,
            })
            .then((res) => {
              if (res.state === 0) {
                this.$message.success(res.message || '修改密码成功')
                this.$refs.pwdForm.resetFields()
                this.showChangePwd = false
              } else {
                this.$message.warning(res.message || this.$t('common.errmsg'))
              }
              this.showPwdLoading = false
            })
            .catch((err) => {
              this.$message.warning(err.message || this.$t('common.errmsg'))
              this.showPwdLoading = false
            })
        }
      })
    },
    onLogout() {
      this.$messageBox
        .confirm(
          '退出登录 - ' + decode(localStorage.getItem('token')),
          this.$t('common.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning',
          },
        )
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
    },
    onClose() {
      this.$refs.pwdForm.resetFields()
      this.showChangePwd = false
    },
  },
}
</script>

<style lang="scss" scoped>
.storage-content {
  padding: 8px 10px;
  .btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
:deep(.el-message-box__content) {
  padding: 0 !important;
}
.system-form {
  margin-top: 10px;
  .el-form-item {
    width: 90%;
    .el-select {
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
.prover {
  .indent {
    padding-left: 6px;
  }
}
</style>
