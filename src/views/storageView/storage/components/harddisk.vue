<template>
  <div class="storage-content">
    <!-- <div class="buttongroups">
      <el-button size="small" @click="setsettings">{{ $t('common.systemsetting') }}</el-button>
    </div> -->
    <div class="maincontents">
      <el-table :data="diskData"  v-loading="spinning" element-loading-text="Loading..." header-cell-class-name="table-header-row" :row-class-name="getRowClassName" row-key="name" :expand-row-keys="expandRowKeys" @expand-change="expandChange" table-layout="auto">
        <el-table-column type="expand">
          <template #default="props">
            <div style="padding: 5px 20px">
              <el-table :data="props.row.dlist" table-layout="auto" header-cell-class-name="table-header-row">
                <el-table-column :label="$t('storage.partname')" prop="name" :formatter="formatvalue"></el-table-column>
                <el-table-column :label="$t('storage.number')" prop="number" :formatter="formatvalue"></el-table-column>
                <el-table-column :label="$t('storage.parttype')" prop="partitiontype" :formatter="formatvalue"></el-table-column>
                <el-table-column :label="$t('storage.disklabeltype')" prop="disklabeltype" :formatter="formatvalue"></el-table-column>
                <el-table-column :label="$t('storage.startcylinder')" prop="start" :formatter="formatvalue"></el-table-column>
                <el-table-column :label="$t('storage.endcylinder')" prop="end" :formatter="formatvalue"></el-table-column>
                <el-table-column :label="$t('storage.size')" prop="size" :formatter="formatvalue"></el-table-column>
                <el-table-column :label="$t('storage.occupiedstatus')" >
                  <template #default="scope">
                    <div v-if="scope.row.occupyname">
                      {{ scope.row.occupyname }}
                    </div>
                    <div v-if="scope.row.occupyname">
                      {{ scope.row.occupycontent }}
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('table.operate')" fixed="right">
                  <template #default="scope">
                    <el-button type="primary"  size="small" :disabled="scope.row.occupyname !== null" @click="removeDiskPart(scope.row)">{{$t('control.delete')}}</el-button>
                    <!-- <el-button size="small" @click="setsettings">{{ $t('common.systemsetting') }}</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('storage.devicename')" prop="name" :formatter="formatvalue"></el-table-column>
        <el-table-column label="PCI" prop="pci"></el-table-column>
        <el-table-column :label="$t('storage.servicelife')" prop="used" :formatter="formatvalue"></el-table-column>
        <el-table-column :label="$t('storage.size')" prop="size" :formatter="formatvalue"></el-table-column>
        <el-table-column :label="$t('storage.model')" prop="model" :formatter="formatvalue"></el-table-column>
        <el-table-column :label="$t('storage.occupiedstatus')">
          <template #default="scope">
            <div v-if="scope.row.occupyname">
              {{ scope.row.occupyname }}
            </div>
            <div v-if="scope.row.occupyname">
              {{ scope.row.occupycontent }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="'S.M.A.R.T. ' + $t('storage.monitor')" prop="SMARTopen">
          <template #default="scope">
            <el-switch v-if="scope.row.SMARTsupport" v-model="scope.row.SMARTopen" @change="changeSmartStatus(scope.row.name,scope.row.SMARTopen)"></el-switch>
            <div v-else>-</div>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('table.operate')" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="createPartition(scope.row)">{{ $t('storage.createpart') }}</el-button>
            <el-button size="small" type="primary" @click="viewsmart(scope.row)">S.M.A.R.T</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 创建分区 -->
      <re-dialog v-model="patitionVisible" :width="350">
        <template #title>
          {{ $t('storage.createpart') + ' ( ' + addDiskPartForm.name + ' )' }}
        </template>
        <template #footer>
          <span class="dialog-footer">
            <el-button size="small" @click="patitionVisible = false" :disabled="sureLoading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary"  size="small" @click="sureCreatePartition" :disabled="sureLoading" :loading="sureLoading">{{ $t('common.confirm') }}</el-button>
          </span>
        </template>
        <el-form :model="addDiskPartForm" ref="addDiskPartForm">
          <el-form-item :label="$t('storage.disklabeltype')" style="width: 100%">
            <el-radio-group v-model="addDiskPartForm.disklabeltype">
              <el-radio label="gpt">gpt</el-radio>
              <el-radio label="mbr">mbr</el-radio>
            </el-radio-group>
          </el-form-item>
          <span style="margin-bottom: 10px;color: #c53838;margin-top:-18px;font-size: 12px;width:100%;">* 修改磁盘标签类型将导致原有分区被删除</span>
          <el-form-item :label="$t('storage.parttype')" v-show="addDiskPartForm.disklabeltype == 'mbr'"  style="width: 100%">
            <el-select v-model="addDiskPartForm.partitiontype" style="width: 100%">
              <el-option v-for="item in partitionTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('storage.startcylinder')" style="width: 100%">
            <InputSelect v-model="addDiskPartForm.start" percent></InputSelect>
          </el-form-item>
          <el-form-item :label="$t('storage.endcylinder')" style="width: 100%">
            <InputSelect v-model="addDiskPartForm.end" percent></InputSelect>
          </el-form-item>
        </el-form>
      </re-dialog>
      <re-dialog v-model="smart.visible" :width="1000">
        <template #title>{{ 'S.M.A.R.T.' + ' ( ' + smart.currentdisk.name + ' )'}}</template>
        <el-tabs v-model="activeName" type="card" @tab-change="handleClick">
          <el-tab-pane :label="$t('storage.attributes')" name="attributes" v-if="smart.currentdisk.SMARTopen"></el-tab-pane>
          <el-tab-pane :label="$t('storage.errlog')" name="errlog" v-if="smart.currentdisk.SMARTopen"></el-tab-pane>
          <el-tab-pane :label="$t('storage.selftest')" name="selftest" v-if="smart.currentdisk.SMARTopen && !smart.currentdisk.model.match('nvme')"></el-tab-pane>
          <el-tab-pane :label="$t('storage.extendedinfo')" name="info"></el-tab-pane>
        </el-tabs>
        <div v-show="activeName == 'attributes'" class="smart-content">
          <el-form>
            <el-form-item :label="$t('storage.healthstatus')">{{ smart.healthstatus }}</el-form-item>
          </el-form>
          <el-divider style="margin: 0px 0px 15px"></el-divider>
          <el-table :data="smart.attributes" table-layout="auto" header-cell-class-name="table-header-row">
            <el-table-column>
              <template #default="scope">
                <div class="status-point" :class="scope.row.status" :title="scope.row.status == 'Normal' ? $t('common.normal') : scope.row.status == 'Warning' ? $t('common.warning') : $t('common.failed')"></div>
              </template>
            </el-table-column>
            <el-table-column label="ID" prop="ID" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('common.name')" prop="name" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('common.tag')" prop="flag" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('storage.currentvalue')" prop="value" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('storage.worstvalue')" prop="worst" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('storage.threshold')" prop="thresh" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('common.type')" prop="type" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('storage.updatemode')" prop="update" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('storage.failuretime')" prop="whenfailed" :formatter="formatvalue"></el-table-column>
            <el-table-column :label="$t('storage.rawvalue')" prop="rawvalue" :formatter="formatvalue"></el-table-column>
          </el-table>
        </div>
        <div v-show="activeName == 'info'" class="smart-content">
          <pre class="text-show">{{ smart.info }}</pre>
        </div>
        <div v-show="activeName == 'errlog'" class="smart-content">
          <pre class="text-show">{{ smart.errlog }}</pre>
        </div>
        <div v-show="activeName == 'selftest'" class="smart-content">
          <el-form>
            <el-form-item :label="$t('storage.selftesttype')">
              <el-select v-model="smart.testtype" style="width: 100%">
                <el-option :label="$t('storage.shortselftest')" value="short"></el-option>
                <el-option :label="$t('storage.longselftest')" value="long"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-divider style="margin: 0px 0px 15px"></el-divider>
          <pre class="text-show">{{ smart.testlog }}</pre>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button size="small" type="primary" v-show="activeName == 'selftest'" @click="startSelfTest" :disabled="sureLoading || smart.teststatus" :loading="smart.teststatus">{{ $t('common.start') }}</el-button>
            <el-button size="small" type="primary" v-show="activeName == 'selftest'" @click="stopSelfTest" :disabled="sureLoading || !smart.teststatus">{{ $t('common.stop') }}</el-button>
            <el-button size="small" @click="smart.visible = false" :disabled="sureLoading">{{ $t('common.close') }}</el-button>
          </span>
        </template>
      </re-dialog>
      <re-dialog v-model="systemsettings.visible" :width="1000">
        <template #title>{{ $t('common.systemsetting') }}</template>
        <el-table :data="diskData"  v-loading="spinning" element-loading-text="Loading..." header-cell-class-name="table-header-row" :row-class-name="getRowClassName" row-key="name"  table-layout="auto">
          <el-table-column :label="$t('storage.devicename')" prop="name" :formatter="formatvalue"></el-table-column>
          <el-table-column :label="$t('storage.servicelife')" prop="used" :formatter="formatvalue"></el-table-column>
          <el-table-column :label="$t('storage.size')" prop="size" :formatter="formatvalue"></el-table-column>
          <el-table-column :label="$t('storage.model')" prop="model" :formatter="formatvalue"></el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button size="small" type="primary" v-show="activeName == 'selftest'" @click="stopSelfTest">{{ $t('common.confirm') }}</el-button>
            <el-button size="small" @click="systemsettings.visible = false" :disabled="sureLoading">{{ $t('common.close') }}</el-button>
          </span>
        </template>
      </re-dialog>
    </div>
  </div>
</template>

<script>
import InputSelect from '@/common/inputselect.vue'
export default {
  name: 'HardDisk',
  components: {
    InputSelect
  },
  data(){
    return{
      spinning: false,
      sureLoading: false,
      diskData: [],
      expandRowKeys: [],
      bufTimer: null,
      patitionVisible: false,
      addDiskPartForm: {
        disklabeltype: "gpt",
        partitiontype: "primary",
        start: '1M',
        end: '1G',
        name: null,
      },
      partitionTypeList: [
        {
          value: "primary",
          label: this.$t('storage.pripart'),
        },
        {
          value: "extended",
          label: this.$t('storage.extpart'),
        },
        {
          value: "logical",
          label: this.$t('storage.logpart'),
        },
      ],
      //smart信息
      activeName: '',
      smart: {
        visible: false,
        currentdisk: null,
        info: null,
        attributes: [],
        errlog: null,
        testtype: 'short',
        teststatus: false,
        testlog: null,
        healthstatus: null,
      },
      systemsettings: {
        visible: false,
        systemdisk: [],
      }
    }
  },
  watch:{
    '$route.query.ip'(val){
      if (val) this.getDiskDeviceList()
    }
  },
  mounted(){
    this.getDiskDeviceList()
  },
  unmounted(){
    clearInterval(this.bufTimer);
    this.bufTimer = null;
  },
  methods:{
    expandChange(row,expandrow){
      let expand = [];
      expandrow.forEach(item => {
        expand.push(item.name);
      })
      this.expandRowKeys = expand;
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
    getRowClassName({row}) {
      if (row.dlist.length == 0) {
        return 'row-expand-cover'
      }
    },
    formatvalue(row, column, cellValue){
      if (!cellValue && cellValue !== 0) {
        return '-'
      }
      return cellValue
    },
    //获取硬盘列表
    getDiskDeviceList() {
      this.spinning = true;
      this.$api.get("/webapp/get_diskdevice?remote_ip=" + this.$route.query.ip).then((response) => {
        this.setTimering(response, "get_diskdevice", (res) => {
          this.spinning = false;
            if (res.state == 0) {
              this.diskData = res.params.list
              this.diskData.forEach(item => {
                let index = this.expandRowKeys.indexOf(item.name);
                if (index != -1 && item.dlist.length == 0) {
                  this.expandRowKeys.splice(index)
                }
              })
            } else {
              this.$message.warning(this.$t('common.errmsg'))
            }
          });
        }).catch(() => {
          this.spinning = false;
        });
    },
    createPartition(row){
      this.patitionVisible = true;
      this.addDiskPartForm = {
        disklabeltype: "gpt",
        partitiontype: "primary",
        start: '0%',
        end: '100%',
        name: row.name,
      }
    },
    sureCreatePartition(){
      this.$api.post("/webapp/create_diskpart?remote_ip=" + this.$route.query.ip, this.addDiskPartForm).then((response) => {
        this.setTimering(response, "create_diskpart", (res) => {
          this.sureLoading = false;
          if (res.state == 0) {
            this.patitionVisible = false;
            this.getDiskDeviceList();
            this.$message.success(res.message);
          } else {
            this.$message.warning({
              message: (
                <div
                  class="warning-message"
                  
                >
                  {res.message ? res.message : this.$t('common.errmsg')}
                </div>
              ),
            });
          }
        });
      }).catch(() => {
        this.$message.warning(this.$t('common.errmsg'))
      });
    },
    removeDiskPart(row) {
      this.$messageBox.confirm(
        this.$t('storage.delpart') + ' - ' + row.name ,
        this.$t('common.warning'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.spinning = true;
        this.$api.deletes("/webapp/delete_diskpart?remote_ip=" + this.$route.query.ip, { name: row.name }).then((response) => {
          this.setTimering(response, "delete_diskpart", (res) => {
            this.spinning = false;
            if (res.state == 0) {
              this.getDiskDeviceList();
              this.$message.success(res.message);
            } else {
              this.$message.warning({
                message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
              });
            }
          });
        }).catch(() => {
          this.spinning = false;
          this.$message.warning(this.$t('common.errmsg'));
        });
      })
    },
    viewsmart(row){
      this.activeName = ''
      this.smart = {
        visible: true,
        info: null,
        currentdisk: row,
        attributes: [],
        errlog: null,
        testtype: 'short',
        teststatus: false,
        testlog: null,
        healthstatus: null,
      }
      this.$api.get("/webapp/get_disk_smart_support_info?remote_ip=" + this.$route.query.ip, { name: row.name }).then((response) => {
        this.setTimering(response, "get_disk_smart_support_info", async (res) => {
          if (res.state == 0) {
            this.smart.currentdisk["SMARTopen"] = res.params.SMARTopen;
            if (res.params.SMARTsupport) {
              this.changeSmartStatus(row.name, true)
            } else {
              this.activeName = 'info'
            }
          }
        })
      })
    },
    handleClick(){
      if (this.activeName == 'attributes') {
        this.getSmartAttr();
      } else if (this.activeName == 'info') {
        this.getSmartInfo();
      } else if (this.activeName == 'errlog') {
        this.getSmartErrLog();
      } else if (this.activeName == 'selftest') {
        this.getSelfTestProgress();
      }
    },
    //smart 属性
    getSmartAttr(){
      let querydata = {
        name: this.smart.currentdisk.name,
        model: this.smart.currentdisk.model,
      }
      this.$api.get("/webapp/get_disk_smart_health_status?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
        this.setTimering(response, "get_disk_smart_health_status", (res) => {
          this.smart.healthstatus = res.params.status;
          this.$api.get("/webapp/get_disk_smart_attributes?remote_ip=" + this.$route.query.ip, querydata).then((response) => {
            this.setTimering(response, "get_disk_smart_attributes", (res) => {
              this.smart.attributes = res.params.list;
            })
          })
        })
      })
      
    },
    // smart 信息
    getSmartInfo(){
      this.$api.get("/webapp/get_disk_smart_log?remote_ip=" + this.$route.query.ip, { name: this.smart.currentdisk.name }).then((response) => {
        this.setTimering(response, "get_disk_smart_log", (res) => {
          this.smart.info = res.params['smart-log'];
        })
      })
    },
    //smart 错误日志
    getSmartErrLog(){
      this.$api.get("/webapp/get_disk_smart_errorlog?remote_ip=" + this.$route.query.ip, { name: this.smart.currentdisk.name }).then((response) => {
        this.setTimering(response, "get_disk_smart_errorlog", (res) => {
          this.smart.errlog = res.params.errorlog;
        })
      })
    },
    //启停smart
    changeSmartStatus(name, val){
      let querydata = {
        name: name,
        smart: val ? 'on' : 'off',
      }
      this.$api.post("/webapp/control_disk_smart?remote_ip=" + this.$route.query.ip, querydata).then(response => {
        this.setTimering(response, "control_disk_smart", (res) => {
          if (res.state == 0){
            this.$message.success(res.message)
            this.activeName = 'info'
          }else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            })
          }
        })
      })
    },
    //自测
    startSelfTest(){
      this.$api.post("/webapp/start_disk_smart_selftest?remote_ip=" + this.$route.query.ip, { name: this.smart.currentdisk.name, type: this.smart.testtype }).then((response) => {
        this.setTimering(response, "start_disk_smart_selftest", (res) => {
          if (res.state == 0) {
            this.getSelfTestProgress();
          }else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        })
      })
    },
    stopSelfTest(){
      this.$api.post("/webapp/stop_disk_smart_selftest?remote_ip=" + this.$route.query.ip, { name: this.smart.currentdisk.name }).then((response) => {
        this.setTimering(response, "stop_disk_smart_selftest", (res) => {
          if (res.state == 0) {
            this.smart.teststatus = false;
          }else {
            this.$message.warning({
              message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
            });
          }
        })
      })
    },
    getSelfTestProgress(){
      this.$api.get("/webapp/get_disk_smart_selftest_progress?remote_ip=" + this.$route.query.ip, { name: this.smart.currentdisk.name }).then((response) => {
        this.setTimering(response, "get_disk_smart_selftest_progress", (res) => {
          if (res.state == 0) {
            this.smart.teststatus = res.params.isrunning;
            if (this.smart.teststatus) {
              this.getSelfTestProgress();
            }else {
              this.getSelfTestResult();
            }
          }
        })
      })
    },
    getSelfTestResult(){
      this.$api.get("/webapp/get_disk_smart_selftest_result?remote_ip=" + this.$route.query.ip, { name: this.smart.currentdisk.name }).then((response) => {
        this.setTimering(response, "get_disk_smart_selftest_result", (res) => {
          if (res.state == 0) {
            this.smart.testlog = res.params.testlog;
          }
        })
      })
    },
    setsettings(){
      this.systemsettings.visible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.buttongroups{
  padding: 8px 10px;
  box-sizing: border-box;
}
.el-table--fit{
  border: 1px solid;
}
:deep(.row-expand-cover .el-table__expand-icon) {
  visibility: hidden;
}
.text-show{
  font-size: 15px;
  margin: 0;
}
.smart-content{
  height: 450px;
  overflow: auto;
  .status-point{
    width: 16px;
    height: 16px;
    border-radius: 8px;
    cursor: pointer;
  }
  .Normal{
    background: #0ebd26;
  }
  .Warning{
    background: #f3d008;
  }
  .Failed{
    background: #f30808;
  }
}
</style>
