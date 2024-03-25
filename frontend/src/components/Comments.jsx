import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import axios from "axios";

function Comments({ articleId }) {
  const mode = import.meta.env.VITE_MODE;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  const commentsEndRef = useRef(null);

  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    };
  }, []);

  useEffect(() => {
    setIsComponentMounted(true);
    setPage(1);
    setHasMore(true);
    setComments([]);
  }, [articleId]);

  useEffect(() => {
    if (!hasMore || !isComponentMounted) {
      return;
    }

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          mode === "DEV"
            ? `/api/comment/${articleId}?page=${page}`
            : `https://tech-tales-api.vercel.app/api/comment/${articleId}?page=${page}`,
          { withCredentials: true },
        );
        if (res.data.length === 0) {
          setHasMore(false);
        } else {
          setComments((prevComments) => {
            const newComments = res.data.filter((newComment) =>
              prevComments.every(
                (prevComment) => prevComment._id !== newComment._id,
              ),
            );
            return [...prevComments, ...newComments];
          });
        }
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId, page, hasMore, isComponentMounted]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    if (commentsEndRef.current) {
      observer.observe(commentsEndRef.current);
    }

    return () => {
      if (commentsEndRef.current) {
        observer.unobserve(commentsEndRef.current);
      }
    };
  }, [loading]);

  function handleReply(commentId) {
    setReplyTo((prevReplyTo) => (prevReplyTo === commentId ? null : commentId));
  }

  function handleReplyChange(e) {
    setReplyContent(e.target.value);
  }

  async function handleReplyPost(commentId, replyingTo) {
    try {
      const res = await axios.post(
        mode === "DEV"
          ? `/api/comment/${commentId}/reply/${articleId}`
          : `https://tech-tales-api.vercel.app/api/comment/${articleId}/reply/${commentId}`,
        { content: replyContent, replyingTo: replyingTo },
        { withCredentials: true },
      );

      const updatedComments = comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, res.data],
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyContent("");
    } catch (error) {
      console.log(error.message);
    }
  }

  function toggleReplies(commentId) {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment,
      ),
    );
  }

  return (
    <>
      {loading && <Loader />}
      {comments.map((comment, index) => (
        <div
          key={comment._id}
          className="flex flex-col items-start p-3 w-full rounded-xl text-slate-700"
          ref={commentsEndRef}
        >
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2 font-semibold">
              <img
                className="h-5 w-5"
                src={comment.writer.profilePicture}
                alt="Profile"
              />
              <p>{comment.writer.username}</p>
            </div>
            <button className="">Like</button>
          </div>
          <p>{comment.content}</p>
          <button onClick={() => handleReply(comment._id)}>Reply</button>
          {replyTo === comment._id && (
            <div className="flex justify-between gap-2 w-full">
              <textarea
                className="w-full bg-gray-100 mb-2 mt-2 p-2 rounded-lg outline-none outline-zinc-400 focus:outline-violet-700 resize-none"
                rows={1}
                placeholder="Write your reply..."
                value={replyContent}
                onChange={handleReplyChange}
              ></textarea>
              <button
                className="p-2 mt-2 text-white rounded bg-gradient-to-r from-violet-800 to-indigo-600 hover:opacity-90"
                onClick={() => handleReplyPost(comment._id, comment.writer)}
              >
                Post
              </button>
            </div>
          )}
          {comment.replies.length > 0 && !comment.showReplies && (
            <p
              className="text-sm cursor-pointer"
              onClick={() => toggleReplies(comment._id)}
            >
              View {comment.replies.length} replies
            </p>
          )}
          {comment.showReplies && comment.replies.length > 0 && (
            <>
              {comment.replies.map((reply) => (
                <div
                  key={reply._id}
                  className="flex flex-col items-start ml-3 mb-2 p-3 w-full rounded-xl text-slate-700"
                >
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-2 font-semibold">
                      <img
                        className="h-5 w-5"
                        src={reply.writer.profilePicture}
                        alt="Profile"
                      />
                      <p>{reply.writer.username}</p>
                      <p>@{reply.replyingTo.username}</p>
                    </div>
                    <button className="">Like</button>
                  </div>
                  <p>{reply.content}</p>
                  <button
                    className="mt-1"
                    onClick={() => handleReply(reply._id)}
                  >
                    Reply
                  </button>
                  {replyTo === reply._id && (
                    <div className="flex justify-between gap-2 w-full">
                      <textarea
                        className="w-full bg-gray-100 mt-2 p-2 rounded-lg outline-none outline-zinc-400 focus:outline-violet-700 resize-none"
                        rows={1}
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={handleReplyChange}
                      ></textarea>
                      <button
                        className="p-2 mt-2 text-white rounded bg-gradient-to-r from-violet-800 to-indigo-600 hover:opacity-90"
                        onClick={() =>
                          handleReplyPost(comment._id, reply.writer)
                        }
                      >
                        Post
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          {comment.showReplies && (
            <>
              <p
                className="text-sm mb-2 self-start cursor-pointer"
                onClick={() => toggleReplies(comment._id)}
              >
                Hide replies
              </p>
            </>
          )}
          <hr className="w-full mt-5" />
        </div>
      ))}
    </>
  );
}

export default Comments;
