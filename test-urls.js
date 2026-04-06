const fs = require('fs');

async function testUrl(id) {
  const url = `https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(id, res.status);
  } catch(e) {
    console.log(id, 'ERROR');
  }
}

async function run() {
  await testUrl('1541819584618-93666f7f6a70');
  await testUrl('1534063229715-cda2899f8d16');
  await testUrl('1474487548417-781cb71495f3');
  await testUrl('1515162816999-a0c47dc192f7');
  await testUrl('1560179707-f14e90de1de0');
  await testUrl('1494412651409-8963ce7935a7');
  await testUrl('1436491865332-7a61a109cc05');
  await testUrl('1542296332-2e4473faf563'); // guy with jacket?
}

run();
