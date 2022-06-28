import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';
import blockContent from './blockContent';
import category from './category';
import tweet from './tweet';
import tweetedBy from './tweetedBy';
import commentedBy from './commentedBy';
import user from './user';
import profile from './profile';
import comment from './comment';
export default createSchema({
  // We name our schema
  name: 'default',
  types: schemaTypes.concat([
    tweet,
    tweetedBy,
    category,
    user,
    profile,
    comment,
    commentedBy,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
    blockContent,
  ]),
})
