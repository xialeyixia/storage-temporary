<template>
  <div class="storage-content">
    <el-button color="#579cdc" style="color: #fff;" type="primary" size="small" @click="createNFSServer">{{ $t('storage.create') }}</el-button>
    <el-button color="#579cdc" style="color: #fff;" type="primary" size="small" @click="createNFSClient">{{ $t('storage.mountclient') }}</el-button>
    <div class="maincontents">
      <el-table :data="serverData" v-loading="spinning" element-loading-text="Loading..." table-layout="auto" header-cell-class-name="table-header-row">
        <el-table-column :label="$t('storage.path')" prop="path" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('storage.protocol')" prop="protocol" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('table.operate')" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="removeNFServer(scope.row)">{{$t('control.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <re-dialog v-model="serverVisible" :width="500">
      <template #title>
        {{$t('storage.create') + ' NAS' + $t('storage.server')}}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="serverVisible = false" :disabled="sureLoading">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary"  size="small" @click="sureaddNFSserver" :disabled="sureLoading || !serverForm.path" :loading="sureLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
      <div style="width: 100%">
        <el-form :model="serverForm" ref="serverForm" label-width="75px"  label-position="left" label-suffix=" : ">
          <el-form-item :label="$t('storage.protocol')" style="width: 100%" prop="protocol">
            <el-radio-group v-model="serverForm.protocol">
              <el-radio label="NFSv3"></el-radio>
              <el-radio label="SMB"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注解" v-if="serverForm.protocol === 'SMB'">
            <el-input v-model="serverForm.comment" type="text" :maxlength="128"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px">{{ $t('common.choosedevice') + " :" }}</div>
        <el-table v-loading="tableLoading" element-loading-text="Loading..." :data="tableFilter(fileSystemData)" highlight-current-row header-cell-class-name="table-header-row" @current-change="handleCurrentChange" max-height="260px" table-layout="auto">
          <el-table-column width="40px">
            <template #default="scope">
              <el-radio v-model="serverForm.path" :label="scope.row.mounton"></el-radio>
            </template>
          </el-table-column>
          <el-table-column :label="$t('storage.filesystem')" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$t('storage.fstype')" prop="fstype" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$t('storage.mounton')" prop="mounton" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </re-dialog>
    <!-- 客户端挂载 -->
    <re-dialog v-model="clientVisible" :width="500">
      <template #title>
        {{$t('storage.mountnasclient')}}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="clientVisible = false" :disabled="sureLoading">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary"  size="small" @click="sureMountNFSClient" :disabled="sureLoading || !clientForm.path" :loading="sureLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
      <el-form :model="clientForm" ref="clientForm" label-width="75px" :rules="clientRules" label-position="left" label-suffix=" : ">
        <el-form-item :label="$t('storage.protocol')" style="width: 100%" prop="protocol">
          <el-radio-group v-model="clientForm.protocol" @change="onChangeProtocol">
            <el-radio label="NFS"></el-radio>
            <el-radio label="SMB"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.username')" prop="user" v-if="clientForm.protocol == 'SMB'">
          <el-input v-model="clientForm.user" :maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password"  v-if="clientForm.protocol == 'SMB'">
          <el-input v-model="clientForm.password" type="password" show-password :maxlength="128"></el-input>
        </el-form-item>
        <span v-show="clientForm.protocol == 'SMB'" style="margin-bottom: 10px;color: #c53838;margin-top:-18px;font-size: 12px;width:100%;">* 若服务端未配置(map to guest = Bad User;)，则只能使用 Samba 用户访问，不允许匿名访问。</span>
        <el-form-item :label="$t('storage.mounton')" style="width: 100%" prop="mounton">
          <el-input v-model="clientForm.mounton" :maxlength="128"></el-input>
        </el-form-item>
        <el-form-item label="IP" style="width: 100%" prop="ip">
          <el-input v-model="clientForm.ip" :maxlength="30">
            <template #append>
              <el-button :loading="tableLoading" @click="onSearchNFSClient"><el-icon v-show="!tableLoading"><Search /></el-icon> </el-button>
            </template>
          </el-input>
        </el-form-item>
        <div style="width: 100%">
          <div style="margin-bottom: 10px">{{ $t('common.choosedevice') + " : " }}</div>
          <el-table v-loading="tableLoading" element-loading-text="Loading..." :data="searchData" highlight-current-row @current-change="handleCurrentChange" max-height="260px" header-cell-class-name="table-header-row">
            <el-table-column :label="$t('storage.path')" prop="path" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="clientForm.protocol == 'SMB'" label="comment" prop="comment" show-overflow-tooltip />
          </el-table>
          <el-checkbox v-model="clientForm.automount" class="checkbox">{{$t('storage.automount')}}</el-checkbox>
        </div>
      </el-form>
    </re-dialog> 
  </div>
</template>

<script>
import { checkIP, checkPath } from "@/assets/js/setting.js";
import { Search } from '@element-plus/icons-vue'
import { encode } from '@/assets/js/base64.js'
export default {
  name: 'NAS',
  components: {
    Search
  },
  data(){
    return{
      bufTimer: null,
      serverData: [],
      fileSystemData: [],
      spinning: false,
      sureLoading: false,
      tableLoading: false,
      serverVisible: false,
      serverForm: {
        protocol: "NFSv3",
        comment: "jingjiamicro.samba",
        path: null
      },
      clientVisible: false,
      clientForm: {
        protocol: "NFS",
        mounton: null,
        ip: null,
        automount: true,
        path: null,
        user: "storage",
        password: "123123"
      },
      clientRules: {
        ip: [{ required: true, validator: checkIP, trigger: 'blur' }],
        mounton: [{ required: true, validator: checkPath, trigger: 'blur' }],
        user: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
      },
      searchData:[]
    }
  },
  mounted(){
    this.getNFSserverlist();
  },
  watch:{
    '$route.query.ip'(val){
      if (val) this.getNFSserverlist()
    }
  },
  unmounted(){
    clearInterval(this.bufTimer);
    this.bufTimer = null;
  },
  methods:{
    setTimering(response, task, callback) {
      if (response.state == 1001) {
        clearInterval(this.bufTimer);
        this.bufTimer = null;
        this.bufTimer = setInterval(() => {
          this.$api.get("/webapp/get_buf?remote_ip=" + this.$route.query.ip, { method: task }).then((res) => {
            if (res.state != 1001) {
              clearInterval(this.bufTimer);
              this.bufTimer = null;
              callback(res);
            }
          }).catch(() => {
            clearInterval(this.bufTimer);
            this.bufTimer = null;
          });
        }, 50);
      } else {
        this.$message.warning(this.$t('common.errmsg'))
      }
    },
    tableFilter(arr) {
      let newArr = arr.filter((item) => item.occupyname === null);
      return newArr;
    },
    getNFSserverlist() {
      this.spinning = true;
      this.$api.get("/webapp/get_server_nas?remote_ip=" + this.$route.query.ip).then((response) => {
        this.setTimering(response, "get_server_nas", (res) => {
          this.spinning = false;
          if (res.state == 0) {
            this.serverData = res.params.list;
          } else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        });
      }).catch(() => {
        this.spinning = false;
      });
    },
    getFSlist() {
      this.tableLoading = true;
      this.$api.get("/webapp/get_fs?remote_ip=" + this.$route.query.ip).then((response) => {
        this.setTimering(response, "get_fs", (res) => {
          this.tableLoading = false;
          if (res.state == 0) {
            this.fileSystemData = res.params.list;
          } else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        });
      })
      .catch(() => {
        this.tableLoading = false;
      });
    },
    createNFSServer() {
      this.getFSlist();
      this.serverVisible = true;
      this.serverForm = {
        protocol: "NFSv3",
        path: null,
      };
    },
    sureaddNFSserver() { 
      let querydata = {
        path: this.serverForm.path,
        protocol: this.serverForm.protocol
      }
      if (this.serverForm.protocol === 'SMB') {
        querydata.comment = this.serverForm.comment || ''
      }
      this.sureLoading = true;
      this.$api.post("/webapp/set_server_nas?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
        this.setTimering(response, "set_server_nas", (res) => {
          this.sureLoading = false;
          if (res.state == 0) {
            this.serverVisible = false;
            this.getNFSserverlist();
            this.$message.success(res.message);
          } else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        });
      });
    },
    removeNFServer(row) {
      this.$messageBox.confirm(
        this.$t('control.delete') + ' NFS ' + this.$t('storage.server') + ' - ' + row.path ,
        this.$t('common.warning'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.spinning = true;
        this.$api.deletes("/webapp/delete_server_nas?remote_ip=" + this.$route.query.ip, row).then((response) => {
          this.setTimering(response, "delete_server_nas", (res) => {
            this.spinning = false;
            if (res.state == 0) {
              this.getNFSserverlist();
              this.$message.success(res.message);
            } else {
              this.$message.warning({
                message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
              });
            }
          });
        });
      })
    },
    createNFSClient() {
      this.clientVisible = true;
      this.$refs.clientForm && this.$refs.clientForm.clearValidate()
      this.clientForm = {
        protocol: "NFS",
        user: "storage",
        password: "123123",
        ip: null,
        path: null,
        mounton: null,
        automount: true,
      };
      this.searchData = [];
    },
    onSearchNFSClient() {
      this.$refs.clientForm.validate((valid) => {
        if (valid) {
          this.tableLoading = true;
          let querydata = {
            protocol: this.clientForm.protocol,
            ip: this.clientForm.ip,
          }
          if (this.clientForm.protocol == "SMB") {
            querydata["user"] = encode(this.clientForm.user)
            querydata["password"] = encode(this.clientForm.password)
            querydata['comment'] = 'Home Directories'
          }
          this.$api.get("/webapp/get_remote_nas?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
            this.setTimering(response, "get_remote_nas", (res) => {
              this.tableLoading = false;
              if (res.state == 0) {
                this.searchData = res.params.list;
              } else {
                this.$message.warning({
                  message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
                });
              }
            });
          }).catch(() => {
            this.tableLoading = false;
            this.$message.warning(this.$t('common.errmsg'));
          });
        }
      })
    },
    sureMountNFSClient() {
      this.$refs.clientForm.validate((valid) => {
        if (valid) {
          let querydata = {
            protocol: this.clientForm.protocol,
            path: this.clientForm.path,
            mounton: this.clientForm.mounton,
            ip: this.clientForm.ip,
            automount: this.clientForm.automount ? 1 : 0,
          };
          if (this.clientForm.protocol == "SMB") {
            querydata["user"] = encode(this.clientForm.user)
            querydata["password"] = encode(this.clientForm.password)
          }
          this.sureLoading = true;
          this.$api.post("/webapp/set_client_nas?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
            this.setTimering(response, "set_client_nas", (res) => {
              this.sureLoading = false;
              if (res.state == 0) {
                this.clientVisible = false;
                this.getNFSserverlist();
                this.$message.success(res.message);
              } else {
                this.$message.warning({
                  message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
                });
              }
            });
          }).catch(() => {
            this.sureLoading = false;
            this.$message.warning(this.$t('common.errmsg'));
          });
        }
      })
    },
    handleCurrentChange(val){
      if (val) {
        if (this.serverVisible) this.serverForm.path = val.mounton;
        if (this.clientVisible) this.clientForm.path = val.path;
      }
    },
    onChangeProtocol(val) {
      this.searchData = []
      this.clientForm = {
        protocol: "NFS",
        user: "storage",
        password: "123123",
        ip: null,
        path: null,
        mounton: null,
        automount: true,
      }
      if (val === 'SMB') {
        this.clientForm.protocol = 'SMB'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table--fit{
  border: 1px solid;
}
.storage-content{
  padding: 8px 10px;
  box-sizing: border-box;
}
.maincontents{
  overflow: auto;
  height: calc(100% - 45px);
  box-sizing: border-box;
  margin-top: 8px;
}
</style>
