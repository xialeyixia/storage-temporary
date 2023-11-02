<template>
  <div class="common-layout">
    <el-container style="height: 100%">
      <el-header><Header></Header></el-header>
      <el-divider style="margin: 0"></el-divider>
      <el-container class="main-container">
        <el-aside width="270">
          <Aside :footerwintype="footerwintype"></Aside>
        </el-aside>
        <el-divider direction="vertical"></el-divider>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-divider :style="footerwintype == 'large' ? 'margin-bottom: 300px' : 'margin-bottom: 45px'"></el-divider>
      <el-footer :style="footerwintype == 'large' ? 'height: 300px' : 'height: 45px; overflow: hidden'"><Footer @fonterwin="footerwinchange"></Footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";
import Aside from "./treemenu.vue"
export default {
  name: 'ViewLayout',
  components: {
    Header,
    Aside,
    Footer
  },
  data(){
    return{
      footerwintype: localStorage.getItem('footer-win') || 'mini',
      theme: localStorage.getItem('theme') || 'default'
    }
  },
  mounted(){
    window.document.documentElement.setAttribute("theme",this.theme);
  },
  methods: {
    footerwinchange(type){
      localStorage.setItem('footer-win',type);
      this.footerwintype = type;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/mixin.scss';
.el-header{
  height: auto;
  @include main_header();
}
.el-main{
  height: 100%;
  padding: 0px;
}
.el-divider--horizontal{
  margin-top: 0;
}
.el-divider--vertical{
  height: 100%;
  margin: 0;
}
.main-container{
  height: calc(100% - 370px);
}
.el-main{
  height: 100%;
  box-sizing: border-box;
  padding: 0 0 0 2px;
}
</style>
