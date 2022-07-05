export default {
    name: 'profile',
    title: 'Profile',
    type: 'document',
    fields: [
        {
            name: 'firstName',
            title: 'First Name',
            type: 'string'
        },
        {
            name: 'lastName',
            title: 'Last Name',
            type: 'string'
        },
        {
            name: 'profileBackDropURL',
            title: 'Profile URL Image Backdrop',
            type: 'string'
        },
        {
            name: 'bio',
            title: 'Bio',
            type: 'text'
        },
        {
            name: 'profileImageBackdrop',
            title: 'Backdrop Image from computer',
            type: "image"
        },
        {
            name: 'userId',
            title: 'User Id',
            type: 'reference',
            to: {type: 'user'}
        }
    ]
}