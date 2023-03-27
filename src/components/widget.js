import React, { useState } from "react";
import Modal from "react-modal";
import WriteStoryModal from "./writeStoryModal";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "./createGroupModal";
Modal.setAppElement("#root");

function Widget() {
  // history
  const navigate = useNavigate();

  const [widget, setWidget] = useState(false);
  const [writeStoryModal, setWriteStoryModal] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);

  return (
    <div>
      <button id="widget-trigger" onClick={() => setWidget(true)}>
        <i className="fa-solid fa-plus" />
      </button>

      {/* widget modal  */}
      <Modal
        isOpen={widget}
        onRequestClose={() => setWidget(false)}
        id="widget"
      >
        <button
          onClick={() => {
            setWidget(false);
            setWriteStoryModal(true);
          }}
        >
          New Post
        </button>
        <button>New Poll</button>
        <button onClick={() => navigate("/create-aspirant")}>
          New Aspirant Profile
        </button>
        <button
          onClick={() => {
            setWidget(false);
            setCreateGroupModal(true);
          }}
        >
          New Group
        </button>
      </Modal>

      {/* story modal  */}
      {writeStoryModal && (
        <WriteStoryModal
          openModal={writeStoryModal}
          handleWriteStoryModal={setWriteStoryModal}
        />
      )}

      {/* group modal  */}
      {createGroupModal && (
        <CreateGroupModal
          createGroupModal={createGroupModal}
          setCreateGroupModal={setCreateGroupModal}
        />
      )}
    </div>
  );
}

export default Widget;
