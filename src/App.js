import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import {Switch, Route} from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";




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
