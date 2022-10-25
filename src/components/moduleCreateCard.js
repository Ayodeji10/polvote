import React, { useState } from "react";
import { useEffect } from "react";
import CreateQuizCard from "./createQuizCard";

function ModuleCreateard({ module, modules, setModules, index, setError }) {
  const [view, setView] = useState(false);
  const [addBar, setAddBar] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  // add video
  const [video, setVideo] = useState(null);
  useEffect(() => {
    if (video !== null) {
      setModules(
        modules.map((mod, i) => {
          if (index === i) {
            return {
              ...mod,
              assets: [...mod.assets, { type: "video", item: video }],
            };
          }
          return mod;
        })
      );
      setVideo(null);
      setAddBar(false);
    }
  }, [video]);

  // add pdf
  const [pdf, setPdf] = useState(null);
  useEffect(() => {
    if (pdf !== null) {
      setModules(
        modules.map((mod, i) => {
          if (index === i) {
            return {
              ...mod,
              assets: [...mod.assets, { type: "pdf", item: pdf }],
            };
          }
          return mod;
        })
      );
      setPdf(null);
      setAddBar(false);
    }
  }, [pdf]);

  // add quiz
  const addQuiz = () => {
    setModules(
      modules.map((mod, i) => {
        if (index === i) {
          return {
            ...mod,
            assets: [...mod.assets, { type: "quiz", title: "", questions: [] }],
          };
        }
        return mod;
      })
    );
    setAddBar(false);
  };

  // edit module title
  const changeTitle = () => {
    setError("");
    if (title.length < 1) {
      setTitleError("Please Input a Module Title");
    } else {
      setModules(
        modules.map((mod, i) => {
          if (index === i) {
            return { ...mod, title: title };
          }
          return mod;
        })
      );
      setView(true);
    }
  };

  // delete module
  const deleteModule = () => {
    if (modules.length <= 1) {
      setError("You can't have less than one Module");
    } else {
      const newModules = [...modules];
      newModules.splice(index, 1);
      setModules(newModules);
    }
  };

  // delete asset
  const deleteAsset = (i) => {
    setModules(
      modules.map((mod, index2) => {
        if (index2 === index) {
          return {
            ...mod,
            assets: mod.assets.filter((index3) => index3 !== mod.assets[i]),
          };
        }
        return mod;
      })
    );
  };

  return (
    <div className="module">
      {view ? (
        <>
          <div className="top d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <p className="mb-0">Module Title: {module.title}</p>
              <i className="fa-solid fa-pen" onClick={() => setView(false)} />
              <i className="fa-solid fa-trash-can" onClick={deleteModule} />
            </div>
            {module.assets.length < 1 && (
              <i
                className="fa-solid fa-circle-plus"
                onClick={() => setAddBar(true)}
              />
            )}
          </div>
          {module.assets.map((item, i) => {
            {
              console.log(item);
            }
            return (
              <div key={i}>
                {item.type === "video" && (
                  <div className="row align-items-center mt-3" key={i}>
                    <div className="col-10">
                      <div className="item">
                        <p>
                          Video {i + 1}: <i className="fa-regular fa-file" />
                          {item.item.name}
                        </p>
                      </div>
                    </div>
                    <div className="col-1 d-flex justify-content-center">
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={(e) => deleteAsset(i)}
                      />
                    </div>
                    <div className="col-1">
                      <i
                        className="fa-solid fa-plus"
                        onClick={() => setAddBar(true)}
                      />
                    </div>
                  </div>
                )}
                {item.type === "pdf" && (
                  <div className="row align-items-center mt-3">
                    <div className="col-10">
                      <div className="item">
                        <p>
                          PDF {i + 1}: <i className="fa-regular fa-file-pdf" />
                          {item.item.name}
                        </p>
                      </div>
                    </div>
                    <div className="col-1 d-flex justify-content-center">
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={(e) => deleteAsset(i)}
                      />
                    </div>
                    <div className="col-1">
                      <i
                        className="fa-solid fa-plus"
                        onClick={() => setAddBar(true)}
                      />
                    </div>
                  </div>
                )}
                {item.type === "quiz" && (
                  <CreateQuizCard
                    item={item}
                    module={module}
                    modules={modules}
                    setModules={setModules}
                    moduleIndex={index}
                    deleteAsset={deleteAsset}
                    quizIndex={i}
                    setAddBar={setAddBar}
                  />
                )}
              </div>
            );
          })}
          {addBar && (
            <div className="add-bar d-flex align-items-center gap-5">
              <label htmlFor="video">
                <i className="fa-solid fa-plus" />
                Video
              </label>
              <input
                type="file"
                id="video"
                accept="video/*"
                hidden
                onChange={(e) => setVideo(e.target.files[0])}
              />
              <label htmlFor="pdf">
                <i className="fa-solid fa-plus" />
                PDF
              </label>
              <input
                type="file"
                id="pdf"
                accept=".pdf"
                hidden
                onChange={(e) => setPdf(e.target.files[0])}
              />
              <h4 onClick={addQuiz}>
                <i className="fa-solid fa-plus" />
                Quiz
              </h4>
              <h4>
                <i className="fa-solid fa-plus" />
                Note
              </h4>
              <i
                className="fa-solid fa-xmark"
                onClick={() => setAddBar(false)}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <label htmlFor="title">Module Title</label>
          <form onSubmit={changeTitle}>
            <input
              type="text"
              id="title"
              placeholder="Type Title Here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
          <h6 className="error">{titleError}</h6>
          <div className="d-flex justify-content-end">
            <button id="preview">Cancel</button>
            <button id="save" onClick={changeTitle}>
              Add Module
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ModuleCreateard;
