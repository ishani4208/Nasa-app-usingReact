import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import Main  from "./components/Main";

function App() {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;

  function handleToggleModal() {
    setShowModal(prev => !prev);
  }

  useEffect(() => {
    async function fetchAPIdata() {
      if (!NASA_KEY) {
        console.error("NASA API key missing");
        return;
      }

      const today = new Date().toDateString();
      const localKey = `NASA-${today}`;

      // ✅ Load from cache
      const cached = localStorage.getItem(localKey);
      if (cached) {
        setData(JSON.parse(cached));
        console.log("Fetched from cache");
        return;
      }

      try {
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch NASA APOD");
        }

        const apiData = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log("Fetched from API", apiData);
      } catch (err) {
        console.error(err.message);
      }
    }

    fetchAPIdata();
  }, [NASA_KEY]);

  return (
    <>
      {data ? (
        <Main data={data} />
      ) : (
        <div className="loadingState">
          <i className="fa-solid fa-gear fa-spin"></i>
        </div>
      )}

      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal} />
      )}

      {data && (
        <Footer data={data} handleToggleModal={handleToggleModal} />
      )}
    </>
  );
}

export default App;