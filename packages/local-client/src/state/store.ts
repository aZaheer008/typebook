import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { persistMiddlware } from "./middlewares/persist-middlware";
import reducers from './reducers';

export const store = createStore(reducers,{},applyMiddleware(persistMiddlware,thunk))
