<template>
  <div class="common-layout">
    <el-container style="height: 100%">
        <el-container class="main-container" v-if="!reload">
          <el-aside width="220px">
            <StorageTree style="height: 100%"></StorageTree>
          </el-aside>
          <el-divider direction="vertical"></el-divider>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<script>
import StorageTree from './layoutView/storagetree.vue'
export default {
  name: 'ViewLayout',
  components: {
    StorageTree,
  },
  data(){
    return{
      reload: false,
    }
  },
  created() {
    window.document.documentElement.setAttribute("theme","color2")
    localStorage.setItem('theme', 'color2')
    // if (!localStorage.getItem('token')) {
    //   this.$router.replace({
    //     path: '/login'
    //   })
    // }
  },
  watch: {
    '$route'(val) {
      if (val.path == '/iframe') {
        this.reload = true
        this.$router.push('/storage')
        setTimeout(() => {
          this.reload = false
        }, 10)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.el-main{
  height: 100%;
  padding: 0px;
}
.el-main{
  height: 100%;
  box-sizing: border-box;
}
.el-divider--vertical{
  height: 100%;
  margin: 0;
}
</style>
