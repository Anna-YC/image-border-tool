<template>
  <div
    class="uploader"
    :class="{ 'uploader--dragover': isDragover }"
    @dragover.prevent="isDragover = true"
    @dragleave.prevent="isDragover = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileChange"
      class="hidden"
    />

    <div v-if="!imagePreview" class="uploader-placeholder">
      <svg class="uploader-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p class="uploader-text">拖拽图片到这里，或点击选择</p>
      <p class="uploader-hint">支持 PNG、JPG、WebP 格式</p>
    </div>

    <div v-else class="uploader-preview">
      <img :src="imagePreview" alt="Preview" class="uploader-image" />
      <button @click.stop="clearImage" class="uploader-clear">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'load']);

const fileInput = ref(null);
const isDragover = ref(false);
const imagePreview = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    imagePreview.value = val;
  }
);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileChange(event) {
  const file = event.target.files?.[0];
  if (file) {
    loadImage(file);
  }
}

function handleDrop(event) {
  isDragover.value = false;
  const file = event.dataTransfer.files?.[0];
  if (file && file.type.startsWith('image/')) {
    loadImage(file);
  }
}

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
    emit('update:modelValue', e.target.result);
    emit('load', file);
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  imagePreview.value = null;
  emit('update:modelValue', null);
}
</script>

<style scoped>
.uploader {
  @apply relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-colors;
}

.uploader--dragover {
  @apply border-primary-500 bg-primary-50;
}

.uploader-placeholder {
  @apply flex flex-col items-center justify-center h-full text-gray-500;
}

.uploader-icon {
  @apply w-12 h-12 mb-2 text-gray-400;
}

.uploader-text {
  @apply text-sm font-medium;
}

.uploader-hint {
  @apply text-xs text-gray-400 mt-1;
}

.uploader-preview {
  @apply relative w-full h-full;
}

.uploader-image {
  @apply w-full h-full object-contain rounded-lg;
}

.uploader-clear {
  @apply absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xl leading-none hover:bg-red-600 transition-colors;
}

.hidden {
  display: none;
}
</style>
