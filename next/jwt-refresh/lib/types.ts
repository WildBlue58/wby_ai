// 用户相关类型
export interface User {
  id: number;
  email: string;
  password?: string; // 可选，避免在响应中暴露密码
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 文章相关类型
export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: number;
    email: string;
  };
}

// JWT载荷类型
export interface JWTPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

// API响应类型
export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
  user?: User;
  post?: Post;
  posts?: Post[];
}

// 登录请求类型
export interface LoginRequest {
  email: string;
  password: string;
}

// 注册请求类型
export interface RegisterRequest {
  email: string;
  password: string;
}

// 创建文章请求类型
export interface CreatePostRequest {
  title: string;
  content: string;
  published?: boolean;
}
