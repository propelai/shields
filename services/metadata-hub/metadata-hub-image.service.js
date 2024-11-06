// (1)
import Joi from 'joi'
import { renderVersionBadge } from '../version.js'
import { BaseJsonService, pathParams } from '../index.js'
import config from 'config'

const schema = Joi.object({
  image: Joi.string().required(),
  vulnerabilities: Joi.object().required({
    critical: Joi.number().required(),
    high: Joi.number().required(),
    low: Joi.number().required(),
    medium: Joi.number().required(),
    minimal: Joi.number().required(),
    unspecified: Joi.number().required(),
  }),
}).required()

// (2)
export default class MetadataHubImage extends BaseJsonService {
  // (3)
  static category = 'version'

  // (4)
  static route = {
    base: 'metadata/image',
    pattern: ':environment/:project/:container',
  }

  static openApi = {
    '/metadata/image/{environment}/{project}/{container}': {
      get: {
        summary: 'Metadata Hub (Image)',
        parameters: [
          ...pathParams(
            { name: 'environment', example: 'nosidelines' },
            { name: 'project', example: 'metadata-hub' },
            { name: 'container', example: 'metadata-hub' },
          ),
        ],
      },
    },
  }

  // (7)
  static defaultBadgeData = { label: 'kubernetes' }

  // (9)
  async fetch({ environment, container, project }) {
    return this._requestJson({
      schema,
      url: `${config.public.services.metadataHub.baseUri}/projects/${project}/image?environment=${environment}&container=${container}`,
    })
  }

  // (8)
  async handle({ environment, container, project }, { label = 'kubernetes' }) {
    const { image, vulnerabilities } = await this.fetch({
      environment,
      container,
      project,
    })
    return renderVersionBadge({
      defaultLabel: label,
      version: image,
      versionFormatter: () => {
        if (vulnerabilities.critical > 0) return 'red'

        if (vulnerabilities.high > 0) return 'orange'

        return 'blue'
      },
    })
  }
}
