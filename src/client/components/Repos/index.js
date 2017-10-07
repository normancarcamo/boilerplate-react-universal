import React from 'react'
import superagent from 'superagent'
import Repos from './Repos.js'
import { Repos as Lazy } from 'shared/Lazy'
import { loadData as request } from './actions.js'

export const path = '/repos'
export const component = Repos
export const lazy = Lazy
export const loadData = request
