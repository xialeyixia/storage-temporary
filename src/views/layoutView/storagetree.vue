<template>
  <div class="tree">
    <el-tree
      :data="treeData"
      ref="treeRef"
      node-key="ip"
      :default-expand-all="true"
      :highlight-current="true"
      @node-click="nodeClick"
      :check-on-click-node="false"
      :current-node-key="currentNodeKey"
      :expand-on-click-node="false">
      <template #default="{ data }">
        <div class="custom-tree-node" :style="!data.ip ? 'width: 100%':''" :title="data.ip ? $t('common.status') + '：' + (data.state === 0 ? $t('common.online'): $t('common.offline')) : null">
          <span class="node-icon">
            <svg t="1630546998808" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23407" width="20" height="18"><path d="M752.64 51.2H271.36C204.8 51.2 153.6 102.4 153.6 163.84v691.2C153.6 921.6 204.8 972.8 271.36 972.8h476.16c66.56 0 117.76-51.2 117.76-112.64V163.84C870.4 102.4 819.2 51.2 752.64 51.2zM512 896c-40.96 0-76.8-35.84-76.8-76.8s35.84-76.8 76.8-76.8 76.8 35.84 76.8 76.8-35.84 76.8-76.8 76.8z m256-281.6H256v-102.4h512v102.4z m0-153.6H256V358.4h512v102.4z m0-153.6H256V204.8h512v102.4z" fill="#fff" p-id="23408"></path></svg>
            <svg t="1630545147960" v-if="data.state === 0" style="margin: -2px -5px -2px -11px;vertical-align: bottom;"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6629" width="16" height="16" ><path d="M512 512m-384 0a384 384 0 1 0 768 0 384 384 0 1 0-768 0Z" fill="#24d90e" p-id="6630" data-spm-anchor-id="a313x.7781069.0.i21" class="selected" ></path><path d="M739.84 371.2c-20.48-20.48-52.48-20.48-72.96 0L467.2 572.16l-110.08-110.08c-20.48-20.48-52.48-20.48-72.96 0-20.48 20.48-20.48 52.48 0 72.96L428.8 678.4c10.24 10.24 24.32 15.36 37.12 15.36 14.08 0 26.88-3.84 37.12-15.36l235.52-235.52c21.76-19.2 21.76-52.48 1.28-71.68z" fill="#ffffff" p-id="6631" data-spm-anchor-id="a313x.7781069.0.i22" class="selected" ></path></svg>
          </span>
          <span  class="node-name">{{ data.name + (data.ip ?'(' + data.ip + ')' : '') }}</span>
          <el-button type="primary" v-if="!data.ip" class="sys_conf" size="small" @click="systemConfig">{{ $t('control.configure') + $t('common.node') }}</el-button>
        </div>
      </template>
    </el-tree>
    <re-dialog v-model="sysConfVisible" :width="300">
      <template #title>
        {{ $t('control.configure') + $t('common.node') }}
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" type="primary" @click="addNode" :disabled="sysConfForm.nodeConf.length > 2">{{ $t('control.add') + $t('common.node') }}</el-button>
          <el-button size="small" @click="sysConfVisible = false" :disabled="sureLoading">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary"  size="small" @click="sureConfig" :disabled="sureLoading" :loading="sureLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
      <el-form :model="sysConfForm" ref="sysConfForm" label-width="0" label-position="left">
        <div class="form-title">
          <span>IP</span>
          <!-- <span>设备名称</span> -->
        </div>
        <div v-for="(node, index) in sysConfForm.nodeConf" :key="index" style="width: 100%">
          <el-form-item
            :prop="'nodeConf.' + index + '.ip'"
            :rules="[{ required: true, validator: checkIP, trigger: 'blur' }]"
          >
            <el-input ref="nodeip" v-model="node.ip"  style="width: 70%; margin-right: 2%" ></el-input>
            <el-button @click.prevent="removeNode(index)" type="primary" >{{ $t('control.delete') }}</el-button>
          </el-form-item>
          <!-- <el-form-item
            :prop="'nodeConf.' + index + '.name'"
            :rules="{
              required: true, message: $t('validate.required'), trigger: 'blur'
            }"
          > -->
             <!-- <el-input v-model="node.name" style="width: 65%; margin-right: 2%" :disabled="node.disabled"></el-input> -->
            
          <!-- </el-form-item> -->
        </div>
      </el-form>
    </re-dialog>
  </div>
</template>

<script>
import { checkIP } from "@/assets/js/setting.js";
export default {
  name: 'StorageTree',
  components: {
  },
  data(){
    return{
      treeData:[],
      currentNodeKey: this.$route.query.ip || null,
      bufTimer: null,
      configrefreshTimer: null,
      theme: localStorage.getItem('theme') || 'default',
      sysConfVisible: false,
      sureLoading: false,
      sysConfForm:{
        machine_id: null,
        nodeConf: []
      },
      checkIP: checkIP
    }
  },
  mounted(){
    this.getSystemConfig();
    this.configrefreshTimer = setInterval(() => {
      this.getSystemConfig();
    }, 3000)
  },
  unmounted(){
    clearInterval(this.bufTimer);
    this.bufTimer = null;
    clearInterval(this.configrefreshTimer);
    this.configrefreshTimer = null;
  },
  methods:{
    setTimering(response, task, callback) {
      if (response.state == 1001) {
        clearInterval(this.bufTimer);
        this.bufTimer = null;
        this.bufTimer = setInterval(() => {
          this.$api.get("/webapp/get_buf", { method: task }).then((res) => {
              if (res.state != 1001) {
                clearInterval(this.bufTimer);
                this.bufTimer = null;
                callback(res);
              }
            }).catch(() => {
              clearInterval(this.bufTimer);
              this.bufTimer = null;
            });
        }, 500);
      } else {
        this.$message.warning(this.$t('common.errmsg'))
      }
    },
    getSystemConfig() {
      this.theme = localStorage.getItem('theme') || 'default';
      this.$api.get("/webapp/get_clusterconfig").then((response) => {
        if (response.state == 0) {
          this.treeData = [{
            name: 'cluster',
            children: response.params.clusterlist
          }];
          if (this.currentNodeKey) {
            this.$nextTick(() => {
              this.$refs.treeRef.setCurrentKey(this.currentNodeKey);
            });
          }else {
            this.$nextTick(() => {
              this.currentNodeKey = this.treeData[0].children[0].ip;
              this.$refs.treeRef.setCurrentKey(this.treeData[0].children[0].ip);
              this.$router.push({
                path: '/storage/pool',
                query: {
                  ip: this.treeData[0].children[0].ip,
                }
              })
            });
          }
        } else {
          this.$message.warning(this.$t('common.errmsg'))
        }
      }).catch(() => {
        this.spinning = false;
      });
    },
    nodeClick(node) {
      if (node.ip) {
        this.currentNodeKey = node.ip;
        let path = this.$route.matched.find(item => {
          return item.path == '/storage'
        })
        if (!path) {
          this.$router.push({
            path: '/storage/pool',
            query: {
              ip: node.ip,
            }
          })
        }else {
          this.$router.push({
            query: {
              ip: node.ip,
            }
          })
        }
      }else {
        this.$nextTick(() => {
          this.$refs.treeRef.setCurrentKey(this.currentNodeKey);
        });
      }
    },
    systemConfig() {
      this.sysConfVisible = true;
      this.sysConfForm.nodeConf = this.treeData[0].children;
      this.sysConfForm.machine_id = this.treeData[0].machine_id;
      this.$refs.sysConfForm && this.$refs.sysConfForm.clearValidate();
    },
    sureConfig() {
      let querydata = {
        clusterlist: this.sysConfForm.nodeConf,
      };
      this.$refs.sysConfForm.validate((valid) => {
        if (valid) {
          this.sureLoading = true
          this.$api.post('/webapp/set_clusterconfig', querydata, true).then((res) => {
            this.sureLoading = false
            if (res.state == 0) {
              this.sysConfVisible = false
              this.getSystemConfig()
            }else {
              this.$message.warning({
                message: <div class="warning-message" > {res.message ? res.message : this.$t('common.errmsg')}</div>,
              })
            }
          }).catch((e) => {
            console.error("sureConfig: ",e)
            this.spinning = false;
          })
        }
      })
    },
    removeNode(index) {
      this.sysConfForm.nodeConf.splice(index, 1);
    },
    addNode() {
      this.sysConfForm.nodeConf.push({
        name: null,
        ip: null,
      })
      this.$nextTick(() => {
        this.$refs.nodeip[this.sysConfForm.nodeConf.length - 1].focus()
      })
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.tree{
  overflow: auto;
  width: 100%;
  text-align: right;
}
.node-icon{
  margin: 0 6px 0 -5px;
  svg{
    vertical-align: middle;
  }
}
.node-name{
  vertical-align: middle;
}
.icon-status{
  margin-left: -11px;
  position: relative;
  left: 5px;
  top: 3px
}
.custom-tree-node{
  padding: 0 10px;
  text-align: left;
}
:deep(.el-tree-node){
  min-width: 100%;
  float: left;
}
.sys_conf {
  color: #fff;
  padding: 0 5px;
  margin-left: 10px;
  --el-button-size: 18px
}
.el-form {
  .form-title {
    width: 100%;
    margin-bottom: 8px;
    span {
      display: inline-block;
      width: 70%;
      text-align: center;
      color: #b3b3b3;
    }
  }
  .el-form-item {
    width: 100%;
    display: inline-block;
    box-sizing: border-box;
    margin-bottom: 15px;
  }
}
</style>
