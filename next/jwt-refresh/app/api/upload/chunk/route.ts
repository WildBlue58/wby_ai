import { NextRequest, NextResponse } from "next/server";
import { saveChunk } from "@/lib/upload-server";

export async function PUT(req: NextRequest) {
  // blob 写入服务器文件
  const fileHash = req.headers.get("x-file-flash");
  const chunkIndex = Number(req.headers.get("x-chunk-index"));

  if (!fileHash || Number.isNaN(chunkIndex)) {
    return NextResponse.json(
      { error: "减少x-file-hash或x-chunk-index" },
      { status: 400 }
    );
  }

  // 请求体二进制数据全部到达后
  // Node.js 的 Buffer 就像一个临时存放二进制数据的"小盒子""
  // 比如文件或网络传输的数据，它能在内存中直接操作字节
  // 就像快递中转站里暂存包裹一样，方便快速处理
    const buf = Buffer.from(await req.arrayBuffer());
    await saveChunk(fileHash, chunkIndex, buf);
}
