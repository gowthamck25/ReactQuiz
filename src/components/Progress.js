function Progress({
  index,
  numQuestions,
  points,
  maxPossiblePoints,
  answer,
  questions,
}) {
  const progress = questions.filter(
    (question) => question.clickedAnswer !== null
  ).length;

  return (
    <header className="progress">
      {/* <progress max={numQuestions} value={index + Number(answer !== null)} /> */}
      <progress max={numQuestions} value={progress} />

      <p>
        Attempted <strong>{progress}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points} </strong> / {maxPossiblePoints}
        points
      </p>
    </header>
  );
}

export default Progress;
