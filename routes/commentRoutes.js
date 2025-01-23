import express from 'express';
import { createComment, getComments, deleteComment } from '../controllers/commentController.js';
import { authenticate } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/:blogId/comments', authenticate, createComment);
router.get('/:blogId/comments', getComments);
router.delete('/comments/:commentId', authenticate, deleteComment);

export default router;