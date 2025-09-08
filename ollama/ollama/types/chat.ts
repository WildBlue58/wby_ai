export type Message = {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
};

export type ChatResponse = {
  model: string;
  created_at: string;
  message: Message;
  total_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
};
