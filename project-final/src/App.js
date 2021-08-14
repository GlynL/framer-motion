import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useIsPresent } from "framer-motion";
import { v4 as uuid } from "uuid";

const App = () => {
  const [cards, setCards] = useState(defaultCards);

  async function addCard() {
    const res = await fetch(`https://source.unsplash.com/random/300x400`);
    if (!res.ok) return;
    const id = uuid();
    const card = { id, img: res.url };
    setCards([...cards, card]);
  }

  function removeCard(id) {
    setCards(cards.filter((card) => card.id !== id));
  }

  function moveCard(offset, index) {
    let reorderedCards = [...cards];
    let movedFrom = index;
    let movedTo = index;

    if (offset.x <= -100) {
      movedTo = index - 1;
    }
    if (offset.x >= 100) {
      movedTo = index + 1;
    }
    if (offset.y >= 100) {
      movedTo = index + 4;
    }
    if (offset.y <= -100) {
      movedTo = index - 4;
    }

    if (movedFrom !== movedTo && cards[movedFrom] && cards[movedTo]) {
      reorderedCards[movedFrom] = cards[movedTo];
      reorderedCards[movedTo] = cards[movedFrom];
      setCards(reorderedCards);
    }
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
          {cards.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              removeCard={removeCard}
              moveCard={moveCard}
              i={i}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

const variants = {
  initial: {
    strokeWidth: 2,
    pathLength: 0,
  },
  animate: {
    pathLength: 1,
    transition: { duration: 1, when: "afterChildren", staggerChildren: 1 },
  },
  hover: {
    strokeWidth: 4,
  },
};

const Card = ({ card, removeCard, moveCard, i }) => {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const cardRef = useRef(null);

  function handleRemove() {
    const position = cardRef.current.getBoundingClientRect();
    setPosition(position);
    removeCard(card.id);
  }

  const isPresent = useIsPresent();

  return (
    <motion.div
      layout
      initial={{ x: "-300px", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ y: "-300px", opacity: 0 }}
      className="card"
      style={{
        width: "18rem",
        position: !isPresent ? "absolute" : "block",
        left: !isPresent ? position.left : "auto",
        top: !isPresent ? position.top : "auto",
        padding: "20px",
      }}
      ref={cardRef}
      drag
      onDragEnd={(e, drag) => moveCard(drag.offset, i)}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={1}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#333"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        variants={variants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onClick={handleRemove}
      >
        <motion.path d="M 18 6 L 6 18" variants={variants} />
        <motion.path d="M 6 6 L 18 18" variants={variants} />
      </motion.svg>

      <img src={card.img} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">Cool Image</h5>
      </div>
    </motion.div>
  );
};

const defaultCards = [
  {
    id: uuid(),
    img: "https://images.unsplash.com/photo-1587900437942-8758241767ef?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixlib=rb-1.2.1&q=80&w=300",
  },
  {
    id: uuid(),
    img: "https://images.unsplash.com/photo-1586336900429-71f0642f66fd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixlib=rb-1.2.1&q=80&w=300",
  },
  {
    id: uuid(),
    img: "https://images.unsplash.com/photo-1587900437942-8758241767ef?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixlib=rb-1.2.1&q=80&w=300",
  },
];
