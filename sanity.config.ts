import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/sanity/schemas'

export default defineConfig({
  name: 'ramprate',
  title: 'RampRate',

  projectId: 'xdo1fb5d',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
