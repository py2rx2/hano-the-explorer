
import { Hono } from 'hono';

import { getPosts, createPost, getPostById, updatePost, deletePost } from '../controllers/PostController';

//inistialize router
const router = new Hono()

//routes posts index
router.get('/', (c) => getPosts(c));

//routes posts create
router.post('/', (c) => createPost(c));

router.get('/:id', (c) => getPostById(c));

router.patch('/:id', (c) => updatePost(c));

router.delete('/:id', (c) => deletePost(c));


export const Routes = router;