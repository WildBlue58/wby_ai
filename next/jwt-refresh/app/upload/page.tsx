"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { type HashWorkerOut, type HashWorkerIn } from "../hash.worker";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5M一片
const MAX_CONCURRENCY = 4; // 最大并发数
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB 最大文件大小
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/zip",
  "video/mp4",
];

type InitResp = {
  complete: boolean;
  uploaded: number[];
};

type UploadStatus =
  | "idle"
  | "hashing"
  | "uploading"
  | "merging"
  | "completed"
  | "error"
  | "paused";

const Upload = () => {
  const [hash, setHash] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string>("");
  const [uploadSpeed, setUploadSpeed] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const totalChunks = useMemo(
    () => (file ? Math.ceil(file.size / CHUNK_SIZE) : 0),
    [file]
  );

  // 可变对象
  const workerRef = useRef<Worker | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // 缓存值
  const pausedRef = useRef<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const uploadedBytesRef = useRef<number>(0);

  useEffect(() => {
    const worker = new Worker(new URL("../hash.worker.ts", import.meta.url));
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent<HashWorkerOut>) => {
      const msg = e.data;
      if (msg.type === "PROGRESS") {
        setStatus(`计算中 ${(msg.progress * 100).toFixed(2)}%`);
      }
      if (msg.type === "DONE") {
        setHash(msg.hash);
        setStatus(`哈希:${msg.hash}`);
        setUploadStatus("idle"); // 哈希计算完成，更新状态为准备就绪
      }
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // 文件验证函数
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `文件大小超过限制 (${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(
        0
      )}MB)`;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "不支持的文件类型";
    }
    return null;
  };

  // 生成文件预览
  const generateFilePreview = (file: File) => {
    const reader = new FileReader();

    if (file.type.startsWith("image/")) {
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // 对于非图片文件，清除预览
      setFilePreview("");
    }
  };

  // 获取文件类型图标
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return (
        <svg
          className="h-12 w-12 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (fileType === "application/pdf") {
      return (
        <svg
          className="h-12 w-12 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <svg
          className="h-12 w-12 text-purple-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    } else {
      return (
        <svg
          className="h-12 w-12 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  const handleFile = useCallback(async (f: File) => {
    // 重置状态
    setError("");
    setUploadStatus("idle");
    setProgress(0);
    setUploadSpeed("");
    setTimeRemaining("");
    setFilePreview("");

    // 验证文件
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      setUploadStatus("error");
      return;
    }

    setFile(f);
    generateFilePreview(f); // 生成文件预览
    setUploadStatus("hashing");
    setStatus("计算文件哈希中...");
    workerRef.current?.postMessage({
      type: "HASH",
      file: f,
      chunkSize: CHUNK_SIZE,
    } as HashWorkerIn);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      handleFile(f);
    }
  };

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const droppedFile = files[0];
      handleFile(droppedFile);
    }
  };

  const initUpload = async (): Promise<InitResp> => {
    const res = await fetch("/api/upload/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileHash: hash,
        fileName: file!.name,
        fileSize: file!.size,
        chunkSize: CHUNK_SIZE,
        totalChunks,
      }),
    });
    return res.json() as Promise<InitResp>;
  };

  const pause = () => {
    pausedRef.current = true;
    abortRef.current?.abort();
    setUploadStatus("paused");
    setStatus("上传已暂停");
  };

  const resume = async () => {
    if (!file || !hash) return;
    setUploadStatus("uploading");
    setStatus("继续上传...");
    await startUpload();
  };

  // 计算上传速度和剩余时间
  const updateSpeed = useCallback(
    (uploadedBytes: number) => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000; // 秒
      if (elapsed > 0) {
        const speed = uploadedBytes / elapsed; // bytes per second
        setUploadSpeed(`${(speed / (1024 * 1024)).toFixed(2)} MB/s`);

        const remainingBytes = (file?.size || 0) - uploadedBytes;
        const remainingTime = remainingBytes / speed;
        if (remainingTime > 0 && remainingTime < 3600) {
          setTimeRemaining(`${Math.round(remainingTime)}s`);
        } else if (remainingTime >= 3600) {
          setTimeRemaining(`${Math.round(remainingTime / 60)}m`);
        }
      }
    },
    [file?.size]
  );

  const uploadChunk = async (index: number, signal: AbortSignal) => {
    const start = index * CHUNK_SIZE;
    const end = Math.min(file!.size, start + CHUNK_SIZE);
    const blob = file!.slice(start, end);

    try {
      const res = await fetch("/api/upload/chunk", {
        method: "PUT",
        headers: {
          "x-file-hash": hash,
          "x-chunk-index": String(index),
        },
        body: blob,
        signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `分片${index}上传失败 (${res.status})`
        );
      }

      // 更新已上传字节数
      uploadedBytesRef.current += blob.size;
      updateSpeed(uploadedBytesRef.current);

      return res.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
      throw new Error(
        `分片${index}上传失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`
      );
    }
  };
  const mergeAll = async () => {
    const res = await fetch("/api/upload/merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileHash: hash,
      }),
    });
    return res.json();
  };
  const startUpload = async () => {
    if (!file || !hash) {
      setError("请先选择文件并等待哈希计算完成");
      setUploadStatus("error");
      return;
    }

    try {
      setUploadStatus("uploading");
      setError("");
      setStatus("初始化上传...");
      abortRef.current = new AbortController();
      pausedRef.current = false;
      startTimeRef.current = Date.now();
      uploadedBytesRef.current = 0;

      const init = await initUpload();

      if (init.complete) {
        setProgress(100);
        setUploadStatus("completed");
        setStatus("秒传完成！文件已存在");
        setUploadSpeed("");
        setTimeRemaining("");
        return;
      }

      // 不可重复的切片index 存储
      const uploaded = new Set<number>(init.uploaded ?? []);
      let done = uploaded.size;
      setProgress(Math.floor((done / totalChunks) * 100));

      // 计算已上传的字节数
      uploadedBytesRef.current = done * CHUNK_SIZE;
      if (uploadedBytesRef.current > file.size) {
        uploadedBytesRef.current = file.size;
      }

      // 并发限流 队列
      const queue: number[] = [];
      for (let i = 0; i < totalChunks; i++) {
        if (!uploaded.has(i)) {
          queue.push(i);
        }
      }

      // upload worker
      const workers: Promise<void>[] = [];
      const next = async () => {
        if (pausedRef.current) return; // 暂停
        const idx = queue.shift();
        if (idx === undefined) return;
        try {
          await uploadChunk(idx, abortRef.current!.signal);
          done++;
          setProgress(Math.floor((done / totalChunks) * 100));
        } catch (error) {
          throw error;
        } finally {
          if (queue.length && !pausedRef.current) await next();
        }
      };

      for (let c = 0; c < Math.min(MAX_CONCURRENCY, queue.length); c++) {
        workers.push(next());
      }

      setStatus("分片上传中...");
      await Promise.all(workers);

      if (pausedRef.current) {
        setStatus("已暂停");
        return;
      }

      setUploadStatus("merging");
      setStatus("合并分片...");
      const r = await mergeAll();

      if (r?.ok) {
        setUploadStatus("completed");
        setProgress(100);
        setStatus("上传完成！");
        setUploadSpeed("");
        setTimeRemaining("");
      } else {
        throw new Error("合并失败");
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setUploadStatus("paused");
        setStatus("已暂停");
      } else {
        console.error(err);
        setUploadStatus("error");
        setError(err?.message || "上传错误");
        setStatus("上传失败");
      }
    }
  };
  // 获取状态对应的颜色
  const getStatusColor = (status: UploadStatus) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "error":
        return "text-red-600 bg-red-50";
      case "uploading":
        return "text-blue-600 bg-blue-50";
      case "merging":
        return "text-purple-600 bg-purple-50";
      case "paused":
        return "text-yellow-600 bg-yellow-50";
      case "hashing":
        return "text-indigo-600 bg-indigo-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // 获取进度条颜色
  const getProgressColor = () => {
    switch (uploadStatus) {
      case "completed":
        return "bg-gradient-to-r from-green-400 to-green-600";
      case "error":
        return "bg-gradient-to-r from-red-400 to-red-600";
      case "uploading":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "merging":
        return "bg-gradient-to-r from-purple-400 to-purple-600";
      case "hashing":
        return "bg-gradient-to-r from-indigo-400 to-indigo-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-4xl p-8">
        {/* 头部 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            智能文件上传系统
          </h1>
          <p className="text-lg text-gray-600">
            支持大文件分片上传、断点续传、秒传功能
          </p>
        </div>

        {/* 文件选择区域 */}
        <div className="mb-8">
          <label className="group relative block cursor-pointer">
            <div
              className={`rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ${
                isDragOver
                  ? "border-blue-500 bg-blue-100 scale-105"
                  : "border-gray-300 bg-white group-hover:border-blue-400 group-hover:bg-blue-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file && filePreview ? (
                // 图片预览模式
                <div className="text-center">
                  <div className="mx-auto mb-4 max-h-[500px] max-w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                    <img
                      src={filePreview}
                      alt={file.name}
                      className="mx-auto max-h-[460px] w-auto max-w-full object-contain transition-transform duration-200 hover:scale-105"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-gray-900 truncate px-4">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : file ? (
                // 非图片文件模式
                <div className="text-center">
                  <div className="mx-auto mb-4">
                    {getFileTypeIcon(file.type)}
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
                  </p>
                </div>
              ) : (
                // 默认选择模式
                <div className="text-center">
                  <svg
                    className={`mx-auto h-12 w-12 transition-colors duration-200 ${
                      isDragOver
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-blue-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p
                    className={`mt-2 text-lg font-medium transition-colors duration-200 ${
                      isDragOver ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    {isDragOver
                      ? "释放文件以上传"
                      : "点击选择文件或拖拽文件到此处"}
                  </p>
                  <p className="text-sm text-gray-500">
                    支持图片、PDF、视频等格式，最大{" "}
                    {MAX_FILE_SIZE / (1024 * 1024)}MB
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={onFileChange}
              accept={ALLOWED_FILE_TYPES.join(",")}
            />
          </label>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-sm font-medium text-red-800">
                {error}
              </span>
            </div>
          </div>
        )}

        {/* 文件信息卡片 */}
        {file && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">文件信息</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                  uploadStatus
                )}`}
              >
                {uploadStatus === "idle"
                  ? "准备就绪"
                  : uploadStatus === "hashing"
                  ? "计算哈希"
                  : uploadStatus === "uploading"
                  ? "上传中"
                  : uploadStatus === "merging"
                  ? "合并中"
                  : uploadStatus === "completed"
                  ? "已完成"
                  : uploadStatus === "paused"
                  ? "已暂停"
                  : uploadStatus === "error"
                  ? "错误"
                  : "未知"}
              </span>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-sm font-medium text-gray-500">文件名</div>
                <div className="mt-1 truncate text-lg font-semibold text-gray-900">
                  {file.name}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-sm font-medium text-gray-500">
                  文件大小
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-sm font-medium text-gray-500">
                  分片信息
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {CHUNK_SIZE / (1024 * 1024)}MB × {totalChunks}片
                </div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-700">上传进度</span>
                <span className="font-medium text-gray-700">{progress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-3 transition-all duration-300 ease-out ${getProgressColor()}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* 状态信息 */}
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <div className="mr-2 h-2 w-2 rounded-full bg-current"></div>
                {status}
              </div>
              {uploadSpeed && (
                <div className="flex items-center text-blue-600">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  速度: {uploadSpeed}
                </div>
              )}
              {timeRemaining && (
                <div className="flex items-center text-green-600">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  剩余: {timeRemaining}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              <button
                className="flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !file ||
                  !hash ||
                  uploadStatus === "uploading" ||
                  uploadStatus === "merging" ||
                  uploadStatus === "hashing"
                }
                onClick={startUpload}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                开始上传
              </button>

              <button
                className="flex items-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploadStatus !== "uploading"}
                onClick={pause}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                暂停
              </button>

              <button
                className="flex items-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploadStatus !== "paused"}
                onClick={resume}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                继续
              </button>

              <button
                className="flex items-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl"
                onClick={() => {
                  setFile(null);
                  setHash("");
                  setProgress(0);
                  setStatus("");
                  setError("");
                  setUploadStatus("idle");
                  setUploadSpeed("");
                  setTimeRemaining("");
                  setFilePreview("");
                }}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                重新选择
              </button>
            </div>
          </div>
        )}

        {/* 功能特性说明 */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              分片上传
            </h3>
            <p className="text-sm text-gray-600">
              大文件自动分片，提高上传成功率
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              断点续传
            </h3>
            <p className="text-sm text-gray-600">网络中断后可从断点继续上传</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              秒传功能
            </h3>
            <p className="text-sm text-gray-600">
              相同文件自动识别，无需重复上传
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Upload;
