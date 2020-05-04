import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [cards, setCards] = useState(defaultCards);

  async function addCard() {
    const res = await fetch(`https://source.unsplash.com/random/300x400`);
    if (!res.ok) return;
    const id = cards.length === 0 ? 0 : cards[cards.length - 1].id + 1;
    const card = { id, img: res.url };
    setCards([...cards, card]);
  }

  function removeCard(id) {
    setCards(cards.filter((card) => card.id !== id));
  }

  return (
    <div className="app">
      <div>
        <h1>Sweet Animations!</h1>
      </div>
      <button className="btn btn-primary" onClick={addCard}>
        Add Card
      </button>
      <div className="list">
        <AnimatePresence>
          {cards.map((card) => (
            <Card key={card.id} card={card} removeCard={removeCard} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

const Card = ({ card, removeCard }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const cardRef = useRef(null);

  function handleRemove() {
    const position = cardRef.current.getBoundingClientRect();
    setPosition(position);
    setIsRemoving(true);
    removeCard(card.id);
  }

  return (
    <motion.div
      initial={{ x: "-300px", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ y: "-300px", opacity: 0 }}
      positionTransition
      className="card"
      style={{
        width: "18rem",
        position: isRemoving ? "absolute" : "block",
        left: isRemoving ? position.left : "auto",
        top: isRemoving ? position.top : "auto",
      }}
      ref={cardRef}
    >
      <img src={card.img} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">Cool Image</h5>
        <button onClick={handleRemove} className="btn btn-danger">
          Remove
        </button>
      </div>
    </motion.div>
  );
};

const defaultCards = [
  {
    id: 0,
    img:
      "https://images.unsplash.com/photo-1587900437942-8758241767ef?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixlib=rb-1.2.1&q=80&w=300",
  },
  {
    id: 1,
    img:
      "https://images.unsplash.com/photo-1586336900429-71f0642f66fd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixlib=rb-1.2.1&q=80&w=300",
  },
];
