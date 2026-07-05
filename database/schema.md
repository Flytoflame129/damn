# Database Schema

This MVP uses WeChat Cloud Database collections. All write operations go through the `api` cloud function so `_openid` can be enforced server-side.

## Collections

### `users`

- `_openid`: WeChat user openid
- `role`: `learner` or `tutor`
- `createdAt`, `updatedAt`

Indexes:

- `_openid`

### `tutorProfiles`

- `_openid`: owner openid
- `ownerOpenid`: duplicated for query clarity
- `realName`, `school`, `major`, `grade`
- `skills`: supported non-academic skills
- `regions`: supported Deyang regions
- `price`: hourly price in RMB
- `bio`
- `verificationStatus`: `draft`, `pending`, `approved`, `rejected`
- `rating`
- `createdAt`, `updatedAt`

Indexes:

- `_openid`
- `verificationStatus`
- `skills`
- `regions`

### `demands`

- `_openid`: creator openid
- `ownerOpenid`
- `learnerInfo`, `skill`, `mode`, `region`, `time`
- `budgetMin`, `budgetMax`
- `location`, `note`
- `status`: `open`, `matched`, `closed`
- `createdAt`, `updatedAt`

Indexes:

- `_openid`
- `status`
- `skill`
- `region`

### `applications`

- `_openid`: tutor openid
- `demandId`
- `tutorProfileId`
- `tutorOpenid`
- `learnerOpenid`
- `status`: `pending`, `matched`, `rejected`, `cancelled`, `completed`
- `createdAt`, `updatedAt`

Indexes:

- `_openid`
- `demandId`
- `learnerOpenid`
- compound unique operational rule: one tutor can apply to one demand once

### `verifications`

- `_openid`: tutor openid
- `ownerOpenid`
- `proofFileId`
- `status`: `pending`, `approved`, `rejected`
- `reviewNote`
- `createdAt`, `updatedAt`

### `conversations`

- `applicationId`
- `participantOpenids`
- `title`
- `lastMessage`
- `createdAt`, `updatedAt`

### `messages`

- `conversationId`
- `senderOpenid`
- `text`
- `createdAt`

## Permissions

Use "only creator can read/write" for private collections, but keep writes routed through cloud functions. Public marketplace reads should also go through cloud functions to avoid leaking verification files or private addresses.
