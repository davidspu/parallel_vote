var React = require('react');
var ReactDOM = require('react-dom');
var pw = require('../allowed_pw').pw;
const ini_state = {voted: false,
						iceland: 0,
						cankun: 0,
						machu: 0,
						canada: 0,
						count: 5
						};
var App = React.createClass({
	componentWillMount() {
		this.setState(ini_state);
	},
	validateAnswer(evt) {
		//skip all events except for Enter
		if (evt.hasOwnProperty('key') && evt.key !== "Enter") return;
		evt.preventDefault();
		var ans = evt.target.value;
		evt.target.value = "";
		if (this.state[ans]) {
			this.setState({voted: true});
			return;
		}
		if (pw.indexOf(ans) > -1){
			var new_state = {};
			new_state[ans] = true;
			new_state['choice'] = true;
			this.setState(new_state);
		}
	},
	choose(evt) {
		evt.preventDefault();
		var ans = evt.target.value;
		if (this.state.hasOwnProperty(ans)) {
			var new_state = {};
			new_state[ans] = this.state[ans] + 1;
			new_state['count'] = this.state['count'] - 1;
			this.setState(new_state);
			this.setState({voted: true});
		}

	},
	render: function() {
		console.log(this.state);
		if (this.state.voted) {
			return (
				<center> 
					<h2> You've voted! </h2> 
					<h3> Remaining Votes: {this.state.count} </h3>
				</center>)
		}
		if (this.state.choice) {
			return (
				<div> 
					<center> 
						<form>
							<select
						      	onChange={this.choose}
						      	autoFocus={focus}
						      	>
						      	<option value="select" key = "dummy">Select</option>
						      	<option value="cankun" key = "cankun">Cankun</option>
						      	<option value="iceland" key = "iceland">Iceland</option>
						      	<option value="machu" key = "machu">Machu Pichu</option>
						      	<option value="canada" key = "canada">Canada</option>
						    </select>
						</form>
					</center>
				</div> 

			)
		}
		return (
			<div>
				<center>
					<h2> Vote you fools! </h2>
					<h3> Remaining Votes: {this.state.count} </h3>
					<br/>
					<form>
						<span> Enter your passphrase: </span> 
						&nbsp; <input 
									type={"password"}
									autoFocus={focus} 
									onKeyPress={this.validateAnswer}
									defaultValue={""}
								/> 
					</form>
				</center>
			</div>
		);
	}
});


ReactDOM.render(<App />, document.getElementById('root'));
