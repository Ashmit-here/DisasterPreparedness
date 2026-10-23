// Expose only these safe functions to the React page (not all of Electron).
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppInfo: () => ipcRenderer.invoke('app:get-info'),

  loadChecklist: () => ipcRenderer.invoke('checklist:load'),

  saveChecklist: (checkedItems) =>
    ipcRenderer.invoke('checklist:save', checkedItems),

  loadQuizResults: () => ipcRenderer.invoke('quiz:load-results'),

  saveQuizResults: (score, totalQuestions, attemptId) =>
    ipcRenderer.invoke('quiz:save-results', score, totalQuestions, attemptId),
});
