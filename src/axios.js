import axios from "axios";

const instance = axios.create({
	baseURL: "https://pfentries.herokuapp.com",
	headers: {'Accept': 'application/json'}
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

// instance.interceptors.request...

export default instance;