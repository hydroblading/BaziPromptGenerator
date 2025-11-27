# 如何让网页公开访问 (How to Make Webpage Publicly Accessible)

## 方法 1: 使用 ngrok (推荐 - 最简单)

### 快速开始
1. **启动服务器** (在一个终端窗口):
   ```powershell
   .\start-server.bat
   ```
   或者:
   ```powershell
   cd bazi-mcp-dev
   npm run dev
   ```

2. **启动 ngrok 隧道** (在另一个终端窗口):
   ```powershell
   .\start-ngrok.bat
   ```
   或者使用一键启动脚本:
   ```powershell
   .\start-public.bat
   ```

3. **复制 ngrok 显示的公共 URL** (例如: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)

4. **分享这个 URL** 给任何人，他们就可以访问您的网页了！

### 获取固定域名 (可选)
- 免费注册 ngrok 账号: https://dashboard.ngrok.com/signup
- 获取 authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
- 配置 authtoken:
  ```powershell
  npx ngrok config add-authtoken YOUR_TOKEN
  ```
- 使用固定域名:
  ```powershell
  npx ngrok http 3000 --domain=your-domain.ngrok-free.app
  ```

---

## 方法 2: 使用 Cloudflare Tunnel (免费，更稳定)

1. 安装 Cloudflare Tunnel:
   ```powershell
   winget install --id Cloudflare.cloudflared
   ```

2. 登录 Cloudflare:
   ```powershell
   cloudflared tunnel login
   ```

3. 创建隧道:
   ```powershell
   cloudflared tunnel create bazi-web
   ```

4. 运行隧道:
   ```powershell
   cloudflared tunnel --url http://localhost:3000
   ```

---

## 方法 3: 使用 localtunnel (简单，无需注册)

```powershell
npx localtunnel --port 3000
```

会显示一个公共 URL，例如: `https://xxxx.loca.lt`

---

## 方法 4: 部署到云服务 (永久解决方案)

### Vercel (推荐)
1. 安装 Vercel CLI:
   ```powershell
   npm i -g vercel
   ```

2. 在项目目录运行:
   ```powershell
   cd bazi-mcp-dev
   vercel
   ```

### Railway
1. 访问 https://railway.app
2. 连接 GitHub 仓库
3. 部署项目

### Render
1. 访问 https://render.com
2. 创建新的 Web Service
3. 连接仓库并部署

---

## 方法 5: 路由器端口转发 (仅限本地网络)

如果您想让同一网络的人访问:

1. 找到您的本地 IP 地址 (服务器启动时会显示)
2. 在路由器设置中配置端口转发:
   - 外部端口: 3000 (或任意端口)
   - 内部 IP: 您的电脑 IP
   - 内部端口: 3000
3. 确保防火墙允许端口 3000
4. 使用您的公网 IP 访问: `http://YOUR_PUBLIC_IP:3000`

---

## 安全提示

⚠️ **重要**: 公开访问您的服务器时请注意:

1. **不要暴露敏感信息** - 确保 API 端点有适当的验证
2. **使用 HTTPS** - ngrok 和 Cloudflare Tunnel 默认提供 HTTPS
3. **限制访问** - 考虑添加身份验证或 IP 白名单
4. **监控使用** - 定期检查访问日志

---

## 推荐方案对比

| 方案 | 难度 | 成本 | 稳定性 | 推荐度 |
|------|------|------|--------|--------|
| ngrok | ⭐ 简单 | 免费/付费 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Cloudflare Tunnel | ⭐⭐ 中等 | 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| localtunnel | ⭐ 简单 | 免费 | ⭐⭐ | ⭐⭐⭐ |
| 云部署 | ⭐⭐⭐ 复杂 | 免费/付费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 端口转发 | ⭐⭐ 中等 | 免费 | ⭐⭐⭐ | ⭐⭐ |

