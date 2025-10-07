/**
 * 表单验证工具函数
 */

// 验证规则类型
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: any) => boolean | string;
}

// 验证结果类型
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * 验证用户名
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { valid: false, message: "用户名不能为空" };
  }

  if (username.length < 3) {
    return { valid: false, message: "用户名至少需要3个字符" };
  }

  if (username.length > 20) {
    return { valid: false, message: "用户名不能超过20个字符" };
  }

  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    return { valid: false, message: "用户名只能包含字母、数字、下划线和中文" };
  }

  return { valid: true };
}

/**
 * 验证密码
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: "密码不能为空" };
  }

  if (password.length < 6) {
    return { valid: false, message: "密码至少需要6个字符" };
  }

  if (password.length > 20) {
    return { valid: false, message: "密码不能超过20个字符" };
  }

  // 密码强度检查
  const strength = getPasswordStrength(password);
  if (strength < 2) {
    return { valid: false, message: "密码强度太弱，请包含字母和数字" };
  }

  return { valid: true };
}

/**
 * 验证邮箱
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, message: "邮箱不能为空" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "请输入有效的邮箱地址" };
  }

  return { valid: true };
}

/**
 * 验证手机号
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false, message: "手机号不能为空" };
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: "请输入有效的手机号" };
  }

  return { valid: true };
}

/**
 * 验证URL
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { valid: false, message: "URL不能为空" };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, message: "请输入有效的URL" };
  }
}

/**
 * 验证身份证号
 */
export function validateIdCard(idCard: string): ValidationResult {
  if (!idCard) {
    return { valid: false, message: "身份证号不能为空" };
  }

  const idCardRegex =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!idCardRegex.test(idCard)) {
    return { valid: false, message: "请输入有效的身份证号" };
  }

  return { valid: true };
}

/**
 * 获取密码强度
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  // 长度检查
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;

  // 包含小写字母
  if (/[a-z]/.test(password)) strength++;

  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++;

  // 包含数字
  if (/\d/.test(password)) strength++;

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  return strength;
}

/**
 * 获取密码强度文本
 */
export function getPasswordStrengthText(strength: number): string {
  if (strength <= 2) return "弱";
  if (strength <= 4) return "中等";
  return "强";
}

/**
 * 验证表单数据
 */
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule[]>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      const result = validateField(value, rule);
      if (!result.valid) {
        errors[field] = result.message || rule.message || "验证失败";
        break;
      }
    }
  }

  return errors;
}

/**
 * 验证单个字段
 */
export function validateField(
  value: any,
  rule: ValidationRule
): ValidationResult {
  // 必填验证
  if (rule.required && (!value || value.toString().trim() === "")) {
    return { valid: false, message: rule.message || "此字段为必填项" };
  }

  // 如果值为空且不是必填，则跳过其他验证
  if (!value || value.toString().trim() === "") {
    return { valid: true };
  }

  const strValue = value.toString();

  // 最小长度验证
  if (rule.min && strValue.length < rule.min) {
    return {
      valid: false,
      message: rule.message || `最少需要${rule.min}个字符`,
    };
  }

  // 最大长度验证
  if (rule.max && strValue.length > rule.max) {
    return {
      valid: false,
      message: rule.message || `最多允许${rule.max}个字符`,
    };
  }

  // 正则验证
  if (rule.pattern && !rule.pattern.test(strValue)) {
    return { valid: false, message: rule.message || "格式不正确" };
  }

  // 自定义验证
  if (rule.validator) {
    const result = rule.validator(value);
    if (result === false) {
      return { valid: false, message: rule.message || "验证失败" };
    }
    if (typeof result === "string") {
      return { valid: false, message: result };
    }
  }

  return { valid: true };
}

/**
 * 验证对象是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证是否为数字
 */
export function isNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * 验证是否为整数
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(Number(value));
}

/**
 * 验证是否为浮点数
 */
export function isFloat(value: any): boolean {
  return isNumber(value) && !isInteger(value);
}

/**
 * 验证是否为有效的日期
 */
export function isValidDate(value: any): boolean {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 验证是否为有效的JSON
 */
export function isValidJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证数组是否包含指定值
 */
export function arrayContains(array: any[], value: any): boolean {
  return array.includes(value);
}

/**
 * 验证数组长度
 */
export function validateArrayLength(
  array: any[],
  min: number,
  max?: number
): ValidationResult {
  if (array.length < min) {
    return { valid: false, message: `数组长度不能少于${min}个元素` };
  }

  if (max && array.length > max) {
    return { valid: false, message: `数组长度不能超过${max}个元素` };
  }

  return { valid: true };
}

/**
 * 验证文件大小
 */
export function validateFileSize(
  file: File,
  maxSize: number
): ValidationResult {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
    return { valid: false, message: `文件大小不能超过${maxSizeMB}MB` };
  }

  return { valid: true };
}

/**
 * 验证文件类型
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): ValidationResult {
  const fileType = file.type;
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  const isAllowed = allowedTypes.some((type) => {
    if (type.startsWith(".")) {
      return fileExtension === type.substring(1);
    }
    return fileType.includes(type);
  });

  if (!isAllowed) {
    return {
      valid: false,
      message: `文件类型必须是: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}
