import { io } from 'socket.io-client';

const FORCE_PROD = false;
const GARY_TOU_API_DOMAIN =
	!FORCE_PROD && process.env.NODE_ENV === 'development'
		? 'localhost:4000'
		: 'api.garytou.com';
const SOCKET_IO_NAMESPACE = '/slash-z';

export default io(GARY_TOU_API_DOMAIN + SOCKET_IO_NAMESPACE);
