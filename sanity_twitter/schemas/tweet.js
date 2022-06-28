export default {
  name: 'tweet',
  title: 'Tweet',
  type: 'document',
  fields: [
    {
      name: 'tweetTitle',
      title: 'Text in Tweet',
      type: 'text',
    },
    {
      name: 'tweetImage',
      title: 'Tweet Image from computer',
      type: 'image'
    },
    {
      name: 'tweetImageUrl',
      title: 'Tweet Image URL',
      type: 'string'
    },
    {
      name: 'tweetVideoUrl',
      title: 'Video URL',
      type: 'string'
    },
    {
      name: 'userId',
      title: 'User ID of initial Tweeter',
      type: 'string'
    },
    {
      name: 'tweetedBy',
      title: 'TweetedBy',
      type: 'tweetedBy'
      // type: 'reference',
      // to: {type: 'user'},
    },
    // {
    //   name: 'publishedAt',
    //   title: 'Published at',
    //   type: 'datetime',
    // },
    {
      name: 'comments',
      title: 'Comments',
      type: 'array',
      of: [{ type: 'comment' }],
    },
    {
      name: 'blockTweet',
      title: 'Block Tweet',
      description: 'ADMIN Controls: Toggle if Tweet is deemed inappropriate',
      type: 'boolean' 
    }
    // {
    //   name: 'mainImage',
    //   title: 'Main image',
    //   type: 'image',
    //   options: {
    //     hotspot: true,
    //   },
    // },
    // {
    //   name: 'secondaryImage',
    //   title: 'Backup for main Image, url image if user profile image is not uploaded from computer',
    //   type: 'string'
    // },
    // {
    //   name: 'categories',
    //   title: 'Categories',
    //   type: 'array',
    //   of: [{type: 'reference', to: {type: 'category'}}],
    // },
    // {
    //   name: 'body',
    //   title: 'Body',
    //   type: 'blockContent',
    // },
    // {
    //   name: 'blockTweet',
    //   title: 'Block Tweet',
    //   description: 'ADMIN Controls: Toggle if Tweet is deemed inappropriate',
    //   type: 'boolean' 
    // }
  ],

  // preview: {
  //   select: {
  //     title: 'title',
  //     author: 'tweetedBy.name',
  //     media: 'mainImage',
  //   },
  //   prepare(selection) {
  //     const {author} = selection
  //     return Object.assign({}, selection, {
  //       subtitle: author && `by ${author}`,
  //     })
  //   },
  // },
}
