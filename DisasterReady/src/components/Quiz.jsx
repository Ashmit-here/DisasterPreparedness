import { useEffect, useState } from 'react';

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

const emptyResults = {
  attempts: 0,
  latestScore: 0,
  bestScore: 0,
};

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [savedResults, setSavedResults] = useState(emptyResults);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadResults() {
      try {
        if (!window.electronAPI) {
          return;
        }

        const results = await window.electronAPI.loadQuizResults();

        if (isMounted && results) {
          setSavedResults({
            attempts: results.attempts ?? 0,
            latestScore: results.latestScore ?? 0,
            bestScore: results.bestScore ?? 0,
          });
        }
      } catch (error) {
        console.error('Could not load quiz results:', error);
      } finally {
        if (isMounted) {
          setResultsLoaded(true);
        }
      }
    }

    loadResults();

    return () => {
      isMounted = false;
    };
  }, []);

  const question = questions[currentQuestion];

  const progress = Math.round(
    ((currentQuestion + (selectedAnswer !== null ? 1 : 0)) /
      questions.length) *
      100
  );

  const chooseAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === question.answer) {
      setScore((previousScore) => previousScore + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previousQuestion) => previousQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  // Save results once when the quiz finishes.
  useEffect(() => {
    if (!quizFinished || !resultsLoaded) return;

    let isCancelled = false;

    async function saveResults() {
      try {
        if (!window.electronAPI) return;

        const result = await window.electronAPI.saveQuizResults(
          score,
          questions.length
        );

        if (isCancelled) return;

        if (result?.results) {
          setSavedResults({
            attempts: result.results.attempts,
            latestScore: result.results.latestScore,
            bestScore: result.results.bestScore,
          });
        }

        setSaveError(false);
      } catch (error) {
        console.error('Could not save quiz results:', error);

        if (!isCancelled) {
          setSaveError(true);
        }
      }
    }

    saveResults();

    return () => {
      isCancelled = true;
    };
  }, [quizFinished, resultsLoaded, score]);

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
    setSaveError(false);
  };

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);

    let message =
      'Good effort! Review the guides and try again to improve your score.';

    if (percentage >= 80) {
      message =
        'Excellent work! You have a strong understanding of disaster safety.';
    } else if (percentage >= 50) {
      message =
        'Nice work! Review a few safety topics and you will be even better prepared.';
    }

    return (
      <div>
        <p>QUIZ COMPLETE</p>
        <h1>Your Results 🏆</h1>

        <div
          style={{
            maxWidth: '520px',
            padding: '28px',
            marginTop: '24px',
            background: 'white',
            border: '1px solid #d8e1d8',
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <h2>{percentage}%</h2>

          <p>
            You answered {score} out of {questions.length} questions correctly.
          </p>

          <p>{message}</p>

          <hr style={{ border: 'none', borderTop: '1px solid #d8e1d8' }} />

          <h3>Your Quiz Statistics</h3>

          <p>
            <strong>Latest score:</strong> {savedResults.latestScore}/
            {questions.length}
          </p>

          <p>
            <strong>Best score:</strong> {savedResults.bestScore}/
            {questions.length}
          </p>

          <p>
            <strong>Completed attempts:</strong> {savedResults.attempts}
          </p>

          {saveError && (
            <p style={{ color: '#b42318' }}>
              Your result could not be saved. Please try again later.
            </p>
          )}

          <button
            onClick={restartQuiz}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              background: '#17352b',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '760px' }}>
      <p>TEST YOUR KNOWLEDGE</p>
      <h1>Disaster Safety Quiz 🧠</h1>

      <p>
        Answer each question to check how prepared you are for an emergency.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '28px',
        }}
      >
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>

        <strong>{progress}%</strong>
      </div>

      <div
        style={{
          height: '8px',
          background: '#e5ebe5',
          borderRadius: '8px',
          overflow: 'hidden',
          margin: '12px 0 24px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#3c8b65',
            transition: 'width 0.2s ease',
          }}
        />
      </div>

      <div
        style={{
          padding: '28px',
          background: 'white',
          border: '1px solid #d8e1d8',
          borderRadius: '16px',
        }}
      >
        <h2>{question.question}</h2>

        <div style={{ display: 'grid', gap: '12px', marginTop: '24px' }}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = question.answer === index;

            let background = 'white';
            let border = '1px solid #d8e1d8';

            if (selectedAnswer !== null && isCorrect) {
              background = '#e8f4ec';
              border = '1px solid #3c8b65';
            } else if (isSelected && !isCorrect) {
              background = '#fdebea';
              border = '1px solid #d9534f';
            }

            return (
              <button
                key={option}
                onClick={() => chooseAnswer(index)}
                disabled={selectedAnswer !== null}
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  border,
                  borderRadius: '10px',
                  background,
                  cursor: selectedAnswer !== null ? 'default' : 'pointer',
                  color: '#17352b',
                  fontSize: '15px',
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f5f7f2',
              borderRadius: '10px',
            }}
          >
            <strong>
              {selectedAnswer === question.answer
                ? 'Correct answer! 🎉'
                : 'Not quite! Keep learning. 💡'}
            </strong>

            <p>{question.explanation}</p>

            <button
              onClick={nextQuestion}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '8px',
                background: '#17352b',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {currentQuestion === questions.length - 1
                ? 'See Results'
                : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;