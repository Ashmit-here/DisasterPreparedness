// Electron's main process creates the desktop window and saves local data.
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

// Keep user data in Electron's safe app-data folder.
const checklistFilePath = () =>
  path.join(app.getPath('userData'), 'checklist.json');

const quizResultsFilePath = () =>
  path.join(app.getPath('userData'), 'quiz-results.json');

const emptyQuizResults = () => ({
  attempts: 0,
  previousScore: null,
  latestScore: 0,
  bestScore: 0,
  lastAttemptId: null,
});

// Return safe quiz values even if an old save file is incomplete.
function normaliseQuizResults(data, totalQuestions) {
  const isScore = (value) =>
    Number.isInteger(value) && value >= 0 && value <= totalQuestions;

  return {
    attempts:
      Number.isInteger(data?.attempts) && data.attempts >= 0
        ? data.attempts
        : 0,
    previousScore: isScore(data?.previousScore) ? data.previousScore : null,
    latestScore: isScore(data?.latestScore) ? data.latestScore : 0,
    bestScore: isScore(data?.bestScore) ? data.bestScore : 0,
    lastAttemptId:
      typeof data?.lastAttemptId === 'string' ? data.lastAttemptId : null,
  };
}

// Create the main desktop window and load Vite in development.
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

// IPC handlers let the React page ask Electron for app data safely.
ipcMain.handle('app:get-info', () => ({
  name: 'DisasterReady',
  version: app.getVersion(),
}));

// Read and validate the saved emergency-kit checklist.
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

// Save a validated checklist to JSON.
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

// Start Electron after it has finished initial setup.
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

// Read saved quiz statistics.
ipcMain.handle('quiz:load-results', async () => {
  try {
    const fileContents = await fs.readFile(quizResultsFilePath(), 'utf8');
    const data = JSON.parse(fileContents);

    return {
      attempts: Number.isInteger(data.attempts) ? data.attempts : 0,
      previousScore: Number.isInteger(data.previousScore)
        ? data.previousScore
        : null,
      latestScore: Number.isInteger(data.latestScore) ? data.latestScore : 0,
      bestScore: Number.isInteger(data.bestScore) ? data.bestScore : 0,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return emptyQuizResults();
    }

    console.error('Failed to load quiz results:', error);

    return emptyQuizResults();
  }
});

// Save one quiz attempt. The attempt id prevents retrying from adding duplicates.
ipcMain.handle('quiz:save-results', async (_event, score, totalQuestions, attemptId) => {
  if (
    !Number.isInteger(score) ||
    !Number.isInteger(totalQuestions) ||
    totalQuestions <= 0 ||
    score < 0 ||
    score > totalQuestions
  ) {
    throw new Error('Invalid quiz results.');
  }

  if (typeof attemptId !== 'string' || attemptId.length === 0 || attemptId.length > 200) {
    throw new Error('Invalid quiz attempt.');
  }

  const filePath = quizResultsFilePath();
  let previousResults = emptyQuizResults();

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    previousResults = normaliseQuizResults(JSON.parse(fileContents), totalQuestions);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Could not read previous quiz results:', error);
    }
  }

  if (previousResults.lastAttemptId === attemptId) {
    return { success: true, results: previousResults };
  }

  const results = {
    attempts: previousResults.attempts + 1,
    previousScore: previousResults.attempts > 0 ? previousResults.latestScore : null,
    latestScore: score,
    bestScore: Math.max(previousResults.bestScore, score),
    totalQuestions,
    lastAttemptId: attemptId,
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(filePath, JSON.stringify(results, null, 2), 'utf8');

  return { success: true, results };
});
