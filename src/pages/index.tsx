import dayjs from 'dayjs'
import useCountDown from 'react-countdown-hook'
import prettyMilliseconds from 'pretty-ms'
import { useEffect, useState, useCallback } from 'react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import abi from '../data/abi.json'
// import TokenViewer from '../components/TokenViewer'

const date1 = dayjs('2023-05-28T19:00:00-04:00')
const date2 = dayjs(Date.now())

const initialTime = date1.diff(date2)
const interval = 100

export default function IndexPage() {
    const wallet = useWallet()

    const [status, setStatus] = useState('idle')
    const [timeLeft, { start }] = useCountDown(initialTime, interval)
    const [isTokenHolder, setIsTokenHolder] = useState(false)

    const web3 = new Web3(wallet.ethereum)
    const contract = new web3.eth.Contract(abi as any, `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`)
    const tokenAddress = '0x8Dc5Ff31384f26c968F92DC48136947e84FEe828' // Token address to check

    const checkTokenHolder = useCallback(async () => {
        if (wallet.account) {
            const tokenContract = new web3.eth.Contract(abi, tokenAddress)
            const balance = await tokenContract.methods.balanceOf(wallet.account).call()
            setIsTokenHolder(Number(balance) > 0)
        }
    }, [wallet.account, tokenAddress])

    useEffect(() => {
        if (wallet.status === 'connected') {
            checkTokenHolder()
        }
    }, [wallet.status, checkTokenHolder])

    // eslint-disable-next-line consistent-return
    const buyRocks = async (amount = 0) => {
        setStatus('loading')
        try {
            if (!wallet.account) return wallet.connect()

            await contract.methods.buyRocks(amount).estimateGas({ from: wallet.account, value: web3.utils.toWei((10 * amount).toString()) })

            await contract.methods.buyRocks(amount).send({ from: wallet.account, value: web3.utils.toWei((10 * amount).toString()) })
            setStatus('complete')
        } catch (error) {
            setStatus('error')
            console.log(error)
        }
    }

    useEffect(() => start(), [start])

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-12 font-mono">
            <div className="space-y-8">
                <div className="space-y-1">
                    <p>Introducing</p>
                    <p className="text-2xl font-bold">Fallen Souls</p>
                    <p className="text-xs opacity-50">Limited Editon</p>
                </div>

                <div className="md:max-w-3xl space-y-1">
                    <p className="text-2xl">The Fallen One Presents Limited Edition</p>
                    <p className="text-4xl md:text-5xl font-bold">Fallen Souls NFTs</p>
                </div>

                <div className="text-sm">
                    <span className="text-green-400" />
                </div>

                <div>
                    <p className="text-lg">The series includes 100 unique Souls minted on the Pulse Blockchain. Each Soul is a 1/1 and will never be minted again. A Soul can also be used as a PFP on SoulSwap.</p>
                </div>

                <div className="space-y-1">
                    {isTokenHolder ? (
                        <>
                            <p>~100 units available for $ONE Holders.</p>
                            <p className="text-xs">Only available for $ONE holders & a service charge of 30K PLS is applied.</p>
                        </>
                    ) : (
                        <p className="text-red-400">Only for $ONE Holders</p>
                    )}
                    <p className="text-3xl font-bold">{prettyMilliseconds(timeLeft)}</p>
                </div>

                <div className="space-y-2">
                    <p className="text-xs text-right opacity-50">{wallet.account ? `Connected as ${wallet.account.slice(0, 6)}...${wallet.account.slice(-6)}.` : 'Wallet not connected.'}</p>
                    {wallet.status !== 'connected' && (
                        <button onClick={buyRocks} type="button" className="bg-white text-black rounded w-full p-4 text-xl">
                            Connect Wallet
                        </button>
                    )}
                    {wallet.status === 'connected' && isTokenHolder && (
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => buyRocks(1)} type="button" className="bg-white text-black rounded w-full p-4">
                                Mint x1
                            </button>
                            <button onClick={() => buyRocks(2)} type="button" className="bg-white text-black rounded w-full p-4">
                                Mint x2
                            </button>
                            <button onClick={() => buyRocks(3)} type="button" className="bg-white text-black rounded w-full p-4">
                                Mint x3
                            </button>
                        </div>
                    )}

                    {wallet.status === 'connected' && !isTokenHolder && <p className="text-xs text-red-400">Only for $ONE Holders</p>}

                    {status === 'error' && <p className="text-xs text-red-400">An error occurred. Minting may not have opened yet!</p>}
                    {status === 'complete' && <p className="text-xs text-green-400">Your NFT has been minted to your wallet.</p>}
                </div>

                {/* <TokenViewer /> */}

                <div>
                    <img className="rounded max-w-2xl w-full" src="https://media.discordapp.net/attachments/1077288626133663824/1112065699637100604/ezgif-3-11bfeec08c.gif" alt="" />
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <img src="/img/cex-ser-card.png" alt="" />
                    <img src="/img/i-will-return-card.png" alt="" />
                    <img src="/img/no-rug-ser-card.png" alt="" />
                </div>

                <div>
                    <p className="opacity-50 text-center">
                        A{' '}
                        <a className="underline hover:no-underline" href="http://thefallenone.xyz" target="_blank" rel="noreferrer">
                            Fallen One
                        </a>{' '}
                        Project
                    </p>
                </div>
            </div>
        </div>
    )
}
