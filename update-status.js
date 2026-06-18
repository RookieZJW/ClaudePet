#!/usr/bin/env node
/**
 * Claude Code Hooks 桥接脚本
 *
 * 用法: node update-status.js <status> [tool_name]
 *
 * Claude Code hooks 配置中这样调用:
 *   node "E:/claude-pet/update-status.js" thinking
 *   node "E:/claude-pet/update-status.js" tool_use Bash
 *
 * 状态值:
 *   session_start      Claude Code 启动
 *   thinking           用户发送消息,开始思考
 *   tool_use           正在调用工具 (需传 tool_name)
 *   processing         工具执行完毕,继续处理
 *   waiting_permission 等待用户授权
 *   idle               待机
 *   session_end        Claude Code 退出
 *   error              出错
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

// 状态文件目录 ~/.claude-pet/
const STATUS_DIR = path.join(os.homedir(), ".claude-pet");
const STATUS_FILE = path.join(STATUS_DIR, "status.json");

// 解析参数
const status = process.argv[2] || "idle";
const tool = process.argv[3] || "";

// 有效的状态值
const validStatuses = [
  "session_start",
  "thinking",
  "tool_use",
  "processing",
  "waiting_permission",
  "idle",
  "session_end",
  "error",
  "subagent_start",
  "subagent_stop",
  "compacting",
];

// 确保目录存在
if (!fs.existsSync(STATUS_DIR)) {
  fs.mkdirSync(STATUS_DIR, { recursive: true });
}

// 构建状态对象
const statusData = {
  status: validStatuses.includes(status) ? status : "idle",
  tool: tool,
  timestamp: new Date().toISOString(),
};

// 写入状态文件 (原子化写入: 先写临时文件再重命名)
const tmpFile = STATUS_FILE + ".tmp";
fs.writeFileSync(tmpFile, JSON.stringify(statusData) + "\n", "utf-8");
fs.renameSync(tmpFile, STATUS_FILE);

// 也输出到 stdout 方便调试
console.log(
  `[Claude Pet] status → ${statusData.status}${tool ? " (" + tool + ")" : ""}`
);
