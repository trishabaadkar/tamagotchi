import React, { useState, useEffect } from "react";

function Tamagotchi() {
  const [hunger, setHunger] = useState(50);
  const [cleanliness, setCleanliness] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [showDroplets, setShowDroplets] = useState(false);
  const [feedingFood, setFeedingFood] = useState(null);
  const [showFoodOptions, setShowFoodOptions] = useState(false);
  const [showPlayOptions, setShowPlayOptions] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('tamagotchiState');
    if (savedState) {
      const { hunger, cleanliness, happiness } = JSON.parse(savedState);
      setHunger(hunger);
      setCleanliness(cleanliness);
      setHappiness(happiness);
    }

    const interval = setInterval(() => {
      setHunger(h => Math.max(0, h - 1));
      setCleanliness(c => Math.max(0, c - 1));
      setHappiness(h => Math.max(0, h - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('tamagotchiState', JSON.stringify({ hunger, cleanliness, happiness }));
  }, [hunger, cleanliness, happiness]);

  const feed = (food) => {
    setFeedingFood(food);
    setShowFoodOptions(false);
    setTimeout(() => {
      let increase;
      switch (food) {
        case 'apple':
          increase = 15;
          break;
        case 'banana':
          increase = 20;
          break;
        case 'orange':
          increase = 18;
          break;
        default:
          increase = 0;
      }
      setHunger(h => Math.min(100, h + increase));
      setFeedingFood(null);
    }, 1000);
  };

  const bathe = () => {
    setCleanliness(c => Math.min(100, c + 20));
    setShowDroplets(true);
    setTimeout(() => setShowDroplets(false), 2000);
  };

  const play = (toy) => {
    setShowPlayOptions(false);
    let increase;
    switch (toy) {
      case 'ball':
        increase = 15;
        break;
      case 'rattle':
        increase = 18;
        break;
      case 'squeaky':
        increase = 20;
        break;
      default:
        increase = 0;
    }
    setHappiness(h => Math.min(100, h + increase));
  };

  const getEmoji = () => {
    const average = (hunger + cleanliness + happiness) / 3;
    if (average > 80) return "😄";
    if (average > 60) return "🙂";
    if (average > 40) return "😐";
    if (average > 20) return "😟";
    return "😢";
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>My Tamagotchi</h1>
      <div style={{ fontSize: '100px', marginBottom: '20px', position: 'relative' }}>
        {getEmoji()}
        {showDroplets && <WaterDroplets />}
        {feedingFood && <FoodAnimation food={feedingFood} />}
      </div>
      <div>
        <p>Hunger: {hunger}%</p>
        <p>Cleanliness: {cleanliness}%</p>
        <p>Happiness: {happiness}%</p>
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setShowFoodOptions(!showFoodOptions)}>Feed</button>
        {showFoodOptions && <FoodOptions onSelect={feed} />}
        <button onClick={bathe}>Bathe</button>
        <button onClick={() => setShowPlayOptions(!showPlayOptions)}>Play</button>
        {showPlayOptions && <PlayOptions onSelect={play} />}
      </div>
    </div>
  );
}

function FoodOptions({ onSelect }) {
  return (
    <div className="options-popup">
      <button className="option-btn" onClick={() => onSelect('apple')}>🍎</button>
      <button className="option-btn" onClick={() => onSelect('banana')}>🍌</button>
      <button className="option-btn" onClick={() => onSelect('orange')}>🍊</button>
    </div>
  );
}

function PlayOptions({ onSelect }) {
  return (
    <div className="options-popup">
      <button className="option-btn" onClick={() => onSelect('ball')}>⚽</button>
      <button className="option-btn" onClick={() => onSelect('rattle')}>🎺</button>
      <button className="option-btn" onClick={() => onSelect('squeaky')}>🧸</button>
    </div>
  );
}

function WaterDroplets() {
  return (
    <div className="water-droplets">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="droplet" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`
        }}>💧</div>
      ))}
    </div>
  );
}

function FoodAnimation({ food }) {
  const foodEmoji = {
    apple: '🍎',
    banana: '🍌',
    orange: '🍊'
  }[food];

  return (
    <div className="food-animation">
      {foodEmoji}
    </div>
  );
}

export default Tamagotchi;
