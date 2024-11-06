// (1)
import Joi from 'joi'
import config from 'config'
import { renderBuildStatusBadge } from '../build-status.js'
import { BaseJsonService, pathParams } from '../index.js'

const schema = Joi.object({
  pipeline_name: Joi.string().required(),
  pipeline_type: Joi.string().required(),
  pipelinerun_name: Joi.string().required(),
  pipelinerun_namespace: Joi.string().required(),
  pipelinerun_url: Joi.string().required(),
  status: Joi.string().required(),
}).required()

// (2)
export default class MetadataHubPipeline extends BaseJsonService {
  // (3)
  static category = 'build'

  // (4)
  static route = {
    base: 'metadata/pipeline',
    pattern: ':project/:type',
  }

  static openApi = {
    '/metadata/pipeline/{project}/{type}': {
      get: {
        summary: 'Metadata Hub (Pipelines)',
        parameters: [
          ...pathParams(
            { name: 'project', example: 'metadata-hub' },
            { name: 'type', example: 'type' },
          ),
        ],
      },
    },
  }

  // (7)
  static defaultBadgeData = { label: 'tekton' }

  // (9)
  async fetch({ project, type }) {
    return this._requestJson({
      schema,
      url: `${config.public.services.metadataHub.baseUri}/pipelines/latest?project=${project}&type=${type}`,
    })
  }

  // (8)
  async handle({ project, type }, { label = 'tekton' }) {
    const { status } = await this.fetch({ project, type })

    console.log(status)
    return renderBuildStatusBadge({
      status: status.toLowerCase(),
      label,
    })
  }
}
