# Flash Share MCP

> 把 AI 生成的 HTML，一键变成可分享链接。  
> 适用于 Cursor、Claude Desktop 等支持 MCP 的 AI Agent。

## 项目简介

`flash-share-mcp` 是 FlashShare 的 MCP 服务。
你可以在 AI Agent 中直接调用工具 `upload_html`，上传 HTML 后返回：

- `url`（分享链接）
- `quotaRemaining`（剩余额度）
- `quotaTotal`（总额度）

---

## 使用前准备

1. 先访问 https://share.skyxhome.com/ 购买 API Key 套餐，拿到可用 `FLASH_SHARE_API_KEY`
2. 确保运行环境为 Node.js 18+

---

## MCP 集成模式（推荐）

本项目当前采用 **Stdio 模式**（最稳定、最通用）。

### 模式说明

- MCP Host（如 Cursor/Claude Desktop）拉起本进程
- 通过标准输入输出进行 MCP 通信
- 无需额外部署 HTTP 服务

### 推荐接入方式（npx）

与前端文档保持一致，服务名建议固定为 `h5-share`：

```json
{
  "mcpServers": {
    "h5-share": {
      "command": "npx",
      "args": ["-y", "flash-share-mcp"],
      "env": {
        "FLASH_SHARE_API_KEY": "ok_xxx"
      }
    }
  }
}
```

### 本地源码接入（开发者）

```bash
cd share-mcp
npm install
node index.js
```

也可在 MCP 配置中直接指向本地 `index.js`：

```json
{
  "mcpServers": {
    "h5-share": {
      "command": "node",
      "args": ["/绝对路径/share-mcp/index.js"],
      "env": {
        "FLASH_SHARE_API_KEY": "ok_xxx"
      }
    }
  }
}
```

---

## 工具说明

### 工具名

`upload_html`

### 入参

- `htmlContent`（可选）：完整 HTML 字符串
- `htmlFile`（可选）：本地 HTML 文件绝对路径

> `htmlContent` 与 `htmlFile` 二选一即可。

### 返回

- `url`：分享链接
- `quotaRemaining`：剩余额度
- `quotaTotal`：总额度

返回示例：

```json
{
  "status": "success",
  "url": "https://share.skyxhome.com/...",
  "quotaRemaining": 49,
  "quotaTotal": 50
}
```

---

## 典型调用场景

你可以直接对 AI 说：

- “用 `upload_html` 发布这段 HTML 并返回链接”
- “把 `/绝对路径/demo.html` 上传到 FlashShare”

---

## 重要规则（请务必阅读）

- 上传成功后，页面会进入云端持续合规监测
- 若命中涉诈、违法、违规引流等风险，链接可能被自动冻结
- 冻结/拦截属于合规策略，不支持退款
- 请勿上传违法违规内容

---

## 环境变量

- `FLASH_SHARE_API_KEY`：必填，FlashShare API Key

---

## 开源协议

本项目基于 **MIT License** 开源，详见 [LICENSE](./LICENSE)。
