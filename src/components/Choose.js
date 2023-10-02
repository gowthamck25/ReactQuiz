const flexBox = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "3rem",
};

const chooseBox = {
  padding: "4px 4px",
};

function Choose({ questions, dispatch, currentIndex, filter }) {
  return (
    <div style={flexBox}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <p style={{ fontSize: "1.8rem " }}>Question: </p>
        <select
          style={chooseBox}
          value={currentIndex}
          onChange={(e) =>
            dispatch({
              type: "selectQuestion",
              payload: +e.target.value,
            })
          }
        >
          {questions.map((question, index) => (
            <option value={index} key={question.question}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>

      {!filter ? (
        <button
          style={{ padding: "4px 4px" }}
          onClick={() => dispatch({ type: "filterLevel" })}
        >
          Filter
        </button>
      ) : (
        <div style={{ display: "flex", gap: "1rem" }}>
          <select
            style={chooseBox}
            onChange={(e) =>
              dispatch({ type: "filterBy", payload: e.target.value })
            }
          >
            <option>Click to Filter</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            style={{ padding: "4px 4px" }}
            onClick={() => dispatch({ type: "filterLevel" })}
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}

export default Choose;
