/**
 * 格式化工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string | number,
  format: string = "YYYY-MM-DD"
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "";
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return "刚刚";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}分钟前`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}小时前`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days}天前`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks}周前`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months}个月前`;
  } else {
    const years = Math.floor(diff / year);
    return `${years}年前`;
  }
}

/**
 * 格式化数字
 */
export function formatNumber(
  num: number,
  options: {
    decimals?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
    prefix?: string;
    suffix?: string;
  } = {}
): string {
  const {
    decimals = 2,
    thousandsSeparator = ",",
    decimalSeparator = ".",
    prefix = "",
    suffix = "",
  } = options;

  if (isNaN(num)) return "";

  const fixed = num.toFixed(decimals);
  const parts = fixed.split(".");

  // 添加千分位分隔符
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  const result = parts.join(decimalSeparator);
  return `${prefix}${result}${suffix}`;
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency: string = "CNY",
  locale: string = "zh-CN"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch {
    return formatNumber(amount, { prefix: "¥", suffix: "" });
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化手机号
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  return phone;
}

/**
 * 格式化身份证号
 */
export function formatIdCard(idCard: string): string {
  if (!idCard) return "";

  const cleaned = idCard.replace(/\D/g, "");

  if (cleaned.length === 18) {
    return cleaned.replace(/(\d{6})(\d{8})(\d{4})/, "$1-$2-$3");
  }

  return idCard;
}

/**
 * 格式化银行卡号
 */
export function formatBankCard(cardNumber: string): string {
  if (!cardNumber) return "";

  const cleaned = cardNumber.replace(/\D/g, "");

  return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * 格式化URL
 */
export function formatUrl(url: string): string {
  if (!url) return "";

  // 添加协议前缀
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
}

/**
 * 格式化JSON
 */
export function formatJson(obj: any, indent: number = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return String(obj);
  }
}

/**
 * 格式化HTML
 */
export function formatHtml(html: string): string {
  if (!html) return "";

  // 简单的HTML格式化
  return html
    .replace(/></g, ">\n<")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
    .join("\n");
}

/**
 * 格式化文本
 */
export function formatText(
  text: string,
  maxLength: number = 100,
  suffix: string = "..."
): string {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + suffix;
}

/**
 * 格式化姓名
 */
export function formatName(name: string): string {
  if (!name) return "";

  // 隐藏中间字符
  if (name.length <= 2) {
    return name.charAt(0) + "*";
  }

  return (
    name.charAt(0) + "*".repeat(name.length - 2) + name.charAt(name.length - 1)
  );
}

/**
 * 格式化邮箱
 */
export function formatEmail(email: string): string {
  if (!email) return "";

  const [username, domain] = email.split("@");

  if (!username || !domain) return email;

  const hiddenUsername =
    username.length > 2
      ? username.charAt(0) +
        "*".repeat(username.length - 2) +
        username.charAt(username.length - 1)
      : username;

  return `${hiddenUsername}@${domain}`;
}

/**
 * 格式化地址
 */
export function formatAddress(address: string): string {
  if (!address) return "";

  // 简单的地址格式化
  return address.replace(/\s+/g, " ").trim();
}

/**
 * 格式化时间范围
 */
export function formatTimeRange(
  start: Date | string | number,
  end: Date | string | number
): string {
  const startDate = formatDate(start, "MM-DD HH:mm");
  const endDate = formatDate(end, "MM-DD HH:mm");

  return `${startDate} - ${endDate}`;
}

/**
 * 格式化持续时间
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}天${hours % 24}小时`;
  } else if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`;
  } else {
    return `${seconds}秒`;
  }
}

/**
 * 格式化颜色
 */
export function formatColor(color: string): string {
  if (!color) return "";

  // 转换为十六进制格式
  if (color.startsWith("#")) {
    return color.toUpperCase();
  }

  if (color.startsWith("rgb")) {
    // 简单的RGB转十六进制
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = parseInt(matches[0]).toString(16).padStart(2, "0");
      const g = parseInt(matches[1]).toString(16).padStart(2, "0");
      const b = parseInt(matches[2]).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`.toUpperCase();
    }
  }

  return color;
}

/**
 * 格式化版本号
 */
export function formatVersion(version: string): string {
  if (!version) return "";

  // 确保版本号格式正确
  const parts = version.split(".").map((part) => parseInt(part) || 0);

  while (parts.length < 3) {
    parts.push(0);
  }

  return parts.slice(0, 3).join(".");
}

/**
 * 格式化IP地址
 */
export function formatIpAddress(ip: string): string {
  if (!ip) return "";

  // 简单的IP地址格式化
  const parts = ip.split(".");
  if (parts.length === 4) {
    return parts.map((part) => part.padStart(3, "0")).join(".");
  }

  return ip;
}

/**
 * 格式化坐标
 */
export function formatCoordinate(
  lat: number,
  lng: number,
  precision: number = 6
): string {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}

/**
 * 格式化标签
 */
export function formatTags(tags: string[], separator: string = ", "): string {
  if (!Array.isArray(tags)) return "";

  return tags.filter((tag) => tag && tag.trim()).join(separator);
}

/**
 * 格式化列表
 */
export function formatList(items: any[], separator: string = ", "): string {
  if (!Array.isArray(items)) return "";

  return items.map((item) => String(item)).join(separator);
}

/**
 * 格式化表格数据
 */
export function formatTableData(data: any[], columns: string[]): any[] {
  if (!Array.isArray(data) || !Array.isArray(columns)) return [];

  return data.map((row) => {
    const formattedRow: any = {};
    columns.forEach((column) => {
      formattedRow[column] = row[column] || "";
    });
    return formattedRow;
  });
}
