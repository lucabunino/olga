import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'a070v72n',
    dataset: 'production'
  },
  studioHost: 'olgastudio',
  deployment: {
    appId: 'z76avheqo455ydg0mkynta6z',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: false,
  }
})
