var React = require('react');
var ReactDOM = require('react-dom');

const ini_state = {
	valid: true,
	voted: false
};

var App = React.createClass({
	componentWillMount() {
		this.setState(ini_state);
		$.ajax("/count", {
	      method: "get",
	      success: function (response) {
	      	response = Number(response)
	      	if (response <= 0) {
	      		this.getResults();
	      	} else {
	        	this.setState({count: response});
	    	}
	      }.bind(this),
	      error: function (err) {
	        console.log('error', err)
	      }.bind(this)
	    });
	},
	getResults() {
		$.ajax("/results", {
	      method: "get",
	      success: function (response) {
	      	this.setState({
	      		result: response,
	      		completed: true
	      	});
	      }.bind(this),
	      error: function (err) {
	        console.log('error', err)
	      }.bind(this)
	    });
	},
	validateAnswer(evt) {
		//skip all events except for Enter
		if (evt.hasOwnProperty('key') && evt.key !== "Enter") return;
		evt.preventDefault();
		var ans = evt.target.value;
		evt.target.value = "";
		$.ajax("/passphrase", {
	      method: "POST",
	      data: {
	        pw: ans
	      },
	      success: function (response) {
	        if (response === "invalid") {
	        	this.setState({valid: false});
	        	return
	        }
	        if (response === "voted") {
				this.setState({voted: true});
			} else {
				this.setState({choice: true})
			}
	      }.bind(this),
	      error: function (err) {
	        console.log('error', err)
	      }.bind(this)
	    });
		
	},
	onClick(evt) {
		evt.preventDefault();
		this.setState({voted: false, choice: false});
	},
	choose(evt) {
		evt.preventDefault();
		var ans = evt.target.value;
		$.ajax("/choose", {
	      method: "POST",
	      data: {
	        choice: ans
	      },
	      success: function (response) {
	        this.setState({
	        	voted: true,
	        	count: response
	        });
	      }.bind(this),
	      error: function (err) {
	        console.log('error', err)
	      }.bind(this)
	    });

	},
	render: function() {
		if (this.state.completed) {
			return (
				<center> 
					<h2> Voting has completed </h2> 
					<h3 className="red"> Result: {this.state.result} </h3>
				</center>
			)
		}

		if (this.state.voted) {
			return (
				<center> 
					<h2> You've voted! </h2> 
					<h3> Remaining Votes: {this.state.count} </h3>
					<form>
					<button onClick={this.onClick} className="btn btn-default"> Home </button>
					</form>
				</center>)
		}
		if (this.state.choice) {
			return (
				<div> 
					<center> 
						<h2> Pick one: </h2> 
						<br/> 
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
					<h2> Fly you fools! </h2>
					<h3> Remaining Votes: {this.state.count} </h3>
					<br/>
					{this.state.valid || <h3 className="red"> Invalid PassPhrase </h3>}
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
