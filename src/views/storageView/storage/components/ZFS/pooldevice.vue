<template>
  <div>
    <el-table :data="deviceData"  table-layout="auto" row-key="disk" header-cell-class-name="table-header-row">
      <el-table-column :label="$t('common.type')" prop="tag" show-overflow-tooltip></el-table-column>
      <el-table-column :label="$t('common.level')" prop="level" show-overflow-tooltip></el-table-column>
      <el-table-column :label="$t('common.disks')" prop="disk" show-overflow-tooltip></el-table-column>
      <el-table-column :label="$t('common.status')" prop="state" show-overflow-tooltip></el-table-column>
      <el-table-column :label="$t('storage.size')" prop="size" show-overflow-tooltip></el-table-column>
      <el-table-column :label="$t('table.operate')" fixed="right">
        <template #default="scope">
          <el-dropdown trigger="click" @command="moreOperate">
            <el-button size="small" link>
              {{ $t('common.more') }}
              <el-icon style="margin-left: 3px"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{ event: replaceDisk, row: scope.row }" v-if="!scope.row.children && scope.row.tag != 'spare' && scope.row.tag != 'cache'">{{ $t('storage.replacedisk') }}</el-dropdown-item>
                <el-dropdown-item :command="{ event: onlineDisk, row: scope.row }" v-if="!scope.row.children && scope.row.tag != 'spare'">{{ $t('storage.online') }}</el-dropdown-item>
                <el-dropdown-item :command="{ event: offlineDisk, row: scope.row }" v-if="!scope.row.children && scope.row.tag != 'spare'">{{ $t('storage.offline') }}</el-dropdown-item>
                <el-dropdown-item :command="{ event: addMirrorDisk, row: scope.row }" v-if="!scope.row.children && scope.row.level != 'spare' && scope.row.tag != 'spare' && scope.row.tag != 'cache'">{{ $t('storage.addmirdisk') }}</el-dropdown-item>
                <el-dropdown-item :command="{ event: removeMirrorDisk, row: scope.row }" v-if="!scope.row.children && scope.row.level == 'RAID1'">{{ $t('control.delete') }}</el-dropdown-item>
                <el-dropdown-item :command="{ event: removeDisk, row: scope.row }"  v-if="!(!scope.row.children && scope.row.level == 'RAID1')">{{ $t('control.delete') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <re-dialog v-model="diskVisible" :width=430>
      <template #title>
        {{ (visibleType == 0 ? $t('storage.replacedisk') : $t('storage.addmirdisk') ) + ' ( ' + diskForm.olddisk + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="diskVisible = false" :disabled="sureLoading">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary"  size="small" @click="sure" :loading="sureLoading" :disabled="sureLoading || !diskForm.device">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
      <el-form :model="diskForm" ref="diskForm" label-position="left">
        <el-form-item :label="$t('common.name')" style="width: 100%" prop="name">
          <el-table size="small" v-loading="tableLoading" element-loading-text="Loading..." :data="tableFilter([...blockData,...diskpartData])" highlight-current-row @current-change="handleCurrentChange" header-cell-class-name="table-header-row" max-height="260px">
            <el-table-column width="40px">
              <template #default="scope">
                <el-radio v-model="diskForm.device" :label="scope.row.name"></el-radio>
              </template>
            </el-table-column>
            <el-table-column :label="$t('storage.devicename')" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('storage.size')" prop="size" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </re-dialog>
    <!-- 脱机 -->
    <re-dialog v-model="offlineVisible" :width=300>
      <template #title>
        {{ $t('storage.offline')  + ' ( ' + offlineForm.disk + ' )' }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="offlineVisible = false" :disabled="sureLoading">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary"  size="small" @click="sureOfflineDisk" :loading="sureLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
      <el-form :model="offlineForm" ref="offlineForm" label-position="left">
        <el-form-item :label="$t('storage.temporary')" style="width: 100%" prop="temporary">
          <el-checkbox v-model="offlineForm.temporary"></el-checkbox>
        </el-form-item>
      </el-form>
    </re-dialog>
  </div>
</template>

<script>
import { ArrowDown } from '@element-plus/icons-vue'
export default {
  name: 'PoolDevice',
  emits: ['updatedata'],
  components: {
    ArrowDown
  },
  props: {
    deviceData: Array,
    poolname: String,
  },
  data(){
    return{
      bufTimer: null,
      sureLoading: false,
      tableLoading: false,
      diskVisible: false,
      visibleType: 0, //0 替换盘 1 新增镜像盘
      diskpartData: [],
      blockData: [],
      diskForm: {
        olddisk: null,
        name: null,
        device: null,
      },
      currentRow: null,
      offlineVisible: false,
      offlineForm: {
        disk: null,
        temporary: true,
      }
    }
  },
  mounted(){
  },
  unmounted(){
    clearInterval(this.bufTimer);
    this.bufTimer = null;
  },
  methods:{
    handleCurrentChange(val){
      if (val) this.diskForm.device = val.name;
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
    tableFilter(arr) {
      let newArr = arr.filter((item) => item.occupyname === null);
      if (!this.visibleType && this.currentRow.tag == 'data') {
        let spare = this.deviceData.filter((item) => item.tag === 'spare' && item.state === 'AVAIL');
        newArr = [...newArr, ...spare];
      }
      return newArr;
    },
    getblklist() {
      this.tableLoading = true;
      this.$api.get("/webapp/get_blk_raw?remote_ip=" + this.$route.query.ip).then((response) => {
        this.setTimering(response, "get_blk_raw", (res) => {
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
    replaceDisk(row){
      this.diskForm = {
        olddisk: row.disk,
        name: this.poolname,
        device: null,
      };
      this.diskVisible = true;
      this.visibleType = 0;
      this.currentRow = row;
      this.getblklist();
    },
    addMirrorDisk(row){
      this.diskForm = {
        olddisk: row.disk,
        name: this.poolname,
        device: null,
      };
      this.diskVisible = true;
      this.visibleType = 1;
      this.currentRow = row;
      this.getblklist();
    },
    sure(){
      let type = this.visibleType == 0 ? "repalce_zfs_pool_device" : "add_zfs_pool_mirror_disk";
      let querydata = {
        olddisk: this.diskForm.olddisk,
        name: this.diskForm.name,
        newdisk: this.diskForm.device,
      };
      this.sureLoading = true;
      this.$api.post("/webapp/" + type + "?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
        this.setTimering(response, type, (res) => {
          this.sureLoading = false;
          if (res.state == 0) {
            this.diskVisible = false;
            this.$emit('updatedata', true);
            this.$message.success(res.message);
          } else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        });
      }).catch(() => {
        this.$message.warning(this.$t('common.errmsg'));
        this.sureLoading = false;
      });
    },
    removeDisk(row){
      this.$messageBox.confirm(
        this.$t('storage.deldisk') + ' - ' + (row.disk ? row.disk : row.groupid) ,
        this.$t('common.warning'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        }
      ).then(() => {
        let querydata;
        if (row.children) {
          querydata = {
            name: this.poolname,
            device: [],
            groupid: row.groupid,
          };
          this.recursionForDevice(row.children, querydata);
        } else {
          querydata = {
            name: this.poolname,
            disk: row.disk,
          };
        }
        this.$api.deletes("/webapp/delete_zfs_pool_disk?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
          this.setTimering(response, "delete_zfs_pool_disk", (res) => {
            if (res.state == 0) {
              this.$emit('updatedata', true);
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
    recursionForDevice(device, querydata){
      device.forEach((item) => {
        if (item.children) {
         this.recursionForDevice(item.children, querydata)
        } else {
          querydata.device.push(item.disk);
        }
      });
    },
    removeMirrorDisk(row){
      this.$messageBox.confirm(
        this.$t('storage.delmirdisk') + ' - ' + (row.disk ? row.disk : row.groupid) ,
        this.$t('common.warning'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        }
      ).then(() => {
        let querydata = {
          name: this.poolname,
          disk: row.disk,
        };
        this.$api.deletes("/webapp/delete_zfs_pool_mirror_disk?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
          this.setTimering(response, "delete_zfs_pool_mirror_disk", (res) => {
            if (res.state == 0) {
              this.$emit('updatedata', true);
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
    offlineDisk(row){
      this.offlineVisible = true;
      this.offlineForm = {
        disk: row.disk,
        temporary: true
      }
    },
    sureOfflineDisk(){
      let querydata = {
          name: this.poolname,
          disk: this.offlineForm.disk,
          temporary: this.offlineForm.temporary ? 1 : 0,
        };
        this.sureLoading = true;
        this.$api.put("/webapp/offline_zfs_pool_disk?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
          this.setTimering(response, "offline_zfs_pool_disk", (res) => {
            this.sureLoading = false;
            if (res.state == 0) {
              this.offlineVisible = false,
              this.$emit('updatedata', true);
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
    },
    onlineDisk(row){
        this.$messageBox.confirm(
        this.$t('storage.online') + ' - ' + row.disk,
        this.$t('common.tips'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'info',
        }
      ).then(() => {
        let querydata = {
          name: this.poolname,
          disk: row.disk,
        };
        this.$api.put("/webapp/online_zfs_pool_disk?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
          this.setTimering(response, "online_zfs_pool_disk", (res) => {
            if (res.state == 0) {
              this.$emit('updatedata', true);
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
    moreOperate(com){
      com.event(com.row);
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table--fit{
  border: 1px solid;
}
</style>
