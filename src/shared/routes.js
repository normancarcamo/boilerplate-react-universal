import App        from 'components/App';
import Home       from 'components/Home';
import About      from 'components/About';
import Topics     from 'components/Topics';
import Topic      from 'components/Topics/Topic';
import NotFound   from 'components/NotFound';
import Welcome    from 'components/Welcome';
import * as Repos from 'components/Repos'

const routes = [
  { component: App,
    routes: [
      { path: '/', component: Home, },
      { path: '/about', component: About },
      { path: '/topics', component: Topics, routes: [ { path: '/topics/:topicId', component: Topic } ] },
      Repos,
      { component: NotFound },
    ],
  },
]

export default routes