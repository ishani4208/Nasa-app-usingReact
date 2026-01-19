import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import Main  from "./components/Main";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


function App() {
  const [data,setData]=useState(null)
  const [loading, setLoading] = useState(false)
  const NASA_KEY=import.meta.env.VITE_NASA_API_KEY
  const [showModel, setShowModel]=useState(false)

  function handleToggleModel(){
    setShowModel(!showModel)

  }

  useEffect(()=> {
    async function fetchAPIdata(){
      const url= 'https://api.nasa.gov/planetary/apod' + `?api_key=${NASA_KEY}`
      
      const today = (new Date()).toDateString()
      const localKey= `NASA-${today}`
      if (localStorage.getItem(localKey)) {
        const apiData=JSON.parse(localStorage.getItem(localKey))
        setData(apiData)
        console.log('Fetched from cache today')

        return
      }

      localStorage.clear()

      try {
        const res = await fetch(url)
        const apiData = await res.json()
        localStorage.setItem(localKey, JSON.stringify(apiData))
        setData(apiData)
        console.log('Fetched from api today',apiData)
      } catch(err) {
        console.log(err.message)
      }
    }
    fetchAPIdata()
  }, [])

  return (
    <>
    {data ? (<Main data={data} />):(
      <div className="loadingState">
        <i className="fa-solid fa-gear"></i>
      </div>
    )}
    {showModel && (
      <SideBar data={data} handleToggleModel={handleToggleModel}  />
    )}
      {data && (<Footer data={data} handleToggleModel={handleToggleModel}></Footer>)}
    </>
  )
}

export default App
