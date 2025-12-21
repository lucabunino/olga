import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {myStructure} from './structure.js'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {media, mediaAssetSource} from 'sanity-plugin-media'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const singletonTypes = new Set(['homepage', 'studio', 'info', 'seo'])

export function StatusBadge(props) {
  const status = props.published?.status || props.draft?.status
  if (!status) return null

  let color = 'primary'
  if (status === 'public') color = 'success'
  if (status === 'hidden') color = 'warning'

  return {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    title: `Status: ${status}`,
    color,
  }
}

export default defineConfig({
	name: 'default',
	title: 'Olga',

	projectId: 'a070v72n',
	dataset: 'production',

	plugins: [
		structureTool({
			structure: myStructure,
		}),
		visionTool(),
		media(),
	],

	form: {
		image: {
			assetSources: () => [mediaAssetSource],
		},
	},

	schema: {
		types: schemaTypes,
	},
	
	document: {
		actions: (input, context) =>
			singletonTypes.has(context.schemaType)
				? input.filter(({ action }) => action && singletonActions.has(action))
				: input,
		badges: [StatusBadge]
	},
})
