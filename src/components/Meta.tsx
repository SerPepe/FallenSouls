import Head from 'next/head'

const Meta = () => {
    const title = 'Fallen Souls'
    const description = 'Fallen Souls. The Official NFT for SoulSwap. 100 Skulls Only for $ONE Holders.'
    const url = 'https://souls.thefallenone.xyz'

    return (
        <Head>
            <title>Fallen Souls</title>
            <meta name="description" content={description} />
            <meta property="og:type" content="website" />
            <meta name="og:title" property="og:title" content={title} />
            <meta name="og:description" property="og:description" content={description} />
            <meta property="og:site_name" content={title} />
            <meta property="og:url" content={url} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:site" content={url} />
            <link rel="icon" type="image/gif" href="https://media.discordapp.net/attachments/1077288626133663824/1112065699637100604/ezgif-3-11bfeec08c.gif" />
            <meta property="og:image" content="https://media.discordapp.net/attachments/1077288626133663824/1112065699637100604/ezgif-3-11bfeec08c.gif" />
            <meta name="twitter:image" content="https://media.discordapp.net/attachments/1077288626133663824/1112065699637100604/ezgif-3-11bfeec08c.gif" />
        </Head>
    )
}

export default Meta
