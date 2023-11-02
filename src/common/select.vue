<template>
  <div>
    <el-select v-model="value" placeholder="Select" disabled style="width: 100%" :size="size"> 
      <div class="table-header">
        <span  class="block-item" v-for="item in table" :key="item.label">{{item.label}}</span>
      </div>
      <el-option
        v-for="(obj,index) in data"
        :key="index"
        :value="obj.node"
      >
         <div class="table-item">
           <span class="block-item" v-for="item in table" :key="item.value">{{obj[item.value]}}</span>
         </div>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'ViewCompute',
  components: {
  },
  props: {
    data: Array,
    table: Array,
    size: String
  },
  data(){
    return{
      // data: [{
      //   cpu: 0.127649434417935,
      //   disk: 185111805952,
      //   id: "node/hp71-el8",
      //   level: "",
      //   maxcpu: 48,
      //   maxdisk: 229739823104,
      //   maxmem: 66852630528,
      //   mem: 6918389760,
      //   node: "hp71-el8",
      //   ssl_fingerprint: "C7:99:D3:12:DA:7F:3F:8B:53:03:1D:87:FF:CC:13:0D:6C:E9:0B:65:C0:D4:78:E8:6B:8B:21:D5:4C:99:07:CE",
      //   status: "online",
      //   type: "node",
      //   uptime: 108976,
      // }],
      value: null
    }
  },
  mounted(){
    this.$nextTick(()=> {
      this.value = this.data[0].node;
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.table-item{
  height: 25px;
  line-height: 25px;
  span:last-child{
    margin-right: 0
  }
}
.table-header{
  height: 25px;
  padding: 0 32px 0 20px;
  line-height: 25px;
  span:last-child{
    margin-right: 0
  }
}
.block-item{
  display: inline-block;
  font-size: 13px;
  margin-right: 10px;
  // border: 1px solid;
  width: 60px;
}
:deep(.el-select-dropdown__item){
  // border: 1px solid;
  padding: 0 10px;
}
</style>
