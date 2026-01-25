<template>
  <div class="app">
    <!-- 顶部标题栏 -->
    <header class="app-header">
      <h1 class="app-title">图片边框工具</h1>
      <span class="app-version">v1.0.0</span>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <!-- 左侧工具面板 -->
      <aside class="app-sidebar">
        <!-- 图片上传 -->
        <div class="sidebar-section">
          <ImageUploader
            v-model="currentImage"
            @load="handleImageLoad"
          />
        </div>

        <!-- 控制面板 -->
        <div class="sidebar-section sidebar-section--grow">
          <ControlPanel
            :border="border"
            :shadow="shadow"
            :corner="corner"
            :export-settings="exportSettings"
            :image-data="currentImage"
            :suggested-colors="suggestedColors"
            @reset="resetSettings"
            @export="handleDownload"
            @apply-border-color="applyColorToBorder"
            @apply-shadow-color="applyColorToShadow"
          />
        </div>
      </aside>

      <!-- 右侧预览区 -->
      <section class="app-content">
        <PreviewCanvas
          :image-data="currentImage"
          :border="border"
          :shadow="shadow"
          :corner="corner"
          :image-info="imageInfo"
        />
      </section>
    </main>

    <!-- 加载中提示 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>处理中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ImageUploader from './components/ImageUploader.vue';
import ControlPanel from './components/ControlPanel.vue';
import PreviewCanvas from './components/PreviewCanvas.vue';
import { useImageEditor } from './composables/useImageEditor';

// 使用编辑器 composable
const {
  currentImage,
  imageInfo,
  border,
  shadow,
  corner,
  exportSettings,
  suggestedColors,
  loadImage,
  resetSettings,
  downloadImage,
  applyColorToBorder,
  applyColorToShadow,
} = useImageEditor();

// 加载状态
const loading = ref(false);

// 处理图片加载
async function handleImageLoad(file) {
  loading.value = true;
  try {
    await loadImage(file);
  } catch (error) {
    console.error('图片加载失败:', error);
    alert('图片加载失败，请重试');
  } finally {
    loading.value = false;
  }
}

// 下载图片
async function handleDownload() {
  if (!currentImage.value) return;

  loading.value = true;
  try {
    const filename = `bordered-${imageInfo.name || 'image'}.${exportSettings.format}`;
    await downloadImage(filename);
  } catch (error) {
    console.error('下载失败:', error);
    alert('下载失败，请重试');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.app {
  @apply flex flex-col h-screen bg-gray-100;
}

.app-header {
  @apply flex items-center justify-between px-6 py-4 bg-white shadow-sm;
}

.app-title {
  @apply text-xl font-semibold text-gray-800;
}

.app-version {
  @apply text-sm text-gray-500;
}

.app-main {
  @apply flex flex-1 overflow-hidden;
}

.app-sidebar {
  @apply flex flex-col w-80 bg-white border-r border-gray-200 overflow-hidden;
}

.sidebar-section {
  @apply p-4 border-b border-gray-200;
}

.sidebar-section--grow {
  @apply flex-1 overflow-y-auto;
}

.app-content {
  @apply flex-1 overflow-hidden;
}

.loading-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4;
}

.loading-overlay p {
  @apply text-white text-lg;
}
</style>
