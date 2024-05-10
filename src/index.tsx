import { RouterContext, loadExternalStyles } from "alem";
import Main from "./Main";
import Spinner from "./components/Spinner";
import CartProvider from "./contexts/CartProvider";

const App = () => {
  const fontsLoaded = loadExternalStyles([
    "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
  ]);

  RouterContext();
  CartProvider();
  return <div className="app-container">{fontsLoaded ? <Main /> : <Spinner />}</div>;
};

export default App;
