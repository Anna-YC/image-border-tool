/**
 * 纯前端 Canvas 图片处理器
 * 支持边框、圆角、阴影效果
 */

/**
 * 解析颜色为 rgba 对象
 * @param {string} color - 颜色字符串 (#rgb, rgba, css color)
 * @returns {Object} {r, g, b, a} 范围 0-255
 */
function parseColor(color) {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) : 255;
    return { r, g, b, a };
  } else if (color.startsWith('rgba')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? Math.round(parseFloat(match[4]) * 255) : 255
      };
    }
  }
  // 默认黑色
  return { r: 0, g: 0, b: 0, a: 255 };
}

/**
 * rgba 对象转 css 字符串
 */
function rgbaToString({ r, g, b, a }) {
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

/**
 * 绘制圆角矩形
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - 左上角 x
 * @param {number} y - 左上角 y
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} radius - 圆角半径
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * 绘制带圆角的图片
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} img
 * @param {number} x - 左上角 x
 * @param {number} y - 左上角 y
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} radius - 圆角半径
 */
function drawRoundedImage(ctx, img, x, y, width, height, radius) {
  ctx.save();
  roundRect(ctx, x, y, width, height, radius);
  ctx.clip();
  ctx.drawImage(img, x, y, width, height);
  ctx.restore();
}

/**
 * 处理图片：添加边框、圆角、阴影
 * @param {HTMLImageElement|HTMLCanvasElement} sourceImage - 源图片
 * @param {Object} options - 处理选项
 * @returns {Promise<HTMLCanvasElement>} 处理后的画布
 */
async function processImage(sourceImage, options = {}) {
  const {
    // 边框选项
    borderWidth = 0,
    borderColor = '#000000',
    borderStyle = 'solid',

    // 圆角选项
    cornerRadius = 0,

    // 阴影选项
    shadowEnabled = false,
    shadowColor = 'rgba(0, 0, 0, 0.3)',
    shadowBlur = 10,
    shadowOffsetX = 5,
    shadowOffsetY = 5,

    // 导出选项
    format = 'png',
    quality = 90,
  } = options;

  // 获取原始图片尺寸
  const imgWidth = sourceImage.width || sourceImage.naturalWidth;
  const imgHeight = sourceImage.height || sourceImage.naturalHeight;

  // 计算阴影扩展空间
  const shadowPadding = shadowEnabled
    ? Math.max(shadowBlur, Math.abs(shadowOffsetX), Math.abs(shadowOffsetY))
    : 0;

  // 边框宽度
  const borderW = Math.max(0, borderWidth);

  // 总的内边距
  const totalPadding = shadowPadding + borderW;

  // 新画布尺寸
  const newWidth = imgWidth + totalPadding * 2;
  const newHeight = imgHeight + totalPadding * 2;

  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d');

  // 清空画布（透明背景）
  ctx.clearRect(0, 0, newWidth, newHeight);

  // 计算内容区域位置
  const contentX = shadowPadding;
  const contentY = shadowPadding;
  const contentWidth = imgWidth + borderW * 2;
  const contentHeight = imgHeight + borderW * 2;

  // 绘制阴影（在边框后面）
  if (shadowEnabled && shadowPadding > 0) {
    ctx.save();
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;

    // 绘制阴影形状
    const shadowC = parseColor(shadowColor);
    ctx.fillStyle = `rgba(${shadowC.r}, ${shadowC.g}, ${shadowC.b}, ${shadowC.a / 255})`;

    if (cornerRadius > 0) {
      roundRect(ctx, contentX, contentY, contentWidth, contentHeight, cornerRadius + borderW);
      ctx.fill();
    } else {
      ctx.fillRect(contentX, contentY, contentWidth, contentHeight);
    }
    ctx.restore();
  }

  // 绘制边框
  if (borderW > 0) {
    const borderC = parseColor(borderColor);
    ctx.fillStyle = rgbaToString(borderC);

    if (cornerRadius > 0) {
      // 带圆角的边框
      roundRect(ctx, contentX, contentY, contentWidth, contentHeight, cornerRadius + borderW);
      ctx.fill();

      // 挖空中间部分（用于显示图片）
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      roundRect(
        ctx,
        contentX + borderW,
        contentY + borderW,
        imgWidth,
        imgHeight,
        Math.max(0, cornerRadius)
      );
      ctx.fill();
      ctx.restore();
    } else {
      // 简单边框（画四个边）
      // 顶部边框
      ctx.fillRect(contentX, contentY, contentWidth, borderW);
      // 底部边框
      ctx.fillRect(contentX, contentY + contentHeight - borderW, contentWidth, borderW);
      // 左边框
      ctx.fillRect(contentX, contentY + borderW, borderW, contentHeight - borderW * 2);
      // 右边框
      ctx.fillRect(contentX + contentWidth - borderW, contentY + borderW, borderW, contentHeight - borderW * 2);
    }
  }

  // 绘制图片
  const imgX = contentX + borderW;
  const imgY = contentY + borderW;

  if (cornerRadius > 0) {
    drawRoundedImage(ctx, sourceImage, imgX, imgY, imgWidth, imgHeight, cornerRadius);
  } else {
    ctx.drawImage(sourceImage, imgX, imgY, imgWidth, imgHeight);
  }

  return canvas;
}

/**
 * 将画布转换为 Blob
 * @param {HTMLCanvasElement} canvas
 * @param {string} format - png, jpeg, webp
 * @param {number} quality - 0-1 (仅 jpeg/webp)
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas, format = 'png', quality = 0.9) {
  return new Promise((resolve) => {
    const mime = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' :
                 format === 'webp' ? 'image/webp' : 'image/png';
    canvas.toBlob((blob) => resolve(blob), mime, quality);
  });
}

/**
 * 将画布转换为 Data URL
 * @param {HTMLCanvasElement} canvas
 * @param {string} format - png, jpeg, webp
 * @param {number} quality - 0-1 (仅 jpeg/webp)
 * @returns {string} data URL
 */
function canvasToDataURL(canvas, format = 'png', quality = 0.9) {
  const mime = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' :
               format === 'webp' ? 'image/webp' : 'image/png';
  return canvas.toDataURL(mime, quality);
}

export {
  processImage,
  canvasToBlob,
  canvasToDataURL,
  parseColor,
  rgbaToString
};
