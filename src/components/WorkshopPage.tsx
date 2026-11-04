import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import { defaultMotion, fontOptions, motionOptions } from '../data/workshop'
import { landing } from '../data/landing'
import { LandingPage } from './LandingPage'

export function WorkshopPage() {
  const [params, setParams] = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const font = fontOptions.find(item => item.id === params.get('font')) ?? fontOptions[0]
  const motionStyle = motionOptions.find(item => item.id === params.get('motion')) ?? defaultMotion
  const idle = params.has('idle') ? params.get('idle') === '1' : landing.idleMotion
  function change(key: string, value: string) {
    setCopied(false)
    setCopyError(false)
    setParams(previous => { const next = new URLSearchParams(previous); next.set(key, value); return next }, { replace: true })
  }
  async function copy() {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true) } catch { setCopyError(true) }
  }
  const controls = <section className="workshop-controls" aria-label="Design comparison">
    <div className="workshop-section"><h2>Typeface</h2><div className="workshop-options" role="group" aria-label="Typeface">{fontOptions.map(item => <button key={item.id} aria-pressed={font.id === item.id} onClick={() => change('font', item.id)}><span>{item.name}</span><small>{item.description}</small></button>)}</div></div>
    <div className="workshop-section"><h2>Movement</h2><div className="workshop-options motion-options" role="group" aria-label="Movement">{motionOptions.map(item => <button key={item.id} aria-pressed={motionStyle.id === item.id} onClick={() => change('motion', item.id)}><span>{item.name}</span><small>{item.description}</small></button>)}</div></div>
    <div className="workshop-bottom"><label><input type="checkbox" checked={idle} onChange={event => change('idle', event.target.checked ? '1' : '0')}/> Slow idle movement</label><button className="copy-comparison" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Link copied' : 'Copy comparison link'}</button></div>
    {copyError && <p className="copy-note" role="status">Copy the address from your browser to share this combination.</p>}
  </section>
  return <LandingPage preview={{ fontUrl: font.url, fontFamily: font.family, motionStyle, idle, controls }}/>
}
