import React from "react";
import "./App.css";
import firebase from "./firebase";
import config from "./config";
import { Layout, Avatar, Button } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
const { Content, Footer } = Layout;

//https://github.com/lowmess/hero-patterns#readme

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			home: window.location.pathname === "/",
			open: window.location.pathname.toLowerCase() === "/open",
			homeZoomURL: "",
			homeZoomScheme: "",
			homeZoomJoin: false,
			openMeetings: {},
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
						const homeZoomURL =
							"https://" + snapshot.val().domain + "/j/" + snapshot.val().id;
						const homeZoomScheme =
							(this.state.mobile ? "zoomus" : "zoommtg") +
							"://" +
							snapshot.val().domain +
							"/join?confno=" +
							snapshot.val().id;

						this.setState({ homeZoomURL, homeZoomScheme });

						if (config.autoLaunch) {
							window.location.href = homeZoomScheme;
							this.logHomeJoin();
							this.setState({ homeZoomJoin: true });
						}
					}
				}.bind(this)
			);

		firebase
			.database()
			.ref("openMeetings")
			.on(
				"value",
				function (snapshot) {
					if (snapshot.exists()) {
						this.setState({ openMeetings: snapshot.val() });
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
							<div className="home-title">
								<Avatar src="gary.jpg" className="home-title-avatar" />
								<h1>Join Gary's Zoom Meeting</h1>
							</div>
							<div>
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
										}
										setInterval(
											function () {
												this.setState({ homeZoomJoin: true });
											}.bind(this),
											100
										);
									}.bind(this)}
								>
									Join Zoom
								</Button>
							</div>
						</>
					) : this.state.open ? (
						<h1>Start Meeting!</h1>
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
