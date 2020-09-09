import React from "react";
import "./App.css";
import firebase from "./firebase";
import config from "./config";
import { Layout, Avatar, Button, Form, Input } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import Filter from "bad-words";
import OpenMeeting from "./components/OpenMeeting";
const { Content, Footer } = Layout;

//https://github.com/lowmess/hero-patterns#readme

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			home: window.location.pathname === "/",
			open: window.location.pathname.toLowerCase() === "/open",
			homeZoomURL: "#",
			homeZoomScheme: "#",
			homeZoomJoin: false,
			mobile: /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(
				navigator.userAgent.toLowerCase()
			),
		};
	}

	componentDidMount() {
		firebase
			.database()
			.ref("home")
			.once(
				"value",
				function (snapshot) {
					if (snapshot.exists()) {
						const homeZoomScheme = this.state.mobile
							? snapshot.val().mobileScheme
							: snapshot.val().desktopScheme;
						this.setState({
							homeZoomURL: snapshot.val().url,
							homeZoomScheme,
						});

						if (config.autoLaunch) {
							window.location.href = homeZoomScheme;
							this.setState({ homeZoomJoin: true });
							this.logHomeJoin();
						}
					}
				}.bind(this)
			);
	}

	async logHomeJoin() {
		firebase
			.database()
			.ref("home/joins")
			.push(firebase.database.ServerValue.TIMESTAMP);
	}

	render() {
		return (
			<Layout style={{ minHeight: "100vh" }}>
				<Content style={{ padding: "5vw" }}>
					{this.state.home ? (
						<>
							<div className="home-wrapper">
								<div className="home-title">
									<Avatar src="gary.jpg" className="home-title-avatar" />
									<div className="home-title-right">
										<h1>Gary's Zoom Meeting</h1>
										<Button
											type="primary"
											href={
												!this.state.homeZoomJoin
													? this.state.homeZoomScheme
													: this.state.homeZoomURL
											}
											onClick={function () {
												if (!this.state.homeZoomJoin) {
													this.logHomeJoin();
													setInterval(
														function () {
															this.setState({ homeZoomJoin: true });
														}.bind(this),
														100
													);
												}
											}.bind(this)}
											size="large"
										>
											Join Zoom
										</Button>
									</div>
								</div>
								<div>still in development!</div>
							</div>
						</>
					) : this.state.open ? (
						<OpenMeeting />
					) : (
						<>
							<Helmet>
								<title>Gary's Zoom Portal - 404</title>
							</Helmet>
							<h1>404</h1>
						</>
					)}
				</Content>
				<Footer style={{ textAlign: "center" }}>
					<a className="gh-link" href="https://github.com/garytou2/Zoom-Portal">
						Zoom Portal <GithubOutlined />
					</a>
					<span className="credit-sep">|</span>
					Developed by <a href="https://garytou.com">Gary Tou</a>
				</Footer>
			</Layout>
		);
	}
}

export default App;
