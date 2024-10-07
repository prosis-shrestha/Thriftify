import styles from "./Comment.module.css";

import { format } from "timeago.js";

const CommentItem = ({ comment }) => {
  return (
    <div className={styles.commentItem}>
      <div className={styles.commentTop}>
        <div className={styles.leftTop}>
          <img src={comment.user.image} alt="UserImg" />
          <div className={styles.userPrimaryInfo}>
            <h3>{comment.user.username}</h3>
            <p>{comment.user.email}</p>
          </div>
        </div>
        <div className={styles.rightTop}>
          <p>{format(comment.createdAt)}</p>
        </div>
      </div>
      <div className={styles.commentDown}>
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentItem;
