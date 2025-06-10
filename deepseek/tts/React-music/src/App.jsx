import { useState,useRef } from 'react'
import './App.css'

function App() {
  // React Use 开头 ref hook 可以获取 DOM 元素
  const audioPlayer = useRef(null)
  console.log(audioPlayer,'/////');
  const playMusic = () => {
    // console.log(audioPlayer,'+++');
    console.log('Play Music');
    audioPlayer.current.play();
  }
  return (
    <>
      <audio ref={audioPlayer} src="/sounds/snare.wav"></audio>
      <button onClick={playMusic}>播放</button>
    </>
  )
}

export default App
