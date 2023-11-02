<template>
  <div class="header">
    <div class="left-block">
      <div class="logo">
        <img src="@/assets/img/logo.png">
      </div>
      <span class="title">TransCube</span>
    </div>
    <div class="right-block">
      <el-button class="monitorscreen" size="small" @click="viewMonitor">
        <el-icon :size="16">
          <svg t="1665303817516" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8675" width="200" height="200"><path d="M764.74 955.37c-5.12 0.38-9.22 0.51-13.18 0.51-161.2 0.12-322.65 0.12-483.84 0.12-13.7 0-13.83-0.13-13.7-13.83v-34.05c0-9.6 3.97-13.57 13.83-13.57 33.67 0 67.47 0.12 101.15 0 14.08-0.13 15.37-1.67 15.37-15.23v-34.06c-0.13-12.68-3.2-15.75-15.75-15.75H60.56c-26.76 0-45.84-11.91-55.44-37.13-2.69-6.91-4.74-14.47-4.74-21.64-0.26-214.97 0-429.93-0.38-644.77 0-24.96 13.44-40.84 32.13-53.13 6.4-4.23 15.62-5.12 23.56-6.15 7.29-1.03 15.1-0.38 22.79-0.38H955.12c21 0 39.56 6.01 52.49 22.66 8.58 11.01 15.75 22.02 15.62 38.53-0.77 213.68-0.51 427.5-0.51 641.18 0 10.5 0 19.84-8.96 28.93-6.28 6.53-9.99 16.65-18.82 21.25-8.2 4.35-17.03 9.86-25.73 10.11-53.65 1.03-107.42 0.51-161.07 0.51-52.37 0.13-104.86 0-157.23 0-12.93 0-13.32 0.38-13.44 13.57-0.13 13.44 0.51 26.89-0.26 40.45-0.64 9.86 4.74 11.27 12.29 11.27 33.29-0.13 66.32-0.13 99.36-0.13 14.47 0 15.87 1.54 15.75 15.62 0.13 14.63 0.13 29.23 0.13 45.11zM63.51 128.28c-0.38 6.53-1.03 11.65-1.03 16.9-0.12 45.71 0 91.29 0 137.12v341.33c0 17.03 0 16.9 17.03 16.9h863.58c13.7 0 16.64-2.69 16.64-16.52V142.74c0-13.7-1.03-14.6-14.72-14.6H63.51v0.14zM436.46 370c-13.32 1.28-25.22-1.66-36.1-9.86-1.66-1.15-6.4 0.13-8.58 1.79-24.32 19.2-48.27 38.79-72.59 58-15.37 12.16-31.11 23.82-46.48 35.85-6.01 4.86-11.9 9.98-4.73 18.43 1.02 1.15 1.28 3.71 0.77 5.25-5.9 19.46-11.27 38.79-32.26 48.52-26.76 12.3-51.86 4.99-70.04-17.02-10.75-13.19-13.18-28.68-10.11-44.17 3.59-17.67 13.83-32.26 31.24-39.05 9.35-3.59 19.97-3.97 29.96-5.76 2.04-0.38 4.73-0.26 6.27 0.77 14.72 9.35 25.74 4.1 37.64-6.79 13.83-12.8 29.71-23.56 44.69-35.21 22.15-17.15 44.42-34.18 66.06-51.85 3.59-2.81 6.14-8.83 6.02-13.44-0.51-20.74 9.35-37.13 25.22-47.24 14.98-9.6 33.29-12.04 51.34-3.97 9.86 4.23 18.05 9.73 24.07 18.56 11.27 16.77 14.47 33.93 6.02 53.26-1.66 3.58 2.43 10.88 5.76 14.85 13.7 16.9 29.19 32.13 41.23 49.8 6.15 9.34 12.55 7.94 20.49 8.45 10.37 0.64 21.25-3.07 30.59 5.12 1.03 1.16 6.66-0.77 8.97-2.69 16-14.72 31.88-29.58 47.76-44.55 26.89-25.09 53.78-50.32 80.91-75.41 9.22-8.45 18.95-16.26 27.66-25.22 3.07-3.2 5.12-8.32 5.76-12.93 0.77-7.17-1.28-14.72-0.39-22.02 2.18-16.91 8.32-32.26 24.58-40.46 8.84-4.48 18.44-10.12 27.79-9.98 16 0.26 31.88 5.38 43.65 17.54 16.26 16.91 15.62 38.41 11.4 58.52-3.2 14.85-15.62 25.99-30.86 31.11-8.32 2.82-17.67 3.71-26.5 5.13-1.66 0.38-4.09 0.38-5.38-0.51-15.88-11.02-24.07 1.41-33.8 10.5-15.49 14.85-31.5 29.06-47.38 43.79-22.91 21.38-45.83 43.02-68.75 64.4-11.27 10.63-22.79 21.12-33.55 32.26-2.69 2.69-4.74 8.06-4.23 11.78 2.56 23.81-6.53 43.4-26.38 55.05-12.93 7.56-28.42 11.78-45.19 4.48-11.52-5.12-22.41-9.73-29.06-20.61-10.12-16-14.72-32.78-6.02-51.34 2.82-5.76 3.33-11.9-2.3-18.3-14.6-16.65-27.79-34.45-41.61-51.47-1.79-2.18-5.25-3.84-8.2-3.97-4.73-0.41-10.11 0.49-15.36 0.61zM229.43 477.16c-0.12-10.88-6.27-16.26-18.18-16.26-10.88 0.12-17.41 6.66-17.15 17.54 0.12 10.75 7.17 17.79 17.54 17.79 9.09-0.12 17.92-9.46 17.79-19.07z m580.12-256.95c-11.52-0.13-17.54 5.5-17.67 16.9-0.13 10.88 6.66 18.44 16.64 18.44 8.58 0 18.82-9.47 18.82-17.8 0.13-9.61-7.93-17.42-17.79-17.54zM539.4 462.19c-0.26 12.55 4.1 17.67 15.37 17.79 11.27 0.13 19.46-6.91 19.59-16.9 0.13-6.01-9.35-18.82-18.05-18.44-10.63 0.26-16.66 5.89-16.91 17.55z m-86.8-146.21c-3.97-13.7-11.27-21-26.25-16.26-8.19 2.56-8.45 10.12-10.5 15.75-1.79 5.5 7.94 16 16.26 17.28 12.8 1.92 16.64-8.33 20.49-16.77z m0 0" fill="#333333" p-id="8676"></path></svg>
        </el-icon>
        {{ $t('common.monitoringscreen') }}
      </el-button>
      <el-button class="createvm" size="small" @click="handleClickCreateVM">
        <el-icon :size="18">
           <svg t="1652768307670" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7331" width="18" height="18"><path d="M872.8 112H151.2c-48.1 0-87.2 39.6-87.2 88.3V650c0 48.7 39.1 88.3 87.2 88.3h298.6L290 912h444L574.2 738.3h298.6c48.1 0 87.2-39.6 87.2-88.3V200.3c0-48.7-39.1-88.3-87.2-88.3z m-745.4 88.3c0-13.3 10.7-24.1 23.8-24.1h721.6c13.1 0 23.8 10.8 23.8 24.1v305.1H127.4V200.3z" fill="#47444F" p-id="7332"></path></svg>
        </el-icon>
        {{ $t('control.createvm') }}
      </el-button>
      <el-dropdown @command="useroperate">
        <el-button size="small" class="exit">
          <el-icon style="margin-right: 3px" :size="14">
            <font-awesome-icon  icon="user"></font-awesome-icon>
          </el-icon>
          {{ username }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item divided command="theme">
              <el-icon :size="14">
                <svg t="1670487047313" class="icon" viewBox="0 0 1046 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4512" width="200" height="200"><path d="M242.083293 64.994396a374.895822 374.895822 0 0 0 282.633766 132.220623 374.895822 374.895822 0 0 0 280.684567-129.946558l172.828923 188.747376a15.593587 15.593587 0 0 1 0 19.81685l-114.677838 138.068219h-32.48664a32.48664 32.48664 0 0 0-32.486639 32.48664v503.542915a15.918453 15.918453 0 0 1-2.598932 9.421126H241.43356a15.918453 15.918453 0 0 1-2.598931-9.421126V449.961076a32.48664 32.48664 0 0 0-29.887708-32.486639l-27.93851-2.274065L65.031107 277.132153c-3.248664-4.223263 0-19.167117 17.542785-38.334235L242.083293 64.994396m0-64.97328A61.399749 61.399749 0 0 0 194.977666 20.487699L35.793131 194.940955C-7.4141 241.721716-8.388699 288.827343 16.301147 318.390185L130.004386 457.433003a61.399749 61.399749 0 0 0 42.557498 22.740648v469.431944a70.171142 70.171142 0 0 0 64.97328 74.394405H799.229164a70.171142 70.171142 0 0 0 64.97328-74.394405V480.173651h2.923797a60.750016 60.750016 0 0 0 47.105628-22.740648l115.002704-139.042818a82.516065 82.516065 0 0 0-2.598931-104.931846L852.507253 23.086631a61.724615 61.724615 0 0 0-46.131028-20.466584 64.973279 64.973279 0 0 0-49.379692 22.740648 311.546875 311.546875 0 0 1-232.279474 108.180511A311.871741 311.871741 0 0 1 292.437585 23.086631 64.973279 64.973279 0 0 0 241.108694 0.021116z" fill="" p-id="4513"></path></svg>
              </el-icon>
              {{ $t('common.theme') }}
            </el-dropdown-item>
            <el-dropdown-item  divided command="password">
              <el-icon :size="14">
                <font-awesome-icon  icon="lock" ></font-awesome-icon>
              </el-icon>
              {{ $t('login.password') }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon :size="14">
                <font-awesome-icon  icon="sign-out"></font-awesome-icon>
              </el-icon>
              {{ $t('common.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <re-dialog v-model="passwd.visible" :width="350">
      <template #title>
        {{ $t('login.password') }}
      </template>
      <el-form :model="passwd" ref="passwd" :rules="passwdRules" label-width="80px" label-position="left">
        <el-form-item :label="$t('login.password')"  prop="newpasswd" style="width: 100%">
          <el-input v-model.trim="passwd.newpasswd" :maxlength="256" type="password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.confirmpassword')"  prop="confirmpasswd" style="width: 100%">
          <el-input v-model.trim="passwd.confirmpasswd" :maxlength="256" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button  size="small" @click="passwd.visible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" size="small"  @click="changepasswd">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </re-dialog>
    <re-dialog v-model="theme.visible" :width="320">
      <template #title>
        {{ $t('common.theme') }}
      </template>
      <el-form label-width="50px" label-position="left" :model="theme" label-suffix=":">
        <el-form-item :label="$t('common.theme')"  prop="theme" style="width: 100%">
          <el-select v-model="theme.theme">
            <el-option v-for="item in themelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button  size="small" @click="theme.visible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" size="small"  @click="changetheme">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </re-dialog>
    <CreateVM :visible="createVMVisible" :node="node" @cancel="handleCancel"></CreateVM>
  </div>
</template>

<script>
import CreateVM from '../views/components/createVM.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { checkPasswd } from "@/assets/js/setting.js";
import { theme_list } from '@/assets/js/Utils'
export default {
  name: 'CompHeader',
  components: {
    CreateVM,
    ArrowDown
  },
  data(){
    return {
      createVMVisible: false,
      node: null,
      username: localStorage.getItem('username') || null,
      theme: {
        visible: false,
        theme: 'default'
      },
      themelist: theme_list,
      passwd: {
        visible: false,
        newpasswd: null,
        confirmpasswd: null,
      },
      passwdRules: {
        newpasswd: [
          { required: true, validator: checkPasswd, trigger: 'blur' },
          { min: 5, message: this.$t('validate.mustcontainatleastfivecharacters'), trigger: 'blur'}
        ],
        confirmpasswd: [
          { required: true, validator: checkPasswd, trigger: 'blur' },
          { validator: this.checkConfirmPasswd, trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    checkConfirmPasswd(rule, value){
      if (value !== this.passwd.newpasswd) {
        return Promise.reject(this.$t('validate.passworddonotmatch'));
      } else {
        return Promise.resolve();
      }
    },
    logout(){
      this.$api.get('/api2/json/access/domains').then(() => {
        this.$router.push('/login')
      }).catch(err => {
        this.$message.warning(err.response.statusText);
      })
    },
    handleCancel(){
      this.createVMVisible = false;
    },
    handleClickCreateVM(){
      this.createVMVisible = true;
      this.node = this.$route.query.node ? this.$route.query.node : null;
    },
    useroperate(type){
      if (type == 'logout') {
        this.logout();
      }else if (type == 'password') {
        this.passwd = {
          newpasswd: null,
          confirmpasswd: null,
          visible: true,
        }
        this.$refs.passwd && this.$refs.passwd.clearValidate()
      }else if (type == 'theme') {
        this.theme.visible = true;
        this.theme.theme = localStorage.getItem('theme') || 'default'
      }
    },
    changepasswd(){
      let querydata = {
        userid: this.username,
        password: this.passwd.newpasswd,
      }
      this.$refs.passwd.validate((valid) => {
        if (valid) {
          this.$api.put('/api2/json/access/password', querydata).then(() => {
            this.$message.success('Operation success!');
            this.passwd.visible = false;
          }).catch(err => {
            this.$message.warning(err.response.statusText);
          })
        }
      })
    },
    changetheme() {
      localStorage.setItem('theme', this.theme.theme);
      window.document.documentElement.setAttribute("theme", this.theme.theme);
      this.theme.visible = false;
    },
    viewMonitor(){
      this.$router.push('/monitor');
      const docElm = document.documentElement
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen()
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen()
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped >
.header{
  height: 60px;
}
.left-block{
  height: 60px;
  position: absolute;
  display: flex;
  align-items: center;
  left: 20px;
  line-height: 60px;
  .logo{
    display: inline-block;
    color: #f1f1f1;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    img{
      width: 60px;
      height: 30px;
      margin: 5px 
    }
  }
  
  .title{
    display: inline-block;
    color: #dfdfdf;
    height: 40px;
    line-height: 40px;
    font-size: 22px;
  }
}
.right-block{
  height: 40px;
  position: absolute;
  display: flex;
  right: 0;
  top: 10px;
}
.el-icon {
  vertical-align: middle;
}
.exit{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
}
.createvm{
  vertical-align: middle;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 130px;
  .el-icon{
    margin-right: 3px
  }
}
.monitorscreen {
  vertical-align: middle;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 242px;
  .el-icon{
    margin-right: 3px
  }
}
:deep(.el-dropdown-menu__item){
  color: #515151;
  padding: 5px 15px !important;
  font-size: 12px;
  line-height: 16px;
  .el-icon{
    margin-right: 10px;
  }
}
:deep(.el-dropdown-menu__item:hover){
  color: #515151;
}
:deep(.el-dropdown-menu__item.is-disabled){
  color: #c0c4cc;
}
:deep(.el-dropdown-menu__item--divided){
  margin: 0px;
}
</style>
