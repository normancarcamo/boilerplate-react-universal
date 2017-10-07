import React from 'react'
import cheerio from 'cheerio'
import routes from 'shared/routes'
import { Router } from 'express'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { StaticRouter } from 'react-router'
import ReactDOM from 'react-dom/server'

function getTemplate() {
  try {
    return readFileSync(resolve(process.cwd(), 'build/public/index.html'), { encoding: 'UTF-8' })
  } catch (e) {
    throw e
  }
}

function avoidXSS(props) {
  return JSON.stringify(props).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
}

function addComponentToTemplate({ props, html }) {
  const content = getTemplate()
  let $ = cheerio.load(content)
  $('title').text(props.title || 'Untitled');
  $('head').append(`<script id="__initial_state__">window.__INITIAL_STATE__ = ${avoidXSS(props)};</script>`);
  $(`#root`).html(html);
  return $.html()
}

function getRoute(routes, path) {
  let route_ = null

  function get(_path, _routes) {
    _routes.some(route => {
      if ('path' in route && route.path === _path) {
        route_ = route
        return true
      } else {
        if ('routes' in route) {
          get(_path, route.routes)
        }
        return false
      }
    })
  }

  get(path, routes);
  return route_;
}

function renderComponent(Component, props, url) {
  let context = {}

  let content = (
    <StaticRouter location={url} context={context}>
      <Component {...props} />
    </StaticRouter>
  )

  if (process.env.NODE_ENV === 'production') {
    const htmlComponent = ReactDOM.renderToStaticMarkup(content)
    return {
      html: addComponentToTemplate({ html: htmlComponent, props: props }),
      context: context
    };
  } else {
    const htmlComponent = ReactDOM.renderToString(content)
    return {
      html: addComponentToTemplate({ html: htmlComponent, props: props }),
      context: context
    };
  }
}

function render(req, res, props = {}) {
  const { html, context } = renderComponent(routes[0].component, props, req.url)
  if (context.url) {
    res.redirect(context.status, context.url)
  } else if (context.status) {
    res.status(context.status).send(html)
  } else {
    res.send(html)
  }
}

const router = Router()

router.get('*', async (req, res) => {
  const route = getRoute(routes, req.originalUrl)
  if (route && route.loadData) {
    try {
      const response = await route.loadData()
      render(req, res, { title: 'Boilerplate', data: response.body })
    } catch(error) {
      render(req, res, { title: 'Boilerplate', error: error.response.body })
    }
  } else {
    render(req, res, { title: 'Boilerplate' })
  }
})

export default router
