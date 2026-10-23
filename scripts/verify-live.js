async function verifyLive() {
  const baseUrl = 'https://sivaprakhash12.github.io/react-native-model-exam-2026/';
  console.log(`Checking ${baseUrl}...`);
  
  const res = await fetch(baseUrl);
  console.log(`Main Page Status: ${res.status}`);
  const html = await res.text();
  
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  console.log(`HTML Title: ${titleMatch ? titleMatch[1] : 'Not found'}`);

  const match = html.match(/src="([^"]+\.js)"/);
  if (match) {
    const jsUrl = new URL(match[1], baseUrl).toString();
    console.log(`Testing JS Bundle: ${jsUrl}`);
    const jsRes = await fetch(jsUrl);
    console.log(`JS Bundle Status: ${jsRes.status} (OK: ${jsRes.ok})`);
  }

  const testFont = baseUrl + 'assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.6e435534bd35da5fef04168860a9b8fa.ttf';
  console.log(`Testing Font Asset: ${testFont}`);
  const fontRes = await fetch(testFont);
  console.log(`Font File Status: ${fontRes.status} (OK: ${fontRes.ok})`);

  const favicon = baseUrl + 'favicon.ico';
  const favRes = await fetch(favicon);
  console.log(`Favicon Status: ${favRes.status} (OK: ${favRes.ok})`);
}

verifyLive().catch(console.error);
