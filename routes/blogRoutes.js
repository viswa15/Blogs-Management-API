import express from 'express';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { authenticate, authorize } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.post('/', authenticate,authorize(['Admin']), createBlog);
router.put('/:_id', authenticate,authorize(['Admin', 'Editor']), updateBlog);
router.delete('/:_id', authenticate,authorize(['Admin']), deleteBlog);

export default router;