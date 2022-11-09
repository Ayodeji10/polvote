import React, { useState, useContext } from "react";
import { DataContext } from "../dataContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
Modal.setAppElement("#root");

function CreateNoteCard({
  item,
  modules,
  setModules,
  moduleIndex,
  deleteAsset,
  noteIndex,
  setAddBar,
}) {
  // context
  const { context } = useContext(DataContext);

  const [view, setView] = useState(false);
  const [viewContent, setViewContent] = useState(true);
  const [title, setTItle] = useState("");
  const [titleError, setTitleEror] = useState("");
  const [noteModal, setNoteModal] = useState(false);

  //   change title
  const changeTitle = () => {
    if (title.length < 1) {
      setTitleEror("Please input Note Title");
    } else {
      setTitleEror("");
      setModules(
        modules.map((mod, i) => {
          if (moduleIndex === i) {
            return {
              ...mod,
              assets: mod.assets.map((asset, index) => {
                if (noteIndex === index) {
                  return { ...asset, title: title };
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

  // test editor mdulr
  const editorModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // text editor format
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  // editor state
  const [noteText, setNoteText] = useState("");
  const [editorError, setEditorError] = useState("");

  //   addNote
  const addNote = () => {
    if (noteText.length < 1) {
      setEditorError("Please Type in your notes");
    } else {
      setModules(
        modules.map((mod, i) => {
          if (moduleIndex === i) {
            return {
              ...mod,
              assets: mod.assets.map((asset, index) => {
                if (noteIndex === index) {
                  return { ...asset, note: noteText };
                }
                return asset;
              }),
            };
          }
          return mod;
        })
      );
      setNoteModal(false);
      console.log(modules);
    }
  };

  return (
    <div className="row mt-3">
      <div className="col-9">
        <div className="createQuizCard">
          {view ? (
            <>
              <div className="item d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  Note {noteIndex + 1}:{" "}
                  <i className="fa-regular fa-note-sticky" />
                  {item.title}
                </h3>
                {item.note.length === 0 ? (
                  <h4 className="mb-0" onClick={() => setNoteModal(true)}>
                    <i className="fa-solid fa-circle-plus" />
                    Add Content
                  </h4>
                ) : (
                  <i
                    onClick={() => setViewContent(!viewContent)}
                    className={`fa-solid fa-angle-${
                      viewContent ? "up" : "down"
                    }`}
                  />
                )}
                <Modal
                  isOpen={noteModal}
                  onRequestClose={() => setNoteModal(false)}
                  id="create-note"
                  className={`${context.darkMode ? "dm" : ""}`}
                >
                  <i
                    className="far fa-times-circle"
                    onClick={() => setNoteModal(false)}
                  />
                  <h1>Note</h1>
                  <ReactQuill
                    theme="snow"
                    placeholder="Type note here"
                    value={noteText}
                    onChange={setNoteText}
                    modules={editorModules}
                    formats={formats}
                  />
                  <h6 className="error">{editorError}</h6>
                  <div className="d-flex justify-content-end">
                    <button id="add" onClick={addNote}>
                      Add Note
                    </button>
                  </div>
                </Modal>
              </div>
              {viewContent && item.note.length !== 0 && (
                <div className="bottom d-flex justify-content-between">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${item.note}`,
                    }}
                  ></div>
                  <i
                    className="fa-solid fa-pen"
                    onClick={() => {
                      setNoteText(item.note);
                      setNoteModal(true);
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="initial">
              <label htmlFor="note-title">Note Title</label>
              <input
                type="text"
                placeholder="Type Title Here"
                id="note-title"
                value={title}
                onChange={(e) => setTItle(e.target.value)}
              />
              <h6 className="error mb-3">{titleError}</h6>
              <div className="d-flex justify-content-end">
                <button id="preview">Cancel</button>
                <button id="save" onClick={changeTitle}>
                  Add Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-1 d-flex justify-content-center">
        <i className="fa-solid fa-pen" onClick={() => setView(false)} />
      </div>
      <div className="col-1 d-flex justify-content-center">
        <i
          className="fa-solid fa-trash-can"
          onClick={(e) => deleteAsset(noteIndex)}
        />
      </div>
      <div className="col-1">
        <i className="fa-solid fa-plus" onClick={() => setAddBar(true)} />
      </div>
    </div>
  );
}

export default CreateNoteCard;
