var React = require('react');
var ReactDOM = require('react-dom');

const ini_state = {
	valid: true,
	voted: false
};
var destinations = ["Canada", "Cankun", "Iceland", "Machu Pichu", "Tokyo (Request by Mufei)"];

class App extends React.Component{
	constructor(props) {
		super(props);
		var new_state = JSON.parse(JSON.stringify(ini_state));
		destinations.forEach(function(d){
			new_state[d] = "btn btn-default";
		});
		this.state = new_state;
	}
	componentWillMount() {	
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
	}
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
	}
	onClick(evt) {
		evt.preventDefault();
		this.setState({voted: false, choice: false});
	}
	updateButton(evt) {
		evt.preventDefault();
		var new_state = {};
		new_state = Object.assign(this.state);
		if (new_state[evt.target.value] === "btn selected") {
			new_state[evt.target.value] = "btn btn-default"
		} else {
			new_state[evt.target.value] = "btn selected";
		}
		this.setState(new_state);
	}
	submit_choice(evt) {
		evt.preventDefault();
		var selected = [];
		destinations.forEach(function(d){
			if (this.state[d] === "btn selected") selected.push(d);
		}.bind(this));
		if (selected.length) {
			$.ajax("/choose", {
		      method: "POST",
		      data: {
		        choices: JSON.stringify(selected),
		      	pw : this.state.pw
		      },
		      success: function (response) {
		      	if (response === "done") {
		      		this.getResults();  
		      	} else {
		      		this.setState(this.getInitialState());
		    		this.setState({voted: true});
		      		this.setState({count: response});
		      	}  
		      }.bind(this),
		      error: function (err) {
		        console.log('error', err)
		      }.bind(this)
		    });
		} else {
			this.setState({unselected: true});
		}
	}
	go_vote(evt) {
		evt.preventDefault();
		var ans = '123';
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
				this.setState({
					pw: ans,
					choice: true})
			}
	      }.bind(this),
	      error: function (err) {
	        console.log('error', err)
	      }.bind(this)
	    });
	}
	render() {
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
					<button onClick={this.onClick.bind(this)} className="btn btn-default"> Home </button>
					</form>
				</center>)
		}
		if (this.state.choice) {
			var buttons = [];
			for (var i = 0; i < destinations.length; i++) {
				buttons.push(<button
							key={destinations[i]}
							className={this.state[destinations[i]]}
							value={destinations[i]}
							onClick={this.updateButton}>{destinations[i]} </button>)
			}
			var angry = this.state.unselected ? "red" : "";
			return (
				<div> 
					<center> 
						<h2 className={angry}> Pick any: </h2> 
						<br/> 
						<form>
							<span> {buttons} </span>
							<span> <button
									key="submit"
									className="btn btn-danger"
									onClick={this.submit_choice.bind(this)}> Submit </button>
							</span>
						</form>
					</center>
				</div> 

			)
		}
		return (
			<div>
				<center>
					<h2> We proudly present: Fly you fools! </h2>
					<h3> Remaining Votes: {this.state.count} </h3>
					<br/>
					<button key="go_vote" className="btn btn-primary" onClick={this.go_vote.bind(this)}> Vote </button>
				</center>
			</div>
		);
	}
}


ReactDOM.render(<App />, document.getElementById('root'));
