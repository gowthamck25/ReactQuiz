function NextButton({
  dispatch,
  answer,
  index,
  numQuestions,
  question,
  filter,
}) {
  // if (answer === null && question.clickedAnswer) return;
  if (index === 0)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (index < numQuestions - 1)
    return (
      <div style={{ display: "flex", gap: "1rem", justifyContent: "end" }}>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "prevQuestion" })}
        >
          Prev
        </button>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "nextQuestion" })}
        >
          Next
        </button>
      </div>
    );

  if (index === numQuestions - 1 && !filter)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
