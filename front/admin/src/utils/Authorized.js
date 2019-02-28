import renderAuthorized from 'components/Authorized'
import { getAuthority } from './authority'

let Authorized = renderAuthorized(getAuthority())

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = renderAuthorized(getAuthority())
}

export { reloadAuthorized }
export default Authorized
