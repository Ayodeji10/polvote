import React, { useState, useContext } from "react";
import { DataContext } from "../dataContext";
import Modal from "react-modal";
Modal.setAppElement("#root");

function CreateQuizCard({
  item,
  module,
  modules,
  setModules,
  moduleIndex,
  deleteAsset,
  quizIndex,
  setAddBar,
}) {
  // context
  const { context } = useContext(DataContext);

  const [view, setView] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // create question
  const [createQuizQuestioonModal, setCreateQuizQuestionModal] =
    useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", image: null },
    { text: "", image: null },
  ]);
  const [repeatScore, setRepeatScore] = useState("yes");
  const [generalScore, setGeneralScore] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [singleScore, setSingleScore] = useState(null);
  const [editBtn, setEditBtn] = useState(false);
  const [editIndex, setEditInedex] = useState("");

  // set title
  const changeTitle = () => {
    if (title.length < 1) {
      setError("Please Input Quiz Title");
    } else if (
      repeatScore === "yes" &&
      (generalScore === null || generalScore < 0)
    ) {
      setError("Please Enter a valid Score for Each Question");
    } else {
      setModules(
        modules.map((mod, i) => {
          if (moduleIndex === i) {
            return {
              ...mod,
              assets: mod.assets.map((asset, index) => {
                if (quizIndex === index) {
                  return { ...asset, title: title, generalScore: generalScore };
                }
                return asset;
              }),
            };
          }
          return mod;
        })
      );
      setView(true);
    }
  };

  // add option
  const addOption = () => {
    if (options.length === 4) {
      setError("You can't have more than 4 options");
    } else {
      const newOption = { text: "", image: null };
      setOptions([...options, newOption]);
    }
  };

  // delete option
  const deleteOption = (index) => {
    if (options.length <= 2) {
      setError("You cant have less than two Options");
    } else {
      setOptions((prev) => prev.filter((option) => option !== prev[index]));
    }
  };

  // handle options input
  const handleOptionInput = (e, i, type) => {
    e.preventDefault();
    setOptions(
      options.map((each, index) => {
        if (i !== index) {
          return each;
        }
        if (type === "text") {
          return { ...each, text: e.target.value };
        } else {
          return { ...each, image: e.target.files[0] };
        }
      })
    );
  };

  // add question
  const addQuestion = () => {
    if (answer === null) {
      setError("Please Select which option is the answer to the question");
    } else {
      setModules(
        modules.map((mod, i) => {
          if (moduleIndex === i) {
            return {
              ...mod,
              assets: mod.assets.map((asset, index) => {
                if (quizIndex === index) {
                  return {
                    ...asset,
                    questions: [
                      ...asset.questions,
                      {
                        question: question,
                        options: options,
                        answer: answer,
                        ...(repeatScore === "no" && { score: singleScore }),
                      },
                    ],
                  };
                }
                return asset;
              }),
            };
          }
          return mod;
        })
      );

      setQuestion("");
      setOptions([
        { text: "", image: null },
        { text: "", image: null },
      ]);
      setAnswer(null);
      setError("");
      setCreateQuizQuestionModal(false);
      console.log(module);
    }
  };

  // update question
  const updateQuestion = () => {
    setModules(
      modules.map((mod, i) => {
        if (moduleIndex === i) {
          return {
            ...mod,
            assets: mod.assets.map((asset, index) => {
              if (quizIndex === index) {
                let prevQuestions = asset.questions.slice(0, editIndex);
                let nextQuestions = asset.questions.slice(
                  editIndex + 1,
                  asset.questions.length
                );
                let updatedQuestion = {
                  question: question,
                  options: options,
                  answer: answer,
                  ...(repeatScore === "no" && { score: singleScore }),
                };
                return {
                  ...asset,
                  // questions: asset.questions.splice(editIndex, 1, {
                  //   question: question,
                  //   options: options,
                  //   answer: answer,
                  //   ...(repeatScore === "no" && { score: singleScore }),
                  // }),
                  questions: [
                    ...prevQuestions,
                    updatedQuestion,
                    ...nextQuestions,
                  ],
                };
              }
              return asset;
            }),
          };
        }
        return mod;
      })
    );
    setEditBtn(false);
    setEditBtn("");
    setQuestion("");
    setOptions([
      { text: "", image: null },
      { text: "", image: null },
    ]);
    setAnswer(null);
    setError("");
    setSingleScore();
    setCreateQuizQuestionModal(false);
    console.log(module);
  };

  // delete question
  const deleteQuestion = (i) => {
    setModules(
      modules.map((mod, i) => {
        if (moduleIndex === i) {
          return {
            ...mod,
            assets: mod.assets.map((asset, index) => {
              if (quizIndex === index) {
                return {
                  ...asset,
                  questions: asset.questions.filter(
                    (option) => option !== asset.questions[i]
                  ),
                };
              }
              return asset;
            }),
          };
        }
        return mod;
      })
    );
  };

  return (
    <div className="row mt-4">
      <div className="col-9">
        <div className="createQuizCard">
          {view === false ? (
            <div className="initial">
              <label htmlFor="title">Quiz Title</label>
              <input
                type="text"
                placeholder="Type Title Here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="">
                Do you want to use the same score for all questions set in this
                quiz?
              </label>
              <select
                value={repeatScore}
                onChange={(e) => setRepeatScore(e.target.value)}
              >
                <option value="yes" selected={repeatScore === "yes"}>
                  Yes
                </option>
                <option value="no" selected={repeatScore === "no"}>
                  No
                </option>
              </select>
              {repeatScore === "yes" && (
                <>
                  <label htmlFor="Score">Score</label>
                  <input
                    type="number"
                    placeholder="Enter score "
                    value={generalScore}
                    onChange={(e) => setGeneralScore(e.target.value)}
                  />
                </>
              )}
              <h6 className="error mb-3">{error}</h6>
              <div className="d-flex justify-content-end">
                <button id="preview" onClick={() => deleteAsset(quizIndex)}>
                  Cancel
                </button>
                <button id="save" onClick={changeTitle}>
                  Add Module
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="initial d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  Quiz {quizIndex + 1}:
                  <i className="fa-regular fa-circle-question" />
                  {item.title}
                </h3>
                {item.questions.length === 0 ? (
                  <h4
                    className="mb-0"
                    onClick={() => setCreateQuizQuestionModal(true)}
                  >
                    <i className="fa-solid fa-circle-plus" />
                    Add Question
                  </h4>
                ) : (
                  <i className="fa-solid fa-angle-up" />
                )}
              </div>
              {item.questions.length !== 0 && (
                <div className="bottom">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">Questions</h5>
                    <h4
                      className="mb-0"
                      onClick={() => setCreateQuizQuestionModal(true)}
                    >
                      <i className="fa-solid fa-circle-plus" />
                      Add Question
                    </h4>
                  </div>
                  {item.questions.map((q, i) => {
                    return (
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3 className="mb-0">{q.question}</h3>
                        <div>
                          <i
                            className="fa-solid fa-pen"
                            onClick={() => {
                              setEditBtn(true);
                              setQuestion(q.question);
                              setOptions(q.options);
                              setAnswer(q.answer);
                              setSingleScore(q.score);
                              setEditInedex(i);
                              setCreateQuizQuestionModal(true);
                            }}
                          />
                          <i
                            className="fa-solid fa-trash-can"
                            onClick={() => deleteQuestion(i)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="col-1 d-flex justify-content-center">
        <i className="fa-solid fa-pen" onClick={() => setView(false)} />
      </div>
      <div className="col-1 d-flex justify-content-center">
        <i
          className="fa-solid fa-trash-can"
          onClick={(e) => deleteAsset(quizIndex)}
        />
      </div>
      <div className="col-1 d-flex">
        <i className="fa-solid fa-plus" onClick={() => setAddBar(true)} />
      </div>

      {/* edit and create questions  */}
      <Modal
        isOpen={createQuizQuestioonModal}
        onRequestClose={() => {
          setEditBtn(false);
          setCreateQuizQuestionModal(false);
        }}
        id="create-quiz-modal"
        className={`${context.darkMode ? "dm" : ""}`}
      >
        <i
          className="far fa-times-circle"
          onClick={() => {
            setEditBtn(false);
            setCreateQuizQuestionModal(false);
          }}
        />
        <h2>Question</h2>
        <label htmlFor="question">Question</label>
        <input
          type="text"
          placeholder="Ask a question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <h3>Answers</h3>
        <p>Click on any of your options to select the correct answer</p>
        {options.map((q, i) => {
          return (
            <>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="radio"
                    className="checkbox"
                    id={`option-${i}`}
                    checked={answer === i}
                    onClick={() => setAnswer(i)}
                  />
                  <label htmlFor={`option-${i}`} className="option">
                    Option {i + 1}
                  </label>
                </div>
                <i
                  className="fa-regular fa-trash-can"
                  onClick={() => deleteOption(i)}
                />
              </div>
              <input
                type="text"
                placeholder={`Option ${i + 1}`}
                value={q.text}
                onChange={(e) => handleOptionInput(e, i, "text")}
              />
              <label htmlFor={`option-img-${i}`}>
                Option {i + 1} Image (optional)
              </label>
              <input
                type="file"
                id={`option-img-${i}`}
                accept="image/*"
                onChange={(e) => handleOptionInput(e, i, "image")}
              />
            </>
          );
        })}
        <h6 onClick={addOption}>
          <i className="fa-solid fa-circle-plus" />
          Add Option
        </h6>
        {repeatScore === "no" && (
          <>
            <label htmlFor="score">Score</label>
            <input
              type="number"
              id="score"
              placeholder="Enter score of this question"
              value={singleScore}
              onChange={(e) => setSingleScore(e.target.value)}
            />
          </>
        )}
        <h6 className="error">{error}</h6>
        {editBtn ? (
          <button onClick={updateQuestion}>Update Question</button>
        ) : (
          <button onClick={addQuestion}>Add Question</button>
        )}
      </Modal>
    </div>
  );
}

export default CreateQuizCard;
