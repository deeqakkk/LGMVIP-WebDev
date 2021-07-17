import React, {Component}  from 'react';
import CardList from '../components/CardList';
import Navbar from '../components/Navigation/Navigation';
import Loader from './loader';
import '../containers/styles.css';

class App extends Component{

    constructor(){
        super()
        //defining the states
        this.state={
            robots: [],
            searchfeild: '',
            isButtonClicked: false
        }
    }

    
    onButtonSubmit = () => {
        
        this.setState({isButtonClicked: !this.isButtonClicked})
        const timer = setTimeout(() => {
          
            fetch('https://reqres.in/api/users?page=1').then(response=> {
            return response.json();
            })
            .then(users=>{
                this.setState({robots: users.data})
            });
        }, 3000);
        return () =>clearTimeout(timer);
    }

   
    render(){

       
        const filteredRobots = this.state.robots.filter(robots=>{
            return robots.first_name.toLowerCase().includes(this.state.searchfeild.toLowerCase());
        })

       
        if(this.state.robots.length === 0 && this.state.isButtonClicked === false){
            return (
              <>
                <Navbar onButtonSubmit={this.onButtonSubmit}/>
                <h1 className='tc'>Click "Get Users" to get details.</h1>
              </>
            );

        }

          else if(this.state.robots.length === 0){
            return (
                <>
                  <Navbar onButtonSubmit={this.onButtonSubmit}/>
                  <h1 >Fetching Data...</h1>
                  <Loader className='loader'></Loader>
                </>
              );
        }

             else{
            return(
                <>
                  <Navbar onButtonSubmit={this.onButtonSubmit}/>
                  <div >
                      <h1>Data Fetched</h1>
                            
                        <CardList robots={filteredRobots}/>
                      

                  </div>
                 </>
              );
        }

    }

}

export default App;
