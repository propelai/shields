// (1)
import Joi from 'joi'
import configModule from 'config'
import { renderVersionBadge } from '../version.js'
import { BaseJsonService } from '../index.js'

const config = configModule.util.toObject()

const queryParamSchema = Joi.object({
  environment: Joi.string().required(),
  container: Joi.string().required(),
  project: Joi.string().required(),
  label: Joi.string(),
}).required()

const schema = Joi.object({
  image: Joi.string().required(),
}).required()

// (2)
export default class MetadataHubImage extends BaseJsonService {
  // (3)
  static category = 'version'

  // (4)
  static route = {
    base: 'metadata/image',
    pattern: '',
    queryParamSchema,
  }

  // (7)
  static defaultBadgeData = { label: 'kubernetes' }

  // (10)
  static render({ label, version }) {
    return renderVersionBadge({
      defaultLabel: label,
      version,
    })
  }

  // (9)
  async fetch({ environment, container, project }) {
    return this._requestJson({
      schema,
      url: `${config.public.services.metadataHub.baseUri}/projects/${project}/image?environment=${environment}&container=${container}`,
    })
  }

  // (8)
  async handle(_, { environment, container, project, label = 'kubernetes' }) {
    const { image } = await this.fetch({ environment, container, project })
    return this.constructor.render({
      version: image,
      label,
    })
  }
}
