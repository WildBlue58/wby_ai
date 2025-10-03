import { supabase } from "./lib/supabaseClient.mjs";

// Backend as service
// 异步，node

// async function testSupabase() {
//   try {
//     console.log("🚀 开始测试 Supabase 连接...");

//     // 1. 检查连接和表结构
//     console.log("📋 检查表结构...");
//     const { data: existingData, error: queryError } = await supabase
//       .from("todos")
//       .select("*")
//       .limit(5);

//     if (queryError) {
//       console.error("❌ 数据库查询错误:", queryError);
//       return;
//     }

//     console.log("✅ 表结构检查成功");
//     console.log("📊 现有数据:", existingData);

//     // 2. 插入新数据
//     console.log("➕ 插入新数据...");
//     const { error: insertError } = await supabase.from("todos").insert({
//       title: "从0-1开发一个AI应用",
//       is_complete: false,
//     });

//     if (insertError) {
//       console.error("❌ 插入错误:", insertError);
//       return;
//     }

//     console.log("✅ 数据插入成功！");

//     // 3. 查询所有数据验证
//     console.log("🔍 查询所有数据...");
//     const { data: allData, error: fetchError } = await supabase
//       .from("todos")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (fetchError) {
//       console.error("❌ 查询错误:", fetchError);
//       return;
//     }

//     console.log("📋 所有待办事项:");
//     allData.forEach((todo, index) => {
//       console.log(
//         `${index + 1}. ${todo.title} - ${
//           todo.is_complete ? "✅ 已完成" : "⏳ 未完成"
//         }`
//       );
//     });
//   } catch (err) {
//     console.error("💥 程序错误:", err);
//   }
// }

// // 运行测试
// testSupabase();

const { data, error } = await supabase.from("todos").select("*");
console.log(data);