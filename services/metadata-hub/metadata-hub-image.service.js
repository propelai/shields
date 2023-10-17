// (1)
import Joi from 'joi'
import configModule from 'config'
import { renderVersionBadge } from '../version.js'
import { BaseJsonService } from '../index.js'

const config = configModule.util.toObject()

const schema = Joi.object({
  image: Joi.string().required(),
}).required()

const documentation = `
<p>
  This badge works with Metadata Hub to display the image tag of a container running in a pod in a Kubernetes cluster.
</p>


<p>
  <b>Note:</b><br>
  1. Parameter <code>project</code> accepts a unique workload name. It should be what you set using the pod label <code>metadata.nosidelines.io/name</code><br>
  2. Parameter <code>environment</code> accepts the GCP project name.<br>
  3. Parameter <code>container</code> accepts the container name inside the pod.<br>
</p>
`

// (2)
export default class MetadataHubImage extends BaseJsonService {
  // (3)
  static category = 'version'

  // (4)
  static route = {
    base: 'metadata/image',
    pattern: ':environment/:project/:container',
  }

  static examples = [
    {
      title: 'Metadata Hub (Image)',
      namedParams: {
        project: 'metadata-hub',
        environment: 'nosidelines',
        container: 'metadata-hub',
      },
      staticPreview: this.render({
        version: 'gcr.io/nosidelines/metadata-hub:0.0.0',
      }),
      documentation,
    },
  ]

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
  async handle({ environment, container, project }, { label = 'kubernetes' }) {
    const { image } = await this.fetch({ environment, container, project })
    return this.constructor.render({
      version: image,
      label,
    })
  }
}
