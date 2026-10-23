const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run predeploy" first.');
  process.exit(1);
}

// 1. Get the remote repository URL
let remoteUrl = '';
try {
  remoteUrl = execSync('git config --get remote.origin.url', { cwd: projectRoot, encoding: 'utf-8' }).trim();
} catch (e) {
  // fallback
  remoteUrl = 'https://github.com/sivaprakhash12/react-native-model-exam-2026.git';
}

if (!remoteUrl) {
  remoteUrl = 'https://github.com/sivaprakhash12/react-native-model-exam-2026.git';
}

console.log(`Using remote URL: ${remoteUrl}`);

// 2. Create a clean temporary directory
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-pages-deploy-'));
console.log(`Created temp deployment directory at: ${tempDir}`);

try {
  // 3. Copy dist contents recursively into tempDir
  fs.cpSync(distDir, tempDir, { recursive: true });
  console.log('Copied dist/ contents into temp directory.');

  // 4. Create empty .nojekyll file to prevent Jekyll from skipping _expo and other files
  fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');
  console.log('Created .nojekyll file.');

  // 5. Initialize git in tempDir, add everything (including node_modules assets if any), commit, and push
  execSync('git init -b gh-pages', { cwd: tempDir, stdio: 'inherit' });
  execSync(`git remote add origin "${remoteUrl}"`, { cwd: tempDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: tempDir, stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { cwd: tempDir, stdio: 'inherit' });

  console.log('Pushing to gh-pages branch...');
  execSync('git push --force origin gh-pages', { cwd: tempDir, stdio: 'inherit' });

  console.log('Successfully deployed to gh-pages branch!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
} finally {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Cleaned up temporary directory.');
  } catch (err) {
    // ignore cleanup errors
  }
}
