import Comment  from '../models/comment.js';
import  Blog  from '../models/blog.js';

export const createComment = async (req, res) => {
    const { blogId } = req.params;
    const { content } = req.body;
    const author = req.user._id;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const comment = new Comment({ content, author, blog });
        await comment.save();

        blog.comments.push(comment._id);
        await blog.save();

        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getComments = async (req, res) => {
    const { blogId } = req.params;

    try {
        const comments = await Comment.find({ blog: blogId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const author = req.user._id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== author) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await comment.remove();

        const blog = await Blog.findById(comment.blog);
        if (blog) {
            blog.comments = blog.comments.filter(commentId => commentId.toString() !== comment._id.toString());
            await blog.save();
        }

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};