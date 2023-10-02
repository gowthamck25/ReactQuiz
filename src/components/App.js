import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import Choose from "./Choose";

const initalState = {
  questions: [],

  // "loading", "error", "ready", "active", "finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: localStorage.getItem("highscore"),
  secondsRemaining: null,
  clickedAnswer: null,
  filter: false,
  easyQues: [],
  medQues: [],
  hardQues: [],
  filteredQuestions: [],
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      state.easyQues = state.questions.filter(
        (question) => question.level === "easy"
      );
      state.medQues = state.questions.filter(
        (question) => question.level === "medium"
      );
      state.hardQues = state.questions.filter(
        (question) => question.level === "hard"
      );

      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "filterLevel":
      return {
        ...state,
        filter: !state.filter,
        filteredQuestions: [],
        questions: [...state.easyQues, ...state.medQues, ...state.hardQues],
        index: 0,
      };
    case "filterBy":
      if (action.payload === "easy") state.filteredQuestions = state.easyQues;
      else if (action.payload === "medium")
        state.filteredQuestions = state.medQues;
      else if (action.payload === "hard")
        state.filteredQuestions = state.hardQues;
      else return { ...state, filteredQuestions: [] };

      return { ...state, index: 0 };
    case "newAnswer":
      let question;
      if (state.filteredQuestions.length > 0)
        question = state.filteredQuestions.at(state.index);
      else question = state.questions.at(state.index);

      question.clickedAnswer = action.payload;

      return {
        ...state,
        answer: action.payload,
        clickedAnswer: state.answer,
        points:
          action.payload === question.correctOption && question
            ? state.points + question.points
            : state.points,
      };
    case "prevQuestion":
      return { ...state, index: state.index - 1, answer: null };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "selectQuestion":
      return { ...state, index: action.payload, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore: Math.max(state.highscore, state.points),
      };
    case "restart":
      state.questions = state.questions.map((question) => {
        return { ...question, clickedAnswer: null };
      });

      localStorage.setItem("highscore", state.highscore);

      return {
        ...initalState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
        filter: false,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action is unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      filter,
      filteredQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initalState);

  const gameQuestions =
    filteredQuestions.length > 0 ? filteredQuestions : questions;

  const numQuestions = gameQuestions.length;
  const maxPossiblePoints = gameQuestions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch(" http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => {
        const questions = data.map((question) => {
          let level = "";
          if (question.points === 10) level = "easy";
          if (question.points === 20) level = "medium";
          if (question.points === 30) level = "hard";

          return { ...question, level, clickedAnswer: null };
        });
        dispatch({ type: "dataReceived", payload: questions });
      })
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
              questions={gameQuestions}
            />
            <Choose
              questions={gameQuestions}
              dispatch={dispatch}
              currentIndex={index}
              filter={filter}
            />
            <Question
              question={gameQuestions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
                question={gameQuestions[index]}
                filter={filter}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
