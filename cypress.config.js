import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: './cypress/support/component-index.html'
    // supportFile: false //Your project does not contain a default supportFile. We expect a file matching cypress/support/component.{js,jsx,ts,tsx} to exist.
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173'
  }
})
