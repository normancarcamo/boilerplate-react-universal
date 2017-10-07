import React from 'react'
import superagent from 'superagent'

export const loadData = () => new Promise((resolve, reject) => {
  superagent
    .get('https://api.github.com/users/normancarcamo/repos')
    .then(result => resolve(result))
    .catch(error => reject(error))
})