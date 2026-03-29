const API_BASE = 'https://share.skyxhome.com'
const API_KEY = process.env.FLASH_SHARE_API_KEY || ''

if (!API_KEY) {
  console.error('❌ Missing FLASH_SHARE_API_KEY environment variable')
  process.exit(1)
}

const htmlContent = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MCP Upload Test</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 32px; background: #f6fffb; color: #134e4a; }
    .card { max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #a7f3d0; border-radius: 14px; padding: 24px; }
    h1 { margin: 0 0 12px; font-size: 28px; }
    p { line-height: 1.7; }
  </style>
</head>
<body>
  <div class="card">
    <h1>MCP 上传测试成功</h1>
    <p>如果你能看到此页面，说明 <code>/api/mcp/upload-html</code> 接口工作正常。</p>
    <p>Generated at: ${new Date().toISOString()}</p>
  </div>
</body>
</html>`

async function run() {
  const res = await fetch(`${API_BASE}/api/mcp/upload-html`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      fileName: 'mcp-test.html',
      htmlContent,
    }),
  })

  const text = await res.text()
  let payload = null

  try {
    payload = JSON.parse(text)
  } catch {
    console.error('❌ Response is not JSON:')
    console.error(text)
    process.exit(1)
  }

  if (!res.ok || payload?.code !== 0) {
    console.error('❌ Upload failed:')
    console.error(JSON.stringify(payload, null, 2))
    process.exit(1)
  }

  console.log('✅ Upload success')
  console.log(`URL: ${payload.data?.url}`)
  console.log(`quota: ${payload.data?.quotaRemaining}/${payload.data?.quotaTotal}`)
}

run().catch((err) => {
  console.error('❌ Request error:', err.message)
  process.exit(1)
})
