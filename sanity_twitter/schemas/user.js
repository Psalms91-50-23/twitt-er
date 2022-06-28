export default {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'userName',
            title: 'UserName',
            type: 'string'
        },
        {
            name: 'password',
            title: 'Password Hashed',
            type: 'string'
        },
        {
            name: 'passwordEncodedPattern',
            title: 'Password Encoded Pattern',
            type: 'string'
        },
        {
            name: 'imageUrl',
            title: 'Image Url',
            type: 'string',
            // type: 'url',
            // hidden: ({document}) => document?.profileImage,
            // validation: Rule => Rule.uri({
            //     scheme: ['http', 'https', 'mailto', 'tel']
            //   })
        },
        {
            name: 'profileImage',
            title: 'Profile Image',
            type: 'image',
            // hidden: ({document}) => document?.imageUrl,
            options: {
                hotspot: true,
              }
        },
        // {
        //     name: 'imageFile',
        //     title: 'Image File',
        //     type: 'file'
        // }
    ]
    
}