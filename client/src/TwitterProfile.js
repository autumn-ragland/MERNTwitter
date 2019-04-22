import React, {Component} from 'react';

class TwitterProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData:'',
            checkbox:false,
            tweetArray:[]
        };
        this.userFetch();
    }

    //fetch to grab user profile image and header
    userFetch = () => {
        if(this.props.isLoggedIn === true){
            fetch('/users/searchUsers',{
                method:'POST',
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username:this.props.username,
                })
            })
                .then(data=>data.json())
                .then(returnedData => this.setState({userData:returnedData}))
                .then(()=> this.mapTweets())
        }
        else{
            console.log('User must login')
        }
    };

    mapTweets = () => {
        if (this.state.userData.tweets) {
            console.log(this.state.userData.tweets);
            let tweetMap = this.state.userData.tweets.map((eachTweet) => {
                return (
                    <div key={eachTweet._id} className={'tweetGrid'}>
                        <p className={'tweetMessage'}>{eachTweet.tweetMessage}</p>
                        <img className={'tweetImage'} src={eachTweet.tweetImage} alt=""/>
                    </div>
                )
            });
            this.setState({tweetArray:tweetMap})
        }
    };

    //add tweet form submission event handler
    formSubmit = (e) => {
        if (e.target.tweetPublic.value === 'on'){
            this.setState({checkbox:true})
        }
        e.preventDefault();
        fetch('/users/addTweet', {
            method:'POST',
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username:this.props.username,
                tweetMessage:e.target.tweetMessage.value,
                tweetImage:e.target.tweetImage.value,
                tweetPublic:this.state.checkbox,
            })
        })
            .then(()=>console.log('Tweet Added'))
    };



    render() {
        //logged in user
        if (this.props.isLoggedIn === true) {
            return (
                <div className="App">
                    <h1>{this.props.username}'s Profile</h1>
                    <div className={'profileImages'}>
                        <img className={'profile'} src={this.state.userData.profileImage} alt=""/>
                        <img className={'background'} src={this.state.userData.backgroundImage} alt=""/>
                    </div>
                    <h2>Add Tweet</h2>
                    <form onSubmit={this.formSubmit}>
                        <div className={'formStyle'}>
                            <label htmlFor={'tweetMessage'}>Tweet Message: </label>
                            <input type="text" id={'tweetMessage'} name={'tweetMessage'}/>
                        </div>
                        <div className={'formStyle'}>
                            <label htmlFor={'tweetImage'}>Tweet Image URL: </label>
                            <input type="text" id={'tweetImage'} name={'tweetImage'}/>
                        </div>
                        <div className={'formStyle'}>
                            <label htmlFor={'tweetPublic'}>Public Tweet: </label>
                            <input type="checkbox" name={'tweetPublic'}/>
                        </div>
                        <div className={'formStyle'}>
                            <input type="submit" value={'add tweet'}/>
                        </div>
                    </form>
                    <h3>Your Tweets</h3>
                    {this.state.tweetArray}
                </div>
            );
        }
        //not logged in user
        else{
            return (
                <div className="App">
                    <h3>Please Log In to View Your Profile</h3>
                </div>
            )
        }
    }
}

export default TwitterProfile;