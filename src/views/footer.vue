<template>
  <div class="footer">
    <div class="tab">
      <el-radio-group v-model="tabpannel" size="small">
        <el-radio-button :label="$t('table.task')" />
        <!-- <el-radio-button :label="$t('table.storagelog')" /> -->
      </el-radio-group>
    </div>
    <div class="win-control-btn">
      <el-button class="win-btn" text circle @click="windowOperates('mini')" v-show="fonterwintype == 'large'">
        <el-icon :size="24">
          <svg t="1657260200125" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13218" width="200" height="200"><path d="M512 128c-212.1 0-384 171.9-384 384s171.9 384 384 384 384-171.9 384-384-171.9-384-384-384z m224 397.3L557.3 704c-25 25-65.5 25-90.5 0L288 525.3c-6.3-6.3-9.4-14.4-9.4-22.6s3.1-16.4 9.4-22.6c12.5-12.5 32.8-12.5 45.3 0l167.4 167.4c6.2 6.2 16.4 6.2 22.6 0L690.7 480c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z" p-id="13219" fill="#8a8a8a"></path></svg>
        </el-icon>
      </el-button>
      <el-button class="win-btn" text circle @click="windowOperates('large')" v-show="fonterwintype == 'mini'">
        <el-icon :size="24">
          <svg t="1657260257406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13468" width="200" height="200"><path d="M512 128c-212.1 0-384 171.9-384 384s171.9 384 384 384 384-171.9 384-384-171.9-384-384-384z m224 416c-12.5 12.5-32.8 12.5-45.3 0L523.3 376.6c-6.2-6.2-16.4-6.2-22.6 0L333.3 544c-12.5 12.5-32.8 12.5-45.3 0-6.3-6.3-9.4-14.4-9.4-22.6s3.1-16.4 9.4-22.6L466.8 320c25-25 65.5-25 90.5 0L736 498.7c12.5 12.5 12.5 32.8 0 45.3z" p-id="13469" fill="#18af90"></path></svg>
        </el-icon>
      </el-button>
    </div>
    <Task v-if="tabpannel == $t('table.task')"></Task>
    <!-- <Operatelog v-if="tabpannel == $t('table.storagelog')"></Operatelog> -->
  </div>
</template>

<script>
import Task from './layoutView/task.vue'
import Operatelog from './layoutView/operatelog.vue'
export default {
  name: 'CompFooter',
  props: {
  },
  components:{
    Task,
    Operatelog
  },
  data(){
    return {
      tabpannel: this.$t('table.task'),
      fonterwintype: localStorage.getItem('footer-win') || 'mini'
    }
  },
  methods: {
    windowOperates(type){
      this.$emit('fonterwin',type);
      this.fonterwintype = type
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/assets/css/mixin.scss';
.footer{
  text-align: left;
}
.tab{
  text-align: left;
  padding-top: 10px;
  display: inline-block;
}
.win-control-btn{
  padding-top: 10px;
  float: right;
}
.win-btn:hover {
  @include footer_button();
}
</style>
