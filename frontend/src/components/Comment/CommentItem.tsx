import styles from "./comment-item.module.css";
import { CommentType } from "../../utils/type";
import { format } from "timeago.js";
import { FC } from "react";

interface CommentItemProps {
  comment: CommentType;
}

const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className={styles.commentItem}>
      <div className={styles.commentTop}>
        <div className={styles.leftTop}>
          {typeof comment.user === "object" && "image" in comment.user && (
            <>
              <img src={comment.user.image} alt="UserImg" />
              <div className={styles.userPrimaryInfo}>
                <h3>{comment.user.username}</h3>
                <p>{comment.user.email}</p>
              </div>
            </>
          )}
        </div>
        <div className={styles.rightTop}>
          {comment.createdAt && <p>{format(comment.createdAt)}</p>}
        </div>
      </div>
      <div className={styles.commentDown}>
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentItem;
