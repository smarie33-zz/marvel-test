import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import apiStuff from './apikey.js';
import {MD5} from './md5build.js';
import dateFormat from 'dateformat';
import update from 'react-addons-update'; 

class AlphabetList extends React.Component{
	constructor(props) {
    	super(props);
	    this.state = {
	    	//create an arrray from A to Z
			alphabets : [...Array(26)].map((q,w)=>String.fromCharCode(w+97))
	    };
	}
	render(){
		//create a list with A to Z
		const listAlphabet = this.state.alphabets.map((alphabet, index) =>{
	      return (
	      		<li 
	      		onClick={() => {this.props.onClick(index)}}
	      		key={alphabet.toString()}> 
	      			{alphabet} 
	      		</li>
	      	)
	    });
		return (
			<div className="col-sm-6 col-md-2 col-lg-1">
		        <ul className="main-browser">
		          {listAlphabet}
		        </ul>
		    </div>
		);
	}
}

//List out all of the characters after a letter is choosen
class CharacterListChildren extends React.Component {
	constructor(props) {
    	super(props);
	    this.state = {
	    };
	}
    render () {
        return (
        	<li onClick={(e) => {e.stopPropagation(); this.props.onClick(this.props.comics);}}>{this.props.name}</li>
        );
    }
}

class CharacterListContainer extends React.Component{
	constructor(props) {
    	super(props);
	    this.state = {
	    };
	}
	render(){
		const children = []
		let someReturn = true
		if("no" in this.props.selectedCharacters){
			someReturn = false
		}else{
			for (let i = 0; i < this.props.selectedCharacters.length; i += 1) {
	            children.push(<CharacterListChildren onClick={this.props.onClick.bind(this)} id={this.props.selectedCharacters[i].id} key={this.props.selectedCharacters[i]. id.toString()} name={this.props.selectedCharacters[i].name} comics={this.props.selectedCharacters[i].comics.collectionURI} />);
	        };
	    }
		return(
			<div className="col-sm-6 col-md-3">
				<ul className="characters">
					{someReturn ? children.length > 0 ? children : this.props.charactersLoading : this.props.selectedCharacters.no}
				</ul>
			</div>
		)
	}
}

//List out all the comics of a choosen character
class ComicListChildren extends React.Component {
	constructor(props) {
    	super(props);
	    this.state = {
	    };
	}
    render () {
        return (
        	<div className="row comic-row">
        		<div className="col-12">
		        	<div className="row comic-top">
		        		<div className="col-md-2 col-lg-1 comic-title">
		        			Title:
		        		</div>
			        	<div className="col-md-6 col-lg-7 comic-title">
			        		{this.props.title}
			        	</div>
			        	<div className="col-4 comic-id">
			        		ID: {this.props.id}
			        	</div>
			        </div>
			       <div className="row">
			        	<div className="col-6 comic-date">
			        		Release Date: {this.props.release}
			        	</div>
			        	{this.props.issue > 0 &&
							<div className="col-6 comic-issue">
				        		Issue Number: {this.props.issue}
				        	</div>
			        	}
		        	</div>
		        </div>
        	</div>
        );
    }
}

class ComicsContainer extends React.Component{
	constructor(props) {
    	super(props);
	    this.state = {
	    };
	}
	render(){
		const comics = []
		let someReturn = true
		if("no" in this.props.selectedComics){
			someReturn = false
		}else{
			for (let i = 0; i < this.props.selectedComics.length; i += 1) {
				let formateDate = dateFormat(this.props.selectedComics[i].dates[0].date, "mmm d, yyyy")
	            comics.push(<ComicListChildren id={this.props.selectedComics[i].id} key={this.props.selectedComics[i].id.toString()} title={this.props.selectedComics[i].title} issue={this.props.selectedComics[i].issueNumber} release={formateDate} />);
	        };
	    }
		return(
			<div className="col-md-7 col-lg-8">
			{someReturn ? comics.length > 0 ? comics : this.props.comicsLoading : this.props.selectedComics.no}
			</div>
		)
	}
}

class Instructions extends React.Component{
	constructor(props) {
    	super(props);
	    this.state = {
	    };
	}
	render(){
		return(
			<div className="col-12 instructions">
				<h1>Marvel Test</h1>
				<h3>{this.props.doThis}</h3>
			</div>
		)
	}
}

class App extends React.Component{
	constructor() {
    	super();
    	this.getCharacterInfo = this.getCharacterInfo.bind(this);
	    this.state = {
	    	offset : 0,
	    	characterTotal : 0,
	    	characters: [],
	    	comics: {},
	    	dothis: "Select a letter to show the character list",
	    	"charactersLoading": "",
	    	"comicsLoading": ""
	    };
	}
	getCharactersByLetter(alphabet){
		let curState = this
		//have tried a lot to get a wildcard search so am resorting to creating an array of where the positions
		//of each letter of the alphabet are
		//i know this is not extendable, please tell me how you guys pull content, based on letters from
		//your api
							// A  B  C   D   E   F   G   H   I   J   K   L   M   N   O   P   Q   R    S    T     U   V     W    X   Y    Z
		let letterPositions = [0,80,172,272,350,383,420,475,546,584,627,662,716,868,913,933,995,1004,1063,1259,1352,1373,1406,1462,1478,1481]
		let highestLimit = 100
		let calcOffset = letterPositions[alphabet]
		let curLimit = 0
		let getCharacters = {}
		let calcLimit = letterPositions[alphabet+1] - calcOffset
		alphabet !== (letterPositions.length -1) ? calcLimit = letterPositions[alphabet+1] - letterPositions[alphabet] : calcLimit = highestLimit
		let runAPIhitThisManyTimes = Math.ceil(calcLimit/highestLimit)
		calcLimit > highestLimit ? curLimit = highestLimit : curLimit = calcLimit
		curState.setState({comics: {}})
		curState.setState({characters: []})
		curState.setState({comicsLoading: ""})
		curState.setState({charactersLoading: "Loading..."})
		//you can only retrieve up to 100 items from the api at a time
		//so lists with more than that move the offset and call the left
		//over amounts
		for (let i = 0; i < runAPIhitThisManyTimes; i++) {
			let timestamp = new Date().getTime() / 1000
	 		let hashAll = MD5(timestamp+apiStuff.myPrvKey+apiStuff.myPubKey)
			axios.get('http://gateway.marvel.com/v1/public/characters', {
			    params: {
			      ts: timestamp,
			      apikey: apiStuff.myPubKey,
			      hash: hashAll,
			      offset: calcOffset,
			      limit: curLimit
			    }
			})
			.then(function (response) {
				let newCharacters = response.data.data.results.map((obj) => obj)
				if(newCharacters.length == 0){
					newCharacters = {'no': 'Sorry, there are no characters under this letter'}
					curState.setState({dothis: "Please select a different letter"})
				}else{
					curState.setState({dothis: "Please select a character"})
				}
					curState.setState({characters: curState.state.characters.concat(newCharacters)})
					console.log(curState.state.characters)
					
			})
			.catch(function (error) {
			    console.log(error);
			});
			if(runAPIhitThisManyTimes > 1){
				curLimit = Math.abs(calcLimit - (highestLimit * (i+1)))
				calcOffset = calcOffset + (highestLimit * (i+1))
			}
		}
	}

	getCharacterInfo(comics){
		let curState = this
		let timestamp = new Date().getTime() / 1000
	 	let hashAll = MD5(timestamp+apiStuff.myPrvKey+apiStuff.myPubKey)
	 	let highestLimit = 100
	 	curState.setState({comics: {}})
	 	curState.setState({comicsLoading: "Loading..."})
		axios.get(comics, {
		    params: {
		      ts: timestamp,
		      apikey: apiStuff.myPubKey,
		      hash: hashAll,
		      limit: highestLimit
		    }
		})
		.then(function (response) {
			let newComics = response.data.data.results.map((obj) => obj)
			if(newComics.length == 0){
				newComics = {'no': 'Sorry, there are no comic under this letter'}
				curState.setState({dothis: "Please select a different comic"})
				}else{
					curState.setState({dothis: "All available comics will be shown when loading is done"})
				}
			curState.setState({comics: newComics})
		})
		.catch(function (error) {
		    console.log(error);
		});
		

	}
	render(){
		return(
			<div className="container">
				<div className="row">
					<Instructions doThis={this.state.dothis} />
					<AlphabetList onClick={this.getCharactersByLetter.bind(this)} />
					<CharacterListContainer onClick={this.getCharacterInfo.bind(this)} selectedCharacters={this.state.characters} comicsLoading={this.state.comicsLoading} charactersLoading={this.state.charactersLoading} />
					<ComicsContainer selectedComics={this.state.comics} comicsLoading={this.state.comicsLoading} />
				</div>
			</div>
		) 
	}
}

render(<App/>, document.getElementById('app'));