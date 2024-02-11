import React, { useRef, useState, useEffect } from 'react'

import "./index.css"
import WhiteBoard from '../../components/Whiteboard';
import Chat from '../../components/ChatBar';


const RoomPage = ({user, socket, users}) => {

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('black');
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [userTabOpen, setUserTabOpen] = useState(false);
  const [openedChatTab, setOpenedChatTab] = useState(false);



  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillRect = "white";
    ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
    setElements([]);
  }

  const downloadImage = () => {
    const canvas = canvasRef.current;
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
  }

  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
   
    setElements((prevElements) => prevElements.slice(0, prevElements.length-1));
  }

  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1]
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length-1)); 
  }

  return (
    <>

    <div className='row'>
      <button type='button' className='btn btn-dark'
        style={{
          display:"block",
          position:"absolute",
          top:"5%",
          left:"2%",
          height:"40px",
          width:"100px",

        }}
        onClick={()=>setUserTabOpen(true)}
        >
        Users
      </button>
      <button type='button' className='btn btn-primary'
        style={{
          display:"block",
          position:"absolute",
          top:"5%",
          left:"10%",
          height:"40px",
          width:"100px",

        }}
        onClick={()=> setOpenedChatTab(true)}
        >
        Chat
      </button>
      {
        userTabOpen && (
          <div
            className='position-fixed top-0 left-0 h-100 text-white bg-dark'
            style={{width:"250px", left:"0%"}}
          >
            <button type='button'
            onClick={()=>setUserTabOpen(false)}
            className='btn btn-light btn-block w-100 mt-5'>
              Close
            </button>
            <div className='w-100 mt-5'>
            {
              users.map((usr, index) => (
                <p key={index*999} className='my-2 text-center w-100 '>
                  {usr.name} {user && user.userID === usr.userID}</p>
              ))
            }
            </div>
          </div>
        )
      }
      {
        openedChatTab && <Chat setOpenedChatTab={setOpenedChatTab} socket={socket}/>
      }
      <h1 className='text-center py-4'>Collaborative Whiteboard 
        <span className='text-primary'>[Users online: {users.length}]</span>
      </h1>
      {
        user && user.presenter && (
          <div className='col-md-10 mx-auto mt-4 mb-5 d-flex align-items-center justify-content-center'>
        <div className='d-flex col-md-2 justify-content-center gap-1 ms-4'>
          <div className='d-flex gap-1 align-items-center ms-4'>
            <input
              type='radio'
              name='tool'
              id='pencil'
              checked={tool === "pencil"}
              value='pencil'
              className='mt-1'
              onChange={(e)=>setTool(e.target.value)}
            />
            <label htmlFor='pencil'>Pencil</label>
          </div>
          <div className='d-flex gap-1 align-items-center ms-2'>
            <input
              type='radio'
              name='tool'
              id='line'
              checked={tool === "line"}
              value='line'
              className='mt-1 '
              onChange={(e)=>setTool(e.target.value)}
            />
            <label htmlFor='line'>Line</label>
          </div>
          <div className='d-flex gap-1 align-items-center ms-2'>
            <input
              type='radio'
              name='tool'
              id='rect'
              checked={tool === "rect"}
              value='rect'
              className='mt-1'
              onChange={(e)=>setTool(e.target.value)}
            />
            <label htmlFor='rect'>Rectangle</label>
          </div>
        </div>
        <div className='col-md-3 mx-auto'>
          <div className='d-flex align-items-center justify-content-center'>
            <label htmlFor='color'>Select color:</label>
            <input
              type='color'
              id='color'
              className='mt-1 ms-2'
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className='col-md-3 d-flex gap-2'>
          <button className='btn btn-primary mt-1'
            disabled={elements.length === 0}
            onClick={()=>undo()}
            >
            Undo</button>
          <button className='btn btn-outline-primary mt-1'
            disabled={elements.length < 1}
            onClick={()=>redo()}
            >
            Redo</button>
        </div>
        <div className='col-md-2'>
          <button className='btn btn-danger' onClick={handleClearCanvas}>Clear Canvas</button>
        </div>
        <div>
          <button onClick={downloadImage}> download</button>
        </div>
      </div>
        )
      }
      
      <div className='col-md-10 mx-auto mt-2 canvas-box'>
        <WhiteBoard 
        canvasRef={canvasRef} 
        ctxRef={ctxRef}
        elements={elements}
        setElements={setElements}
        color={color}
        tool={tool}
        user={user}
        socket={socket}
        />
      </div>
    </div>
    </>
  )
}

export default RoomPage