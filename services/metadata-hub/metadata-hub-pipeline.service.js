// (1)
import Joi from 'joi'
import configModule from 'config'
import { renderBuildStatusBadge } from '../build-status.js'
import { BaseJsonService } from '../index.js'

const config = configModule.util.toObject()

const schema = Joi.object({
  pipeline_name: Joi.string().required(),
  pipeline_type: Joi.string().required(),
  pipelinerun_name: Joi.string().required(),
  pipelinerun_namespace: Joi.string().required(),
  pipelinerun_url: Joi.string().required(),
  status: Joi.string().required(),
}).required()

const documentation = `
<p>
  This badge works with Metadata Hub to display the status of the last Tekton PipelineRun.
</p>


<p>
  <b>Note:</b><br>
  1. Parameter <code>project</code> accepts a unique workload name.
  2. Parameter <code>type</code> accepts the Tekton pipeline type, which is one of publish, test, and scan<br>
</p>
`

// (2)
export default class MetadataHubPipeline extends BaseJsonService {
  // (3)
  static category = 'build'

  // (4)
  static route = {
    base: 'metadata/pipeline',
    pattern: ':project/:type',
  }

  static examples = [
    {
      title: 'Metadata Hub (Pipeline)',
      namedParams: {
        project: 'metadata-hub',
        type: 'test',
      },
      staticPreview: this.render({
        status: 'passed',
        label: 'tekton',
      }),
      documentation,
    },
  ]

  // (7)
  static defaultBadgeData = { label: 'tekton' }

  // (10)
  static render({ label, status }) {
    return renderBuildStatusBadge({
      label,
      status,
    })
  }

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
    return this.constructor.render({
      status: status.toLowerCase(),
      label,
    })
  }
}
