import { useRouter } from 'next/router'
import { client } from '../../lib/client'

const Tweet = ({tweet}) => {
  const router = useRouter()
  console.log({router});
    console.log({tweet});
  return (
    <article>
      <h1>{router.query.id}</h1>
    </article>
  )
}


export async function getStaticPaths() {
  const query = `*[_type == "tweet"`;
    // const paths = await client.fetch(
    //   `*[_type == "tweet"]`
    // )
    // console.log({paths});
    const paths = users.map((user) => ({
      params: {
          user_id: `${user._id}`
      }
  }))

  }
  
  export async function getStaticProps({ params: { tweet_id }}) {
    // const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    // It's important to default the slug so that it doesn't return "undefined"
    const query = `*[_type == "tweet" && _id == '${tweet_id}'][0]`;
    // const { _id = "" } = context.params
    const tweet = await client.fetch(query, { tweet_id });
    // const tweet = await client.fetch(`*[_type == "tweet" && _id == $_id][0]`)

    console.log({tweet});
    return {
      props: {
        tweet
      }
    }
  }

export default Tweet