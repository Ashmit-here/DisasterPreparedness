import { useEffect, useRef, useState } from 'react';

// Questions are kept in one list. Each answer is the index of the correct option.
const questions = [
  {
    question: 'What should you do first when an earthquake starts?',
    options: [
      'Run toward the nearest window',
      'Drop, Cover, and Hold On',
      'Use the elevator',
      'Stand beside a tall bookshelf',
    ],
    answer: 1,
    explanation:
      'Drop to your hands and knees, cover your head and neck under sturdy furniture if possible, and hold on until the shaking stops.',
  },
  {
    question: 'What should you do if a road is covered with floodwater?',
    options: [
      'Drive through slowly',
      'Walk through if the water looks shallow',
      'Turn around and find a safer route',
      'Follow the vehicle in front of you',
    ],
    answer: 2,
    explanation:
      'Never walk, swim, or drive through floodwater. Its depth and current can be deceptive.',
  },
  {
    question: 'What is the safest way to escape a building during a fire?',
    options: [
      'Use the elevator',
      'Hide in a cupboard',
      'Collect all your belongings first',
      'Use the stairs and follow a safe escape route',
    ],
    answer: 3,
    explanation:
      'Use a safe escape route and stairs, not elevators. Stay low if there is smoke and never re-enter a burning building.',
  },
  {
    question: 'Where should you shelter during a cyclone?',
    options: [
      'Near windows to watch the storm',
      'In a sturdy interior room away from windows',
      'Under a tree outdoors',
      'On an exposed rooftop',
    ],
    answer: 1,
    explanation:
      'Stay indoors in a sturdy shelter, away from windows, and follow official evacuation instructions.',
  },
  {
    question: 'Which item is important in an emergency kit?',
    options: [
      'Drinking water',
      'Decorative items',
      'Gaming accessories',
      'Extra shoes only',
    ],
    answer: 0,
    explanation:
      'Drinking water is an essential emergency supply. A kit should also include food, first aid, medicines, a flashlight, and other necessities.',
  },
  {
    question: 'After an earthquake, what should you do about aftershocks?',
    options: [
      'Assume they cannot happen',
      'Stand beside damaged walls',
      'Stay alert and be ready to Drop, Cover, and Hold On again',
      'Immediately enter damaged buildings',
    ],
    answer: 2,
    explanation:
      'Aftershocks can occur after the main earthquake. Stay alert and avoid damaged structures.',
  },
  {
    question: 'During a fire, you notice smoke filling the escape route. What should you do?',
    options: [
      'Stay low while moving toward a safe exit',
      'Stand upright and run through the smoke',
      'Hide under the bed',
      'Open every window before leaving',
    ],
    answer: 0,
    explanation:
      'Smoke rises, so staying low can help you breathe while escaping. If the route is unsafe, use another safe exit if possible.',
  },
  {
    question: 'When is it safe to return to an evacuated area after a flood or cyclone?',
    options: [
      'As soon as the rain stops',
      'When a friend says it looks safe',
      'Immediately after the wind becomes quieter',
      'When authorities confirm it is safe',
    ],
    answer: 3,
    explanation:
      'Floodwater, damaged buildings, and electrical hazards can remain dangerous after the weather improves. Follow official guidance.',
  },
];

// Default values used before any quiz has been completed.
const initialSavedResults = {
  attempts: 0,
  previousScore: null,
  latestScore: 0,
  bestScore: 0,
};

// Browser storage is used when the app is opened without Electron.
const quizResultsStorageKey = 'disasterready.quiz-results';

// Protect the interface from missing or invalid saved values.
const normaliseResults = (results) => ({
  attempts: Number.isInteger(results?.attempts) ? results.attempts : 0,
  previousScore: Number.isInteger(results?.previousScore)
    ? results.previousScore
    : null,
  latestScore: Number.isInteger(results?.latestScore) ? results.latestScore : 0,
  bestScore: Number.isInteger(results?.bestScore) ? results.bestScore : 0,
});

// Read the browser fallback without crashing on invalid saved data.
const loadBrowserResults = () => {
  try {
    return JSON.parse(window.localStorage.getItem(quizResultsStorageKey) || 'null');
  } catch {
    return null;
  }
};

const createAttemptId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const Quiz = () => {
  // Quiz state: current question, selected answers, score, and save status.
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [savedResults, setSavedResults] = useState(initialSavedResults);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const attemptIdRef = useRef(null);

  // Load results when the quiz page opens.
  useEffect(() => {
    let mounted = true;
    async function loadResults() {
      try {
        let results;
        if (window.electronAPI?.loadQuizResults) {
          results = await window.electronAPI.loadQuizResults();
        } else {
          results = loadBrowserResults();
        }

        if (mounted && results) {
          setSavedResults(normaliseResults(results));
        }
      } catch (err) {
        console.error('Could not load quiz results:', err);
        if (mounted) {
          setSavedResults(normaliseResults(loadBrowserResults()));
          setSaveError(true);
          setSaveErrorMessage(String(err?.message || err));
        }
      } finally {
        if (mounted) {
          setResultsLoaded(true);
        }
      }
    }
    loadResults();
    return () => { mounted = false; };
  }, []);

  // Save only after the final score and previous results are ready.
  useEffect(() => {
    if (quizFinished && resultsLoaded) {
      saveQuizResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFinished, resultsLoaded]);

  async function saveQuizResults() {
    // Electron saves to a file; the browser version uses localStorage.
    setIsSaving(true);
    setSaveError(false);
    setSaveErrorMessage('');
    try {
      let resp;
      if (window.electronAPI?.saveQuizResults) {
        resp = await window.electronAPI.saveQuizResults(
          score,
          questions.length,
          attemptIdRef.current
        );
      } else {
        const previous = loadBrowserResults() || initialSavedResults;
        const isSameAttempt = previous.lastAttemptId === attemptIdRef.current;
        const results = isSameAttempt
          ? previous
          : {
              attempts: (Number.isInteger(previous.attempts) ? previous.attempts : 0) + 1,
              previousScore: Number.isInteger(previous.latestScore)
                ? previous.latestScore
                : null,
              latestScore: score,
              bestScore: Math.max(previous.bestScore || 0, score),
              lastAttemptId: attemptIdRef.current,
            };
        window.localStorage.setItem(quizResultsStorageKey, JSON.stringify(results));
        resp = { success: true, results };
      }
      if (resp && resp.success && resp.results) {
        setSavedResults(normaliseResults(resp.results));
        setSaveError(false);
        setSaveErrorMessage('');
      } else {
        setSaveError(true);
        setSaveErrorMessage(resp?.error || 'Unknown error saving quiz results.');
      }
    } catch (err) {
      setSaveError(true);
      setSaveErrorMessage(String(err?.message || err));
    }
    setIsSaving(false);
  }

  // Store one answer. Learners can change it before moving on.
  const handleAnswer = (idx) => {
    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers];
      nextAnswers[currentQuestion] = idx;
      return nextAnswers;
    });
  };

  // Move forward, or calculate the final marks on the last question.
  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((q) => q + 1);
    } else {
      const finalScore = answers.reduce(
        (total, answer, index) => total + (answer === questions[index].answer ? 1 : 0),
        0
      );
      attemptIdRef.current = createAttemptId();
      setScore(finalScore);
      setQuizFinished(true);
    }
  };

  // Reset only the current attempt; saved marks remain available.
  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setQuizFinished(false);
    attemptIdRef.current = null;
    setSaveError(false);
    setSaveErrorMessage('');
  };

  const handleRetrySave = () => {
    saveQuizResults();
  };

  // Small inline style helpers used only by this component.
  const containerStyle = {
    maxWidth: 480,
    margin: '32px auto',
    padding: '24px',
    background: '#f9f9fa',
    borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    fontFamily: 'system-ui, sans-serif',
    minHeight: 400,
  };
  const questionStyle = {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 18,
  };
  const optionStyle = (idx, selected) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    margin: '8px 0',
    borderRadius: 8,
    border: selected === idx ? '2px solid #1976d2' : '1px solid #ccc',
    background: selected === idx ? '#e3f2fd' : '#fff',
    cursor: 'pointer',
    color: '#222',
    fontWeight: selected === idx ? 600 : 400,
    transition: 'background 0.15s, border 0.15s, color 0.15s',
  });
  const buttonStyle = {
    marginTop: 24,
    padding: '10px 28px',
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    background: '#1976d2',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(25,118,210,0.07)',
  };
  const disabledButtonStyle = {
    ...buttonStyle,
    background: '#b0b9c8',
    cursor: 'not-allowed',
  };
  const statStyle = {
    margin: '10px 0 0 0',
    color: '#666',
    fontSize: 15,
  };
  const errorStyle = {
    margin: '12px 0',
    color: '#d32f2f',
    background: '#ffebee',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 14,
    wordBreak: 'break-word',
  };
  const selectedAnswer = answers[currentQuestion] ?? null;

  // Show questions until submission, then show marks and saved statistics.
  return (
    <div style={containerStyle}>
      {!quizFinished ? (
        <>
          <div style={{marginBottom:12, color:'#888', fontSize:15}}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div style={questionStyle}>{questions[currentQuestion].question}</div>
          <div>
            {questions[currentQuestion].options.map((opt, idx) => (
              <button
                key={idx}
                style={optionStyle(
                  idx,
                  selectedAnswer
                )}
                onClick={() => handleAnswer(idx)}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            style={
              selectedAnswer !== null ? buttonStyle : disabledButtonStyle
            }
            onClick={handleNext}
            disabled={selectedAnswer === null}
          >
            {currentQuestion + 1 === questions.length ? 'Submit Quiz' : 'Next'}
          </button>
        </>
      ) : (
        <>
          <div style={{fontSize:22, fontWeight:700, marginBottom:12}}>
            Quiz Results
          </div>
          <div style={{fontSize:18, marginBottom:10}}>
            You answered <strong>{score}</strong> out of <strong>{questions.length}</strong> questions correctly
          </div>
          <div style={statStyle}>
            <div>
              <span style={{fontWeight:600}}>Attempts:</span> {savedResults.attempts}
            </div>
            <div>
              <span style={{fontWeight:600}}>Best Score:</span> {savedResults.bestScore} / {questions.length}
            </div>
            <div>
              <span style={{fontWeight:600}}>Latest Score:</span> {savedResults.latestScore} / {questions.length}
            </div>
            <div>
              <span style={{fontWeight:600}}>Previous Score:</span>{' '}
              {savedResults.previousScore === null
                ? '—'
                : `${savedResults.previousScore} / ${questions.length}`}
            </div>
          </div>
          {saveError && (
            <div style={errorStyle}>
              <div>
                <strong>Save Error:</strong>
              </div>
              <div>{saveErrorMessage}</div>
              <button
                style={{...buttonStyle, background:'#d32f2f', marginTop:10}}
                onClick={handleRetrySave}
                disabled={isSaving}
              >
                {isSaving ? 'Retrying...' : 'Retry Save'}
              </button>
            </div>
          )}
          <button
            style={{...buttonStyle, marginTop:18, background:'#1976d2'}}
            onClick={handleTryAgain}
            disabled={isSaving}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default Quiz;
