<template>
  <div>
    <el-dialog
      v-model="dialogvisible"
      :draggable="true"
      :close-on-click-modal="false"
      :title="title"
      :before-close="handleClose"
      :width="width"
      append-to-body
    >
      <template #header>
        <slot name="title"></slot>
      </template>
      <slot></slot>
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CommonDialog',
  emits: ['update:modelValue'],
  props: {
    title: String,
    modelValue: {
      type: Boolean,
      default: false,
    },
    width: Number,
  },
  data() {
    return {
      dialogvisible: false,
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        this.dialogvisible = val
      },
      immediate: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:modelValue', false)
    },
  },
}
</script>
