import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { server } from './mcp.js';
import { getBaziDetail } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from public directory
// Try dist/public first (production), then public (development)
const publicPath = join(__dirname, '../public');
app.use(express.static(publicPath));

// Bazi calculation API endpoint
app.post('/api/bazi', async (req, res) => {
  try {
    const { solarDatetime, lunarDatetime, gender, eightCharProviderSect } = req.body;

    if (!solarDatetime && !lunarDatetime) {
      return res.status(400).json({ error: 'solarDatetime和lunarDatetime必须传且只传其中一个。' });
    }

    const result = await getBaziDetail({
      solarDatetime,
      lunarDatetime,
      gender,
      eightCharProviderSect,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Bazi calculation error:', error);
    res.status(500).json({ error: error.message || '计算失败' });
  }
});

// MCP endpoint
app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on('close', () => {
    transport.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3000');
const host = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

// Get local IP addresses for display
import { networkInterfaces } from 'os';
const getLocalIPs = () => {
  const interfaces = networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
};

app
  .listen(port, host, () => {
    console.log(`\n🚀 Server is running!`);
    console.log(`\n📍 Local access:`);
    console.log(`   Web interface: http://localhost:${port}/`);
    console.log(`   MCP endpoint: http://localhost:${port}/mcp`);
    console.log(`   Bazi API: http://localhost:${port}/api/bazi`);
    
    const localIPs = getLocalIPs();
    if (localIPs.length > 0) {
      console.log(`\n🌐 Network access (share with friends on same network):`);
      localIPs.forEach(ip => {
        console.log(`   Web interface: http://${ip}:${port}/`);
        console.log(`   Bazi API: http://${ip}:${port}/api/bazi`);
      });
    }
    console.log(`\n💡 Tips:`);
    console.log(`   - Make sure your firewall allows connections on port ${port}`);
    console.log(`   - Friends on the same WiFi/network can use the IP addresses above`);
    console.log(`   - For public access, consider using ngrok or similar tools\n`);
  })
  .on('error', (error) => {
    console.error('Server error', error);
    process.exit(1);
  });
