import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => res.json({ 'msg': 'Welcome to the Rest API "Main".' }))
router.get('/repos', (req, res) => res.json({ 'msg': 'Ok.' }))

export default router
