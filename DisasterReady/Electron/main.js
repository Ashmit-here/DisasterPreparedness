import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

const checklistFilePath = () =>
  path.join(app.getPath('userData'), 'checklist.json');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'DisasterReady',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

ipcMain.handle('app:get-info', () => ({
  name: 'DisasterReady',
  version: app.getVersion(),
}));

ipcMain.handle('checklist:load', async () => {
  try {
    const filePath = checklistFilePath();
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    if (!Array.isArray(data.checkedItems)) {
      return [];
    }

    return data.checkedItems.filter(
      (id) => Number.isInteger(id) && id >= 1 && id <= 11
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    console.error('Failed to load checklist:', error.message, error.stack);
    return [];
  }
});

ipcMain.handle('checklist:save', async (_event, checkedItems) => {
  if (
    !Array.isArray(checkedItems) ||
    !checkedItems.every(
      (id) => Number.isInteger(id) && id >= 1 && id <= 11
    )
  ) {
    throw new Error('Invalid checklist data.');
  }

  const filePath = checklistFilePath();

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(
    filePath,
    JSON.stringify({ checkedItems }, null, 2),
    'utf8'
  );

  return { success: true };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}
);

ipcMain.handle('quiz:load-results', async () => {
  try {
    const filePath = path.join(app.getPath('userData'), 'quiz-results.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    return {
      attempts: Number.isInteger(data.attempts) ? data.attempts : 0,
      latestScore: Number.isInteger(data.latestScore) ? data.latestScore : 0,
      bestScore: Number.isInteger(data.bestScore) ? data.bestScore : 0,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        attempts: 0,
        latestScore: 0,
        bestScore: 0,
      };
    }

    console.error('Failed to load quiz results:', error);

    return {
      attempts: 0,
      latestScore: 0,
      bestScore: 0,
    };
  }
});

ipcMain.handle('quiz:save-results', async (_event, score, totalQuestions) => {
  if (
    !Number.isInteger(score) ||
    !Number.isInteger(totalQuestions) ||
    totalQuestions <= 0 ||
    score < 0 ||
    score > totalQuestions
  ) {
    throw new Error('Invalid quiz results.');
  }

  const filePath = path.join(app.getPath('userData'), 'quiz-results.json');

  let previousResults = {
    attempts: 0,
    latestScore: 0,
    bestScore: 0,
  };

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    if (Number.isInteger(data.attempts) && data.attempts >= 0) {
      previousResults.attempts = data.attempts;
    }

    if (Number.isInteger(data.bestScore)) {
      previousResults.bestScore = data.bestScore;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Could not read previous quiz results:', error);
    }
  }

  const results = {
    attempts: previousResults.attempts + 1,
    latestScore: score,
    bestScore: Math.max(previousResults.bestScore, score),
    totalQuestions,
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(filePath, JSON.stringify(results, null, 2), 'utf8');

  return { success: true, results };
});