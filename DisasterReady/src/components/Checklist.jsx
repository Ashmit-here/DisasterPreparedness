import { useState, useEffect } from 'react';

const checklistItems = [
  {
    category: 'Essential Supplies',
    items: [
      { id: 1, name: 'Drinking water', detail: 'Store enough water for emergencies.' },
      { id: 2, name: 'Non-perishable food', detail: 'Keep ready-to-eat food available.' },
      { id: 3, name: 'First-aid kit', detail: 'Include bandages and basic first-aid supplies.' },
      { id: 4, name: 'Flashlight', detail: 'Keep spare batteries if required.' },
    ],
  },
  {
    category: 'Health and Safety',
    items: [
      { id: 5, name: 'Essential medicines', detail: 'Keep necessary medicines accessible.' },
      { id: 6, name: 'Face masks and hygiene supplies', detail: 'Pack basic personal hygiene items.' },
      { id: 7, name: 'Whistle', detail: 'Use it to signal for help if necessary.' },
    ],
  },
  {
    category: 'Communication and Documents',
    items: [
      { id: 8, name: 'Charged power bank', detail: 'Keep your phone powered during an outage.' },
      { id: 9, name: 'Emergency contact list', detail: 'Write down important phone numbers.' },
      { id: 10, name: 'Important documents', detail: 'Protect copies in a waterproof pouch.' },
      { id: 11, name: 'Some emergency cash', detail: 'Keep a small amount of cash accessible.' },
    ],
  },
];

function Checklist() {
  const [checkedItems, setCheckedItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved checklist items when the component opens.
  useEffect(() => {
    let isMounted = true;

    async function loadSavedChecklist() {
      try {
        if (!window.electronAPI) {
          setIsLoaded(true);
          return;
        }

        const savedItems = await window.electronAPI.loadChecklist();

        if (isMounted) {
          setCheckedItems(Array.isArray(savedItems) ? savedItems : []);
        }
      } catch (error) {
        console.error('Could not load checklist:', error);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    loadSavedChecklist();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes after the initial load finishes.
  useEffect(() => {
    if (!isLoaded || !window.electronAPI) {
      return;
    }

    window.electronAPI.saveChecklist(checkedItems).catch((error) => {
      console.error('Could not save checklist:', error);
    });
  }, [checkedItems, isLoaded]);

  const totalItems = checklistItems.reduce(
    (total, category) => total + category.items.length,
    0
  );

  const completedCount = checkedItems.length;
  const progress = Math.round((completedCount / totalItems) * 100);

  const toggleItem = (id) => {
    setCheckedItems((previousItems) =>
      previousItems.includes(id)
        ? previousItems.filter((itemId) => itemId !== id)
        : [...previousItems, id]
    );
  };

  const resetChecklist = () => {
    setCheckedItems([]);
  };

  return (
    <div>
      <p>BE READY BEFORE AN EMERGENCY</p>

      <h1>Emergency Kit Checklist</h1>

      <p>
        Check off the supplies you already have. A prepared kit can help you
        respond more safely during an emergency.
      </p>

      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          margin: '24px 0',
          border: '1px solid #d8e1d8',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <h3>Your preparation progress</h3>
          <strong>{progress}%</strong>
        </div>

        <div
          style={{
            height: '10px',
            background: '#e5ebe5',
            borderRadius: '10px',
            overflow: 'hidden',
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

        <p>
          {completedCount} of {totalItems} supplies checked
        </p>
      </div>

      {checklistItems.map((category) => (
        <section key={category.category} style={{ marginBottom: '28px' }}>
          <h2>{category.category}</h2>

          <div style={{ display: 'grid', gap: '12px' }}>
            {category.items.map((item) => {
              const isChecked = checkedItems.includes(item.id);

              return (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #d8e1d8',
                    background: isChecked ? '#e8f4ec' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.id)}
                    style={{ marginTop: '5px' }}
                  />

                  <span>
                    <strong
                      style={{
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {item.name}
                    </strong>

                    <br />

                    <span style={{ color: '#607267', fontSize: '14px' }}>
                      {item.detail}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      ))}

      <button
        onClick={resetChecklist}
        style={{
          padding: '12px 18px',
          border: 'none',
          borderRadius: '8px',
          background: '#17352b',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Reset checklist
      </button>

      {completedCount === totalItems && (
        <p style={{ color: '#267447', fontWeight: 'bold' }}>
          Great work! You've checked every item. Keep your kit accessible and
          review its contents regularly.
        </p>
      )}
    </div>
  );
}

export default Checklist;