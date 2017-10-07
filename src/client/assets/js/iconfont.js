import ionicons from 'assets/css/vendor/ionicons.min.css'
import fontAwesome from 'assets/css/vendor/font-awesome.min.css'

let icons = Object.assign(fontAwesome, ionicons)

export const fa = (name) => {
  return `${icons.fa} ${icons[`fa-${name}`]}`
}

export const ion = (name) => {
  return icons[`ion-${name}`]
}

export default icons