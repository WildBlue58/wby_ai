// 入口文件
// console.log("周杰伦的才华，羡慕")
// AI LLM sdk 事实标准
import OpenAI from 'openai'; // 模块化引入

const openai = new OpenAI({
    apiKey: 'sk-wiybwxcwsqfbwmodahgeygnrzemnfmsoibxidotzolhutetr',// 赚钱的 身份
    baseURL: 'https://api.siliconflow.cn/v1',// 国内转发服务商
 }); 

// 完成接口
// await 等待
const response = await openai.completions.create({
    // 通义千问
    model: 'Qwen/QwQ-32B',
    max_tokens: 256,
    temperature: 0.1,
    prompt: `
    Consideration product : 工厂现货PVC充气青蛙夜市地摊热卖充气玩具发光蛙儿童水上玩具

    1. Compose human readable product title used on Amazon in Chinese within 20 words.
    2. Write 5 selling points in Chinese for the products in Amazon.
    3. Evaluate a price range in Chinese for this product in China

    Output the result in json format with three properties called title, selling_points and price_range,resopnse in Chinese.
    `
    
})

console.log(response)
