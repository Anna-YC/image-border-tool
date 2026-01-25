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
      <div class="upload-icon-wrapper">
        <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <p class="uploader-text">拖拽图片到这里</p>
      <p class="uploader-or">或</p>
      <button class="upload-button">点击选择文件</button>
      <p class="uploader-hint">支持 PNG、JPG、WebP 格式</p>
    </div>

    <div v-else class="uploader-preview">
      <img :src="imagePreview" alt="Preview" class="preview-image" />
      <div class="preview-overlay">
        <button @click.stop="clearImage" class="remove-button">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          移除图片
        </button>
        <button @click.stop="triggerFileInput" class="change-button">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          更换图片
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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
  @apply relative w-full h-56 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
  border: 2px dashed rgba(139, 92, 246, 0.3);
}

.uploader:hover {
  @apply scale-[1.02];
  border-color: rgba(139, 92, 246, 0.5);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
}

.uploader--dragover {
  @apply scale-[1.02];
  border-color: rgba(139, 92, 246, 0.8);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

/* 占位内容 */
.uploader-placeholder {
  @apply flex flex-col items-center justify-center h-full px-6;
}

.upload-icon-wrapper {
  @apply relative mb-4;
}

.upload-icon {
  @apply w-16 h-16 text-violet-400 transition-transform duration-300;
}

.uploader:hover .upload-icon {
  @apply scale-110;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.uploader-text {
  @apply text-base font-semibold text-gray-700 mb-1;
}

.uploader-or {
  @apply text-sm text-gray-400 my-3;
}

.upload-button {
  @apply px-6 py-2.5 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105;
}

.uploader-hint {
  @apply text-xs text-gray-400 mt-4;
}

/* 预览模式 */
.uploader-preview {
  @apply relative w-full h-full group;
}

.preview-image {
  @apply w-full h-full object-contain;
}

.preview-overlay {
  @apply absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3;
}

.remove-button,
.change-button {
  @apply flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105;
}

.remove-button {
  @apply bg-red-500 text-white hover:bg-red-600 shadow-lg;
}

.change-button {
  @apply bg-white text-gray-700 hover:bg-gray-100 shadow-lg;
}

.remove-button svg,
.change-button svg {
  @apply w-5 h-5;
}

.hidden {
  display: none;
}
</style>
