import { Router } from 'express'

import apis from './api'
import ssr from './ssr'

const router = Router()

router.use('/api', apis)
router.use(ssr)

export default router
