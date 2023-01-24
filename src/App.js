// import Register from "./components/Register";
// import Login from "./components/Login";
// import ipConfig from "./ipConfig.json";
// import theme from "./theme";
// import { ThemeProvider } from "@mui/material";
// import { Routes, Route } from "react-router-dom";
// import Products from "./components/Products";



// export const config = {
//   endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
// };

// function App() {
//   return (
//     <div className="App">
   
//       <Routes>
//           <Route exact path ="/register" element={  <Register /> } /> 
//           <Route exact path ="/login" element={ <Login /> } /> 
//           <Route exact path ="/" element={<Products /> } />
//         </Routes>

//     </div>

//   );
// }

// export default App;


import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import {Switch, Route} from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
// import Checkout from './components/Checkout'
// import { RouteSharp } from "@mui/icons-material";
// import Thanks from "./components/Thanks";
// console.log("relative path")
// console.log("relative path")
// console.log("relative path")




export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
     <Switch>
      <Route exact path="/" component={Products} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />  
     
     </Switch>
     </div>
  );
}

export default App;

