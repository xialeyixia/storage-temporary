<template>
  <div class="block">
    <el-button color="#579cdc" style="color: #fff;" type="primary" size="small" @click="createNbdDServer">{{$t('storage.create')}}</el-button>
    <div class="maincontents">
      <el-table :data="serverData"  v-loading="spinning" element-loading-text="Loading..." table-layout="auto" header-cell-class-name="table-header-row">
        <el-table-column :label="$t('common.name')" prop="name"></el-table-column>
        <el-table-column :label="$t('storage.device')" prop="path"></el-table-column>
        <el-table-column :label="$t('storage.protocol')" prop="protocol"></el-table-column>
        <el-table-column :label="$t('table.operate')">
          <template #default="scope">
            <el-button size="small" @click="removeNbdServer(scope.row)" type="primary">{{$t('control.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <re-dialog v-model="serverVisible" :width="400">
      <template #title>
        {{$t('storage.create') + ' iSCSI' + $t('storage.server')}}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="serverVisible = false" :disabled="sureLoading">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary"  size="small" @click="sureAddNbdServer" :disabled="sureLoading || !serverForm.name" :loading="sureLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
      <div style="width: 100%">
        <div style="margin-bottom: 10px">{{$t('common.choosedevice') + " :"}}</div>
        <el-table v-loading="tableLoading" element-loading-text="Loading..." :data="tableFilter([...blockData,...diskpartData])" header-cell-class-name="table-header-row" highlight-current-row @current-change="handleCurrentChange" max-height="260px">
          <el-table-column width="40px">
            <template #default="scope">
              <el-radio v-model="serverForm.name" :label="scope.row.name"></el-radio>
            </template>
          </el-table-column>
          <el-table-column :label="$t('storage.devicename')" prop="name"></el-table-column>
          <el-table-column :label="$t('storage.size')" prop="size"></el-table-column>
        </el-table>
      </div>
    </re-dialog>
  </div>
</template>

<script>
export default {
  name: 'iSCSIServer',
  components: {
  },
  data(){
    return{
      serverData: [],
      bufTimer: null,
      spinning: false,
      sureLoading: false,
      tableLoading: false,
      serverVisible: false,
      serverForm: {
        protocol: 'iSCSI',
        name: null
      },
      blockData: [],
      diskpartData: [],
    }
  },
  watch:{
    '$route.query.ip'(val){
      if (val) this.getNbdServerList()
    }
  },
  mounted(){
    this.getNbdServerList();
  },
  unmounted(){
    clearInterval(this.bufTimer);
    this.bufTimer = null;
  },
  methods:{
    tableFilter(arr) {
      let newArr = arr.filter((item) => item.occupyname === null);
      return newArr;
    },
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
    getNbdServerList() {
      this.spinning = true;
      this.$api.get("/webapp/get_server_nbd?remote_ip=" + this.$route.query.ip).then((response) => {
        this.setTimering(response, "get_server_nbd", (res) => {
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
    createNbdDServer(){
      this.serverVisible = true;
      this.serverForm = {
        protocol: 'iSCSI',
        name: null
      },
      this.blockData = [];
      this.diskpartData = [];
      this.getblklist();
    },
    sureAddNbdServer() {
      this.sureLoading = true;
      this.$api.post("/webapp/set_server_nbd?remote_ip=" + this.$route.query.ip, this.serverForm).then((response) => {
        this.setTimering(response, "set_server_nbd", (res) => {
          this.sureLoading = false;
          if (res.state == 0) {
            this.serverVisible = false;
            this.getNbdServerList();
            this.$message.success(res.message);
          } else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        });
      });
    },
    removeNbdServer(row) {
      this.$messageBox.confirm(
        this.$t('control.delete') + ' iSCSI ' + this.$t('storage.server') + ' - ' + row.name ,
        this.$t('common.warning'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.spinning = true;
        this.$api.deletes("/webapp/delete_server_nbd?remote_ip=" + this.$route.query.ip, row).then((response) => {
          this.setTimering(response, "delete_server_nbd", (res) => {
            this.spinning = false;
            if (res.state == 0) {
              this.getNbdServerList();
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
    getblklist() {
      this.tableLoading = true;
      this.$api.get("/webapp/get_blk?remote_ip=" + this.$route.query.ip).then((response) => {
        this.setTimering(response, "get_blk", (res) => {
          this.getDiskPart();
          if (res.state == 0) {
            this.blockData = res.params.list;
          } else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        });
      }).catch(() => {
        this.tableLoading = false;
      });
    },
    getDiskPart() {
      this.$api.get("/webapp/get_diskpart?remote_ip=" + this.$route.query.ip).then((response) => {
        this.setTimering(response, "get_diskpart", (res) => {
          this.tableLoading = false;
          if (res.state == 0) {
            this.diskpartData = res.params.list;
          } else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        });
      }).catch(() => {
        this.tableLoading = false;
      });
    },
    handleCurrentChange(val){
      if (val) this.serverForm.name = val.name;
    },
  }
}
</script>

<style lang="scss" scoped>
.block{
  text-align: left;
  height: 100%;
}
.el-table--fit{
  border: 1px solid;
}
.maincontents{
  overflow: auto;
  height: calc(100% - 45px);
  box-sizing: border-box;
  margin-top: 8px;
}
</style>
