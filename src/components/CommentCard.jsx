import { useState } from "react";
import { MoreVertical, ThumbsUp, ThumbsUpIcon } from "lucide-react";
import { Avatar, Button, Textarea, AlertPopup } from "@/components";
import { commentService } from "@/backend";
import { timeAgo } from "@/utils/time";
import { useSelector } from "react-redux";

const CommentCard = ({ comment, onDelete, onLike }) => {
    const { id, owner } = comment;

    const [savedContent, setSavedContent] = useState(comment.content);
    const [savedDate, setSavedDate] = useState(comment.date);
    const [isUpdated, setIsUpdated] = useState(comment.isUpdated || false);
    const [isCommentLiked, setIsCommentLiked] = useState(comment.isLiked);
    const [text, setText] = useState(savedContent);
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);

    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
    const showAlert = (type, message) => setAlert({show: true, type, message})
    const closeAlert = () => setAlert({...alert, show: false})

    const userData = useSelector(state => state.auth.userData);
    const showEdits = userData.username === comment.owner.username

    const handleEdit = () => {
        setText(savedContent);
        setIsEditing(true);
        setOpen(false);
    };

    const handleCancel = () => {
        setText(savedContent);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!text) return;
        try {
            const response = await commentService.updateComment(id, text);
            setSavedContent(text);
            setSavedDate(response.date);
            setIsUpdated(response.isUpdated);
            setIsEditing(false);
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Something went wrong";
            showAlert("error", message);
            handleCancel();
        }
    };

    const handleDelete = async () => {
        try {
            await commentService.deleteComment(id);
            onDelete(id);
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Something went wrong";
            showAlert("error", message);
        } finally {
            setOpen(false);
        }

    };

    const handleLike = async () => {
        try {
            const { action } = await commentService.toggleCommentLike(id);
            if (action === 'liked') {
                onLike(id, 1);
                setIsCommentLiked(true);
            } else if (action === 'unliked') {
                onLike(id, -1);
                setIsCommentLiked(false)
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Something went wrong";
            showAlert("error", message);
        }
    };
    return (
        <div className="flex gap-3">
            <Avatar
                src={owner.avatar}
                name={owner.name || owner.username}
                size="sm"
                className="w-8 h-8"
            />

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div className="leading-tight">
                        <span className="font-semibold text-gray-900 text-sm">
                            {owner.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                            @{owner.username} • {timeAgo(savedDate)}
                            {isUpdated && <span className="ml-1">(edited)</span>}
                        </span>
                    </div>

                    {/* Menu */}
                    <div className="relative">
                        {showEdits && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOpen(prev => !prev)}
                            >
                                <MoreVertical size={16} />
                            </Button>
                        )}

                        {open && (
                            <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-md z-10">
                                <button
                                    onClick={handleEdit}
                                    className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="mt-2">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        readOnly={!isEditing}
                        className={`
                            resize-none text-sm transition-all
                            ${isEditing
                            ? "border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
                            : "border-transparent bg-transparent cursor-default"}
                        `}
                    />

                    {!isEditing && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-1 text-xs transition-colors
                                    ${isCommentLiked ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}
                                `}
                            >
                                {isCommentLiked ? (
                                    <ThumbsUpIcon size={14} />
                                ) : (
                                    <ThumbsUp size={14} />
                                )}
                                <span>{comment.likes || 0}</span>
                            </button>
                        </div>
                    )}

                    {isEditing && (
                        <div className="flex gap-2 mt-2 justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!text.trim() || text === savedContent}
                        >
                            Save
                        </Button>
                        </div>
                    )}
                </div>
            </div>
            <AlertPopup
                show={alert.show}
                type={alert.type}
                message={alert.message}
                onClose={closeAlert}
            />
        </div>
    );
};

export default CommentCard;
