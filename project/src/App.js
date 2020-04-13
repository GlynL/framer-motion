import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef } from "react";

const App = () => {
  const [cards, setCards] = useState([0, 1, 2, 3]);
  function moveCard(endPoint, index) {
    let reorderedCards = [...cards];
    let newPosition = index;
    if (endPoint.x < -100) {
      newPosition = index - 1;
    }
    if (endPoint.x > 100) {
      newPosition = index + 1;
    }
    if (endPoint.y < -100) {
      newPosition = index - 4;
    }
    if (endPoint.y > 100) {
      newPosition = index + 4;
    }
    reorderedCards[newPosition] = cards[index];
    reorderedCards[index] = cards[newPosition];
    setCards(reorderedCards);
  }
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div>
        <h1>Sweet Animations</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "1200px",
        }}
      >
        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}

        <AnimatePresence>
          {cards.map((card, i) => (
            <Item
              key={card}
              i={i}
              card={card}
              removeCard={(c) => setCards(cards.filter((card) => card !== c))}
              moveCard={moveCard}
            />
          ))}
        </AnimatePresence>
      </div>
      {/* TODO: card naming */}
      <Button onClick={() => setCards([...cards, cards[cards.length - 1] + 1])}>
        Add Card
      </Button>
    </div>
  );
};
export default App;

const Item = ({ card, removeCard, moveCard, i }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const cardRef = useRef(null);
  return (
    <motion.div
      style={{
        width: "300px",
        position: isRemoving ? "absolute" : "block",
        left: isRemoving ? position.left : "auto",
        top: isRemoving ? position.top : "auto",
      }}
      initial={{ x: "-300px", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ y: "-300px", opacity: 0 }}
      positionTransition
      ref={cardRef}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      onDragEnd={(e, drag) => {
        moveCard(drag.point, i);
      }}
    >
      <Card>
        <Card.Body>
          <Card.Title>{card}</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Button
            onClick={() => {
              const position = cardRef.current.getBoundingClientRect();
              setPosition(position);
              setIsRemoving(true);
              removeCard(card);
            }}
          >
            Remove
          </Button>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// /* <div
//   style={{
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   }}
// >
//   <motion.div
//     initial={{
//       x: "50px",
//     }}
//     animate={{
//       x: "100px",
//     }}
//     // whileHover={{
//     //   scale: 1.5,
//     // }}
//     // whileTap={{
//     //   rotate: "360deg",
//     // }}
//     // transition={{ duration: 2 }}
//     // drag
//   >
//     <Card style={{ width: "18rem" }}>
//       {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
//       <Card.Body>
//         <Card.Title>Card Title</Card.Title>
//         <Card.Text>
//           Some quick example text to build on the card title and make up
//           the bulk of the card's content.
//         </Card.Text>
//         <Button onClick={() => {}}>Click</Button>
//       </Card.Body>
//     </Card>
//   </motion.div>
// </div> */
