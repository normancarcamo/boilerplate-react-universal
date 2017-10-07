// dependencies:
import 'colors'
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import router from './router'
import favicon from 'serve-favicons'
import { resolve } from 'path'

// variables helpers:
const app = express()
const server = http.createServer(app)
const cwd = (src) => resolve(process.cwd(), src)
const env = process.env.NODE_ENV

// settings:
app.set('iface', '0.0.0.0')
app.set('port', 3000)
app.set('x-powered-by', false)

// middlewares:
app.use(bodyParser.json())                            // Parse application/json
app.use(bodyParser.urlencoded({ extended: true }))    // Parse application/x-www-form-urlencoded
app.use(favicon(cwd('config/favicon/favicon.ico')))  // favicon.ico
app.use(express.static(cwd('build/public'), { index: false })) // Static assets
app.use(router)

// server start:
server.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`.cyan, `(${env.underline.green})`)
})
