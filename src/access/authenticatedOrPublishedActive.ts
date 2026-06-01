import type { Access, Where } from 'payload'

export const authenticatedOrPublishedActive: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  const where: Where = {
    and: [
      { _status: { equals: 'published' } },
      { listingStatus: { equals: 'active' } },
    ],
  }

  return where
}
