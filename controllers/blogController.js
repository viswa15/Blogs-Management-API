import Blog  from '../models/blog.js';
// import { User } from '../models/user';

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username role').populate('comments', 'content author createdAt').populate('comments.author', 'username');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createBlog = async (req, res) => {
    const { title, content } = req.body;
    const author = req.user._id;

    try {
        const blog = new Blog({ title, content, author });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateBlog = async (req, res) => {
    const { id } = req.params; // Ensure the parameter is named id
    const updatedData = req.body;
    const author = req.user._id;

    try {
        console.log(`Updating blog with ID: ${id}`); // Debug statement

        const blog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });
        console.log(`Blog found:`, blog); // Debug statement

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Uncomment the following lines to enforce role-based access control
        // if (blog.author.toString() !== author && req.user.role !== 'Admin' && req.user.role !== 'Editor') {
        //     return res.status(403).json({ message: 'Access denied' });
        // }

        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Error updating blog:', error); // Debug statement
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteBlog = async (req, res) => {
    const { id } = req.params; // Ensure the parameter is named id
    const author = req.user._id;

    try {
        console.log(`Deleting blog with ID: ${id}`); // Debug statement

        const blog = await Blog.findById(id);
        console.log(`Blog found:`, blog); // Debug statement

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.author.toString() !== author && req.user.role !== 'Admin' && req.user.role !== 'Editor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await blog.remove();
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        console.error('Error deleting blog:', error); // Debug statement
        res.status(500).json({ message: 'Server error' });
    }
};