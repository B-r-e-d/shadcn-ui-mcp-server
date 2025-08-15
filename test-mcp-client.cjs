const { spawn } = require('child_process');

const server = spawn('node', ['build/index.js'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'inherit']
});

const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "get_component",
    arguments: { componentName: "button" }
  }
};

let outputBuffer = '';

server.stdout.on('data', (data) => {
  outputBuffer += data.toString();
  try {
    const jsonMatch = outputBuffer.match(/{.*}/s);
    if (jsonMatch) {
      const response = JSON.parse(jsonMatch[0]);
      console.log('Server response:', response);
      server.kill();
    }
  } catch (e) {}
});

server.stdin.write(JSON.stringify(request) + '\n');

setTimeout(() => {
  if (server.exitCode === null) {
    console.error('No response from server after 5 seconds.');
    server.kill();
  }
}, 5000);