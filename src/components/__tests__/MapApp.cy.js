// import { cypress as cy } from 'cypress'
// import { cypress as cy } from 'cypress/vue'
import { setActivePinia, createPinia } from 'pinia'

import MapApp from '@/components/MapApp.vue'

describe('<MapApp />', () => {
  setActivePinia(createPinia())
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(MapApp)
  })
})
