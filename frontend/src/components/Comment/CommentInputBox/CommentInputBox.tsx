import styles from "./CommentInput.module.css";
import { useContext, useState } from "react";
import { ChangeEvent } from "react";
import { AddCommentApi } from "../../../utils/api";
import { ThriftContext } from "../../../context/Context";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";
const CommentInputBox = () => {
  const [commentInput, setCommentInput] = useState("");
  const {
    state: { user },
    dispatch,
  } = useContext(ThriftContext);
  const { id } = useParams();
  const { alert } = useAlert();
  // console.log("current User",user)

  const handleCommenInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("error", "You need to login first");
      return;
    }

    if (!commentInput || !id || !user._id) return;
    const commentPayload = {
      user: user._id,
      product: id,
      text: commentInput,
    };

    try {
      const { status, data } = await AddCommentApi(commentPayload);
      if (status === 200) {
        setCommentInput("");
        dispatch({ type: "setRefresh" });
        alert("success", "You commented successfully");
      }
    } catch (error) {
      alert("error", "Failed to comment ");

      console.log(error);
    }
  };
  return (
    <div className={styles.commentWrapper}>
      <input
        type="text"
        name=""
        id=""
        placeholder="Comment here ..."
        value={commentInput}
        onChange={handleCommenInputChange}
      />
      <button onClick={handleSubmit}>Comment</button>
    </div>
  );
};

export default CommentInputBox;
