/**
 * 颜色提取工具
 * 从图片中提取主要颜色（使用简化的量化算法）
 */

/**
 * 将 RGB 转换为 Hex
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 计算两个颜色的距离
 */
function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * 简化的颜色量化算法
 * 将相似的颜色归类到一起
 */
function quantizeColors(pixels, colorCount) {
  // 先随机选择 colorCount 个初始中心点
  let centers = [];
  const step = Math.floor(pixels.length / colorCount);
  for (let i = 0; i < colorCount; i++) {
    centers.push({ ...pixels[i * step] });
  }

  // 迭代优化（最多 5 次，平衡性能和准确性）
  for (let iter = 0; iter < 5; iter++) {
    // 将每个像素分配到最近的中心
    const buckets = Array.from({ length: colorCount }, () => []);

    for (const pixel of pixels) {
      let minDist = Infinity;
      let closestCenter = 0;

      for (let i = 0; i < centers.length; i++) {
        const dist = colorDistance(pixel, centers[i]);
        if (dist < minDist) {
          minDist = dist;
          closestCenter = i;
        }
      }

      buckets[closestCenter].push(pixel);
    }

    // 重新计算中心点
    for (let i = 0; i < colorCount; i++) {
      if (buckets[i].length === 0) continue;

      const sum = buckets[i].reduce((acc, p) => ({
        r: acc.r + p.r,
        g: acc.g + p.g,
        b: acc.b + p.b,
      }), { r: 0, g: 0, b: 0 });

      centers[i] = {
        r: Math.round(sum.r / buckets[i].length),
        g: Math.round(sum.g / buckets[i].length),
        b: Math.round(sum.b / buckets[i].length),
        count: buckets[i].length,
      };
    }
  }

  // 按像素数量排序（最常用的颜色在前）
  return centers.sort((a, b) => (b.count || 0) - (a.count || 0));
}

/**
 * 从图片 URL 中提取主要颜色
 * @param {string} imageUrl - 图片的 data URL
 * @param {number} colorCount - 要提取的颜色数量
 * @returns {Promise<string[]>} 颜色的 hex 值数组
 */
export async function extractColors(imageUrl, colorCount = 5) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // 创建 canvas 来读取像素数据
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 限制采样尺寸以提高性能
        const maxSize = 100; // 采样最大尺寸
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 获取像素数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = [];

        // 采样像素（每隔 5 个像素采样一次，提高性能）
        const sampleRate = 5;
        for (let i = 0; i < imageData.data.length; i += 4 * sampleRate) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];

          // 跳过透明像素和非常暗/非常亮的像素
          if (a < 128) continue;
          if (r < 10 && g < 10 && b < 10) continue; // 太暗
          if (r > 245 && g > 245 && b > 245) continue; // 太亮

          pixels.push({ r, g, b });
        }

        if (pixels.length === 0) {
          // 如果没有有效像素，返回默认颜色
          resolve(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']);
          return;
        }

        // 提取主要颜色
        const colors = quantizeColors(pixels, colorCount);

        // 转换为 hex
        const hexColors = colors.slice(0, colorCount).map(c => rgbToHex(c.r, c.g, c.b));

        resolve(hexColors);
      } catch (error) {
        console.error('颜色提取失败:', error);
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };

    img.src = imageUrl;
  });
}

/**
 * 判断颜色是否为深色
 */
export function isDarkColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}
