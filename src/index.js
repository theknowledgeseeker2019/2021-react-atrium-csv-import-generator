import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function formatDate(date, format) {
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yyyy/gi, matched => map[matched])
}

class MyForm extends React.Component{
    constructor(props){
        super(props);

        


        const today = new Date(); 
        today.setFullYear(today.getFullYear() + 5);
        today.setDate(today.getDate() + 1);
        // console.log(today);
        // console.log('Today is ' + formatDate(today, 'yyyy-mm-dd'));

        
        


        this.state = {
            lastCampusID: '1000000000', 
            fname: 'Gift -', 
            lname: '', 
            amount: '',
            expDate: formatDate(today, 'yyyy-mm-dd'),
            numOfCards: '1', 
            entries: ''
        }

        this.handleChange = this.handleChange.bind(this);  
        this.handleAddEntries = this.handleAddEntries.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }


    handleChange(e){
        const target = e.target;  
        const name = e.target.name; 
        const value = e.target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]:value
        })


        

    }


    handleAddEntries(e){
        e.preventDefault();

        let cards = []; 
        let lastCardNum = this.state.lastCampusID;
        let numOfCards = this.state.numOfCards;
        const fname = this.state.fname;
        const lname = this.state.lname; 
        const amount = this.state.amount;
        const expDate = this.state.expDate + ' 00:00:00'


        let counter = 1; 
        for (counter; counter <= numOfCards; counter++){
            lastCardNum++; 

            cards.push({
                lastCardNum, 
                fname,
                lname, 
                amount, 
                expDate, 
                counter
            })
        }

        console.log(cards);

        /* next phase */

        const csvHeaders = 'External_ID,CardNum,Name_First,Name_Last,Amount,Expiration,Counter\n' 

        let rowEntry = '';

        if (this.state.entries === ''){
            rowEntry = csvHeaders;
        }

        cards.forEach((card) => {
              rowEntry += `${card.lastCardNum},${card.fname} ,${card.lname},${card.amount},${card.expDate},${card.counter}\n`
        })

        const cumulativeEntries = this.state.entries + rowEntry;

        this.setState({
            lastCampusID: lastCardNum, 
            entries: cumulativeEntries
        })
    }

    handleSave(){
        const element = document.createElement("a");
        const text = this.state.entries;
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `Atrium Import File ${formatDate(new Date(), 'yyyy-mm-dd')}.csv`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    render(){


        return(
            <div className="container">
                <form onSubmit={this.handleAddEntries}>
                    <div className="form-title">
                        <h1>CSV Generator for Atrium</h1>
                    </div>
                    <div className="level">
                        <label>Last Campus ID:</label>
                        <input 
                            type="text" 
                            name="lastCampusID"
                            value={this.state.lastCampusID}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="level">
                        <label>First Name</label>
                        <select 
                            name="fname" 
                            value={this.state.fname} 
                            onChange={this.handleChange}
                        > 
                            <option value="Gift - ">Gift -</option>
                            <option value="Havest Gift - ">Harvest Gift -</option>
                            <option value="Henry's Gift - ">Henry's Gift - </option>
                            <option value="RClub Gift - ">RClub Gift -</option>
                        </select>

                        <label>Last Name</label>
                        <input 
                            type="text"
                            name="lname"
                            value={this.state.lname}
                            onChange={this.handleChange}
                        />

                        <label>Amount</label>
                        <input 
                            type="number"
                            name="amount"
                            min="0.01"
                            step="0.01"
                            value={this.state.amount}
                            onChange={this.handleChange}
                        />

                        <label>Expiration Date</label>
                        <input 
                            type="date"
                            name="expDate"
                            value={this.state.expDate}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="level">
                        <label>Number of Cards</label>
                        <input 
                            type="number" 
                            name="numOfCards"  
                            value={this.state.numOfCards}  
                            onChange={this.handleChange}
                            min="1"
                        />

                        
                    </div>

                    <div className="level">
                        <button type="submit">Add Entries</button>
                        <button type="reset">Clear Fields</button>
                    </div>

                    <div className="level">
                        <textarea 
                            value={this.state.entries} 
                            readOnly 
                        />
                    </div>

                    <div className="level">
                        <button onClick={this.handleSave}>Save</button>
                    </div>
                    {/* {JSON.stringify(this.state)} */}
                    {/* {this.state.expDate} */}
                </form>
            </div>
        )
    }
}

function App(){
    return(
        <MyForm />
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
