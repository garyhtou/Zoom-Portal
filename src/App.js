import React from "react";
import "./App.css";
import firebase from "./firebase";
import config from "./config";
import { Layout, Avatar, Button, Form, Input, Tooltip } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import moment from "moment";
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
			homeZoomJoin: /\bCrOS\b/.test(navigator.userAgent) ? true : false,
			mobile: /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(
				navigator.userAgent.toLowerCase()
			),
			homeOngoing: null,
			homeOnGoingMessage: null,
		};

		this.homeOnGoingMessage = this.homeOnGoingMessage.bind(this);
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

		fetch("https://api.garytou.com/v1/zoom/ongoing")
			.then((response) => response.json())
			.then((data) => {
				if (Object.keys(data).length !== 0) {
					return this.setState({ homeOngoing: data });
				} else {
					return this.setState({ homeOngoing: null });
				}
			})
			.then(() => {
				this.homeOnGoingMessage();
				this.homeOnGoingMessageInteral = setInterval(
					this.homeOnGoingMessage,
					15000
				);
			});
	}

	componentWillUnmount() {
		this.homeOnGoingMessageInteral &&
			clearImmediate(this.homeOnGoingMessageInteral);
		this.homeOnGoingMessageInteral = undefined;
	}

	async logHomeJoin() {
		firebase
			.database()
			.ref("home/joins")
			.push(firebase.database.ServerValue.TIMESTAMP);
	}

	homeOnGoingMessage() {
		const message =
			this.state.homeOngoing !== null
				? this.state.homeOngoing.topic +
				  " " +
				  (moment(this.state.homeOngoing.start_time, "x").isBefore(moment())
						? "started"
						: "starting") +
				  " " +
				  moment(this.state.homeOngoing.start_time, "x").fromNow()
				: null;
		this.setState({
			homeOnGoingMessage: message,
		});
	}

	render() {
		return (
			<>
				{this.state.home ? (
					<>
						<div className="home">
							<div className="home-wrapper">
								<div className="home-title">
									<div className="home-title-content">
										<h1>Gary's Zoom Meeting</h1>
										<p>{this.state.homeOnGoingMessage} </p>

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
											className="home-join-button"
										>
											Join Zoom
										</Button>
									</div>
									<div>
										<Tooltip
											title={
												<a
													href="https://garytou.com"
													rel="noopener"
													style={{ color: "inherit", fontWeight: "bold" }}
												>
													Visit my website
												</a>
											}
										>
											<Avatar
												src="https://assets.garytou.com/profile/GaryTou.jpg"
												className="home-title-avatar"
												shape="circle"
											/>
										</Tooltip>
									</div>
								</div>{" "}
							</div>
							<Footer style={{ textAlign: "center" }} className="home-footer">
								<a
									className="gh-link"
									href="https://github.com/garyhtou/Zoom-Portal"
								>
									Zoom Portal <GithubOutlined />
								</a>
								<span className="credit-sep">|</span>
								Developed by <a href="https://garytou.com">Gary Tou</a>
							</Footer>
						</div>
					</>
				) : this.state.open ? (
					<Layout style={{ minHeight: "100vh" }}>
						<Content style={{ padding: "5vw" }}>
							<OpenMeeting />
						</Content>
						<Footer style={{ textAlign: "center" }}>
							<a
								className="gh-link"
								href="https://github.com/garyhtou/Zoom-Portal"
							>
								Zoom Portal <GithubOutlined />
							</a>
							<span className="credit-sep">|</span>
							Developed by <a href="https://garytou.com">Gary Tou</a>
						</Footer>
					</Layout>
				) : (
					<>
						<Layout style={{ minHeight: "100vh" }}>
							<Content style={{ padding: "5vw" }}>
								<Helmet>
									<title>Gary's Zoom Portal - 404</title>
								</Helmet>
								<h1>404</h1>
							</Content>
							<Footer style={{ textAlign: "center" }}>
								<a
									className="gh-link"
									href="https://github.com/garyhtou/Zoom-Portal"
								>
									Zoom Portal <GithubOutlined />
								</a>
								<span className="credit-sep">|</span>
								Developed by <a href="https://garytou.com">Gary Tou</a>
							</Footer>
						</Layout>
					</>
				)}
			</>
		);
	}
}

export default App;
