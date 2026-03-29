# Flash Share MCP

一个轻量级 MCP 服务端，让支持 MCP 的 AI 客户端可以直接上传 HTML，并返回 FlashShare 分享链接。

## 项目定位

`flash-share-mcp` 专注做一件事：
把 MCP 客户端（如 Claude Desktop、Cursor 等）接入 FlashShare 的 HTML 上传能力。

典型场景：
- AI 生成的 HTML 一键发布为可访问链接
- 减少手工复制、打开网页上传的步骤
- 统一走 FlashShare API Key 额度管理

## 功能特性

- 提供一个 MCP 工具：`upload_html`
- 支持两种输入方式：
  - `htmlContent`：直接传 HTML 文本
  - `htmlFile`：传本地 HTML 绝对路径
- 返回结果包含：
  - `url`
  - `quotaRemaining`
  - `quotaTotal`

## 环境要求

- Node.js 18+
- 可用的 FlashShare API Key

## 安装

### 方式 A：本地开发运行

```bash
cd share-mcp
npm install
```

### 方式 B：全局安装（可选）

```bash
npm install -g .
```

## MCP 集成模式（重点）

当前仓库已实现并推荐 **stdio 模式**。

### 1）Stdio 模式（已实现）

MCP Host 以子进程方式拉起本服务，通过标准输入输出通信。

先配置环境变量：

```bash
export FLASH_SHARE_API_KEY="你的_api_key"
```

然后在 MCP Host 配置中注册服务。

#### 通用 MCP 配置示例

```json
{
  "mcpServers": {
    "flash-share": {
      "command": "node",
      "args": ["/绝对路径/share-mcp/index.js"],
      "env": {
        "FLASH_SHARE_API_KEY": "你的_api_key"
      }
    }
  }
}
```

#### 全局安装后的示例

```json
{
  "mcpServers": {
    "flash-share": {
      "command": "flash-share-mcp",
      "args": [],
      "env": {
        "FLASH_SHARE_API_KEY": "你的_api_key"
      }
    }
  }
}
```

### 2）HTTP 模式（本仓库暂未实现）

如果你要做跨机器共享 MCP 服务，可在当前工具逻辑外层加 HTTP Transport。
本项目目前聚焦本地 stdio，部署更简单、密钥更安全。

## 工具定义

### `upload_html`

输入参数：
- `htmlContent`（string，可选）
- `htmlFile`（string，可选，本地绝对路径）

规则：
- `htmlContent` / `htmlFile` 至少传一个
- 两者都传时，优先使用 `htmlContent`

返回示例：

```json
{
  "status": "success",
  "url": "https://...",
  "quotaRemaining": 49,
  "quotaTotal": 50
}
```

## 快速测试

接入 MCP Host 后，可以直接对 AI 客户端说：

- “用 `upload_html` 发布这段 HTML”
- “把 `/绝对路径/demo.html` 上传并返回链接”

## 配置说明

- 当前 API 地址在 `index.js` 中固定为：
  - `https://share.skyxhome.com`
- API Key 从环境变量读取：
  - `FLASH_SHARE_API_KEY`

## 安全建议

- 不要把真实 API Key 提交到代码仓库
- 建议通过环境变量或 Secret 注入
- 一旦泄露请立即轮换 API Key

## 计划路线

- [ ] 支持环境变量自定义 API Base URL
- [ ] 更细粒度错误码
- [ ] 可选 HTTP Transport 模式
- [ ] 发布到 npm

## 开源协议

本项目采用 **MIT License**。
详见 [LICENSE](./LICENSE)。
