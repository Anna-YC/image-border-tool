<template>
  <div class="app">
    <!-- 顶部标题栏 - 毛玻璃效果 -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="header-text">
            <h1 class="app-title">图片美化神器</h1>
            <span class="app-version">v2.0.0</span>
          </div>
        </div>
        <div class="header-right">
          <a href="https://github.com/Anna-YC/WaytoAGI-Demo" target="_blank" class="github-link">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
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
    <Transition name="fade">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>处理中...</p>
        </div>
      </div>
    </Transition>
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
  @apply flex flex-col h-screen;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 顶部导航栏 - 毛玻璃效果 */
.app-header {
  @apply relative z-10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.header-content {
  @apply flex items-center justify-between px-6 py-4;
}

.header-left {
  @apply flex items-center gap-3;
}

.logo-icon {
  @apply w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white shadow-lg;
}

.logo-icon svg {
  @apply w-6 h-6;
}

.header-text {
  @apply flex flex-col;
}

.app-title {
  @apply text-xl font-bold text-white drop-shadow-lg;
}

.app-version {
  @apply text-xs text-white/70 font-medium;
}

.header-right {
  @apply flex items-center gap-3;
}

.github-link {
  @apply w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110;
}

.github-link svg {
  @apply w-5 h-5;
}

/* 主内容区 */
.app-main {
  @apply flex flex-1 gap-4 p-4 overflow-hidden;
}

/* 左侧边栏 - 卡片化设计 */
.app-sidebar {
  @apply flex flex-col w-96 overflow-hidden;
}

.sidebar-section {
  @apply bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden;
}

.sidebar-section--grow {
  @apply flex-1 mt-4 overflow-y-auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 92, 246, 0.5) transparent;
}

.sidebar-section--grow::-webkit-scrollbar {
  @apply w-2;
}

.sidebar-section--grow::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.sidebar-section--grow::-webkit-scrollbar-thumb {
  @apply bg-violet-400/50 rounded-full;
}

/* 右侧内容区 */
.app-content {
  @apply flex-1 overflow-hidden;
}

/* 加载动画 */
.loading-overlay {
  @apply fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50;
}

.loading-content {
  @apply flex flex-col items-center gap-4 bg-white rounded-3xl p-8 shadow-2xl;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin;
}

.loading-content p {
  @apply text-gray-700 font-medium;
}

/* 渐变过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
