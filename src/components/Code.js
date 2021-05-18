import React, { useState, useEffect , useRef } from 'react';
import Editor from './Editor'
import useLocalStorage from './useLocalStorage'

function Code() {

  const [state , setState] = useState(false);
  const [html, setHtml] = useLocalStorage('html', '')
  const [css, setCss] = useLocalStorage('css', '')
  const [js, setJs] = useLocalStorage('js', '')
  const [srcDoc, setSrcDoc] = useState('')
  const nameRef = useRef();
  const uploadref = useRef();

  const URL = 'http://localhost:3100/api/code' ;
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRob21hc0BnbWFpbC5jb20iLCJpZCI6MzIsImlhdCI6MTYyMTM0ODY2MSwiZXhwIjoxNjIxNDI0MjYxfQ.ZpNgr3ZYArm7z6aPqgTnf0qmS8MPoxgr5g3XGgXSY1A"

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `)
    }, 250)

    return () => clearTimeout(timeout)
  }, [html, css, js])

  //saving document for the html files website
  const saveDocument =async (e)=>{

    e.preventDefault();
    if(nameRef.current.value === ""){

      alert('give name to save')
      return

    } 
    try{
      const code = html + '\n\n <style>' + css + "</style>\n\n <script> " + js + " \n</script>"

      
      const response = await fetch(URL,{
                          method:'POST',
                          headers:{
                          'Content-Type':'application/json',
                          'Authorization':token
                              },
                          body:JSON.stringify({
                              name:nameRef.current.value,
                              code:code
                              }) 
                      });
      console.log(response)
      const data = await response.json();

      alert(JSON.stringify(data));

    }
    catch(err){
      alert(err);
    }
  } ; 
    
  const fileHandler = (e)=>{
    let fileData = e.target.files[0];
    setState(fileData);

  }

  const submitFiles =async (e)=>{
    e.preventDefault();
    console.log(state)
    const name = state.name ;

    let formsData = new FormData();
    formsData.append('name',name);
    formsData.append('code',state)

    let response = await fetch('http://localhost:3100/api/code/uploads',{
                      method:'POST',
                      headers:{
                      'Authorization':token
                          },
                      body:formsData
                    });

    console.log(response);

  }

  // const view = (
 
  // )

  return (
    <> 
       <input
           id='file'
           type='file'
           ref={uploadref}
           onChange={fileHandler}
            ></input>
              
       <button
            type="button"
            onClick={submitFiles}
            className="btn waves-effect waves-light"
            > UPLOAD CODE FILES </button>
      <br></br>

    <div className="pane top-pane">
      <Editor
        language="xml"
        displayName="HTML"
        value={html}
        onChange={setHtml}
      />
      <Editor
        language="css"
        displayName="CSS"
        value={css}
        onChange={setCss}
      />
      <Editor
        language="javascript"
        displayName="JS"
        value={js}
        onChange={setJs}
      />
    </div>
      <input type="text" ref={nameRef} placeholder="file name"/>
      <button onClick={saveDocument}>SAVE</button>
      {/* <form>
        <input type="file" ref={uploadref}/>
        <button onClick={ submitFiles} ></button>
      </form> */}


    <div className="pane">
      <iframe
        srcDoc={srcDoc}
        title="output"
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
  </>
  )
}

export default Code;
