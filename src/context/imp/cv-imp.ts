/**
 * Computer Vision
 * A set of functions that can be used to image classification, object detection, and more
 */

import { HfInference } from '@huggingface/inference'
import { env } from '~/utils/env'

/**
 * Policies
 * A set of policies that can be used to classify an image
 */

const policies = {
  nsfw: {
    labels: [
      'nsfw',
    ],
    score: 0.85,
  },
}

type Policy = keyof typeof policies

/**
 * Classification
 * A function that classifies an image based on a policy
 */

export async function classification(data: Uint8Array, policy: Policy) {
  const hf = new HfInference(env.HUGGINGFACE_SECRET)

  const result = await hf.imageClassification({
    data,
    model: 'Falconsai/nsfw_image_detection',
  })

  if (!result)
    return false

  const acl = policies[policy]

  if (!acl)
    return false

  const labels = result.filter((x) => {
    const labels = x.label.split(', ')
    const unique = [...new Set(labels.map(x => x.toLowerCase()))]

    return unique.some(x => acl.labels.includes(x))
  })

  if (!labels.length)
    return false

  const score = Math.max(...labels.map(x => x.score))

  return score >= acl.score
}
