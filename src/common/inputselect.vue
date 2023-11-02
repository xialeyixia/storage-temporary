<template>
  <div style="width: 100%;display: flex;">
    <el-input-number v-model="value" :min="0" controls-position="right" :precision=0 :size="size" :controls="false" :max=1000000000 @change="changeValue" style="width: calc(100% - 70px)"></el-input-number>
    <el-select v-if="selectType === 'filesystem'" v-model="unit" style="width: 70px"  @change="changeValue">
      <el-option v-for="item in unitType" :key="item.value" :label="item.label" :disabled="!percent && item.value == '%'" :value="item.value"/>
    </el-select>
    <el-select v-else v-model="unit" style="width: 70px"  @change="changeValue">
      <el-option v-for="item in volumeType" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'InputSelect',
  emits: ['update:modelValue'],
  props: {
    modelValue: String,
    size: {
      type: String,
      default: 'default'
    },
    selectType: {
      type: String,
      default: 'filesystem'
    },
    percent: Boolean
  },
  data(){
    return{
      value: null,
      unit: null,
      volumeType: [{
        value: "B",
        label: "B",
      },
      {
        value: "K",
        label: "KB",
      },
      {
        value: "M",
        label: "MB",
      }],
      unitType: [
        {
          value: "b",
          label: "b",
        },
        {
          value: "B",
          label: "B",
        },
        {
          value: "K",
          label: "KB",
        },
        {
          value: "M",
          label: "MB",
        },
        {
          value: "G",
          label: "GB",
        },
        {
          value: "T",
          label: "TB",
        },
        {
          value: "P",
          label: "PB",
        },
        {
          value: "%",
          label: "%",
        },
      ],
    }
  },
  watch: {
    modelValue: {
      handler(val){
        this.value = parseFloat(val);
        this.unit = val.charAt(val.length - 1);
      },
      immediate: true,
    }
  },
  mounted(){

  },
  methods:{
    changeValue(){
      this.$emit('update:modelValue', this.value + this.unit);
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__wrapper){
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
:deep(.el-select .el-input__wrapper){
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

</style>
