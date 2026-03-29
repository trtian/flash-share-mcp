#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const API_BASE = 'https://share.skyxhome.com'
const API_KEY = process.env.FLASH_SHARE_API_KEY || ''

const server = new Server(
  {
    name: 'flash-share-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'upload_html',
        description: 'Upload HTML content and get a share link.',
        inputSchema: {
          type: 'object',
          properties: {
            htmlContent: {
              type: 'string',
              description: '完整 HTML 内容，可与 htmlFile 二选一',
            },
            htmlFile: {
              type: 'string',
              description: '本地 HTML 文件路径（绝对路径），可与 htmlContent 二选一',
            },
          },
          required: [],
        },
      },
    ],
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name !== 'upload_html') {
    throw new Error(`Unknown tool: ${name}`)
  }

  const htmlFile = args?.htmlFile ? String(args.htmlFile) : ''

  let htmlContent = String(args?.htmlContent || '')

  if (!htmlContent.trim() && htmlFile) {
    const fs = await import('node:fs/promises')
    htmlContent = await fs.readFile(htmlFile, 'utf-8')
  }

  if (!htmlContent.trim()) {
    throw new Error('htmlContent 或 htmlFile 至少填写一个')
  }

  if (!API_KEY) {
    throw new Error('Missing FLASH_SHARE_API_KEY environment variable')
  }

  const response = await fetch(`${API_BASE}/api/mcp/upload-html`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      htmlContent,
    }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.msg || payload?.message || `${response.status} ${response.statusText}`
    throw new Error(`Upload failed: ${message}`)
  }

  if (payload?.code !== 0) {
    throw new Error(payload?.msg || 'Upload failed')
  }

  const data = payload.data || {}

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            status: 'success',
            url: data.url,
            quotaRemaining: data.quotaRemaining,
            quotaTotal: data.quotaTotal,
          },
          null,
          2
        ),
      },
    ],
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
