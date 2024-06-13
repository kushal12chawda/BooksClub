const book = Vue.component("book", {
    template: `
    <div> 
    <!-- Modal for balance-->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 250px">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle"><strong>Buy {{bookdata.name}}</strong></h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="font-size: 40px; outline: none">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div v-if="lessbal">
                <div class="modal-body">
                    <h4><strong> OOPS, Low Balance </strong></h4>
                    <h5><strong>Recharge Now !!!</strong></h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" style="background-color: #C39E7E; color: white; box-shadow: none" data-dismiss="modal">Close</button>
                    <router-link to="/my_acc" style="color: white; text-decoration: none"><button type="button" class="btn" style="background-color: #3C2113; color: white; box-shadow: none" data-dismiss="modal">Recharge</button></router-link>
                </div>
            </div>
            <div v-if="okbal">
                <div class="modal-body">
                    <h5 style="font-size: 19px">
                    <p style="margin: 5px 0;"><strong>Author:</strong> {{bookdata.author}}</p>
                    <p style="margin: 5px 0;"><strong>Cost:</strong> {{bookdata.cost}}</p>
                    <p style="margin: 5px 0;"><strong>Category:</strong> {{bookdata.category}}</p>
                    </h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" style="background-color: #C39E7E; color: white; box-shadow: none" data-dismiss="modal">Close</button>
                    <div v-if="okbal"><button type="button"   @click="handleBuyNow"  class="btn" style="background-color: #3C2113; color: white; box-shadow: none">Buy Now</button></div>
                </div>
            </div>
        </div>
    </div>
    </div>


    <!-- Modal for delete -->
    <div class="modal fade" id="exampleModaldel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="margin-left: 250px">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Cancel Request</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            " Would you like to cancel your request for ' {{ book_req_name }} ' ? "
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
            <button type="button" @click="deletereq(book_req_id)" class="btn btn-outline-danger">Delete Request</button>
        </div>
        </div>
    </div>
    </div>


    <!-- Modal Request Button-->
    <div class="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 250px">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="exampleModalLongTitle"><strong>Choose Return Date</strong></h3>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="font-size: 40px; outline: none">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <fieldset class="form-group" style="font-size: 25px">
                    <div class="col-sm-10">
                        <div class="form-check" style="margin-bottom: 15px">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="1" style="margin-top: 12px;  width: 15px; height: 15px;">
                        <label class="form-check-label" for="gridRadios1" style="padding-left: 10px">
                            1 week
                        </label>
                        </div>
                        <div class="form-check" style="margin-bottom: 15px">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="2" style="margin-top: 12px; width: 15px; height: 15px;">
                        <label class="form-check-label" for="gridRadios2" style="padding-left: 10px">
                            2 week
                        </label>
                        </div>
                        <div class="form-check" style="margin-bottom: 15px">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="3" style="margin-top: 12px; width: 15px; height: 15px;">
                        <label class="form-check-label" for="gridRadios3" style="padding-left: 10px">
                            3 week
                        </label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios4" value="4" style="margin-top: 12px; width: 15px; height: 15px;">
                        <label class="form-check-label" for="gridRadios4" style="padding-left: 10px">
                            4 week
                        </label>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn" style="background-color: #C39E7E; color: white; box-shadow: none" data-dismiss="modal">Close</button>
            <button type="button" class="btn" style="background-color: #3C2113; color: white; box-shadow: none" @click="sendRequest">Send Request</button>
        </div>
        </div>
    </div>
    </div>


    <div align="left" style="display: flex; justify-content: space-between; height: 550px ; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px; overflow: auto; scrollbar-width: none;">
        <div align="center" class="book-column" style="margin-top: 35px; flex: 0.5; padding: 20px; border-right: 1px solid #ccc;">
            <div style="margin-top: 30px;width: 250px; height: 300px; border-radius: 10px; background: linear-gradient(to bottom, #43c6ac, #191654); box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
                <div style="display: flex;">
                    <div style="flex: 0.05 ;height: 300px; background-color: white; margin-left: 20px; color: white;">.</div>
                    <h1 style="padding-top: 80px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; padding-left: 20px; color: white">{{bookdata.name}}</h1>
                </div>
                <hr style="width: 250px; height: 5px ;margin-top: -25px ;background-color: white; "></hr>
            </div>
            <br>
            <br>
            <button type="button"  v-if="cancel_req === true" class="btn btn-outline-danger" data-toggle="modal" data-target="#exampleModaldel" style="margin-right: 10px;">Cancel Request</button>
            <button type="button"  v-if="error_mssg === '' && cancel_req !== true " class="btn btn-outline-warning" data-toggle="modal" data-target="#exampleModalCenter1" style="margin-right: 10px;">Request</button>
            <button type="button" v-if="error_mssg !== '' && cancel_req !== true " :disabled="error_mssg !== ''"  :title="error_mssg"   class="btn btn-outline-warning" data-toggle="modal" data-target="#exampleModalCenter1" style="margin-right: 10px;">Request</button>
            <button type="button" v-if="down_pdf === true" class="btn btn-outline-success" data-toggle="modal" data-target="#exampleModalCenter" @click="comparebal(bookdata.cost)">Download PDF</button>
            <button type="button" v-if="down_pdf !== true" :title="down_mssg" disabled  class="btn btn-outline-success" data-toggle="modal" data-target="#exampleModalCenter" @click="comparebal(bookdata.cost)">Download PDF</button>
        </div>
        <div class="description-column" style="flex: 1; padding: 20px; margin-top: 55px;">
            <h1 style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Description</h1>
            <br>
            <p>{{bookdata.description}}</p>
            <div class="book-details" style="margin-top: 20px;">
                <p style="margin: 5px 0;"><strong>Author:</strong> {{bookdata.author}}</p>
                <p style="margin: 5px 0;"><strong>Cost:</strong> {{bookdata.cost}}</p>
                <p style="margin: 5px 0;"><strong>Category:</strong> {{bookdata.category}}</p>
                <p style="margin: 5px 0;"><strong>Copies Left:</strong> {{bookdata.copies}}</p>
            </div>
        </div>
    </div>
    </div>`,

    data() {
        return{
            bookdata: [],
            lessbal: false,
            okbal: false,
            active_user: [],
            newRequest:{
                bookrequest_issue_date: null,
                bookrequest_return_date: null,
                user_fk: null,
                book_fk: null,
                bookrequest_status: "requested",
                book_status: null,
                book_rating: 0
            },    
            book_id: this.$route.params.id,
            error_mssg:"",
            down_mssg:"The PDF can be downloaded once the request is approved by the admin.",
            cancel_req: false,
            book_req_id:-1,
            book_req_name: null,
            down_pdf: false,
            current_user: null
        }
    },

    methods: {
        async getUser() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/user/${this.current_user}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    this.active_user = data;
                } 
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin1');
                        localStorage.removeItem('activeLink1');
                        localStorage.removeItem('userSearchPrevPath');
                        localStorage.removeItem('userSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
                else {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch user: ${response.status} - ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        },
        async isreq() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/isreq/${this.current_user}/${this.book_id}`, {            //<int:id1> for user
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    if(data.message == "error1"){
                        this.error_mssg = "You have reached the maximum limit of pending requests. Please wait for pending requests to be processed before sending more."
                    }
                    else if(data.message == "error2"){
                        this.error_mssg = "This book is already issued, so you cannot make this request."
                    }
                    else if(data.message == "error3"){
                        this.cancel_req = true
                        this.book_req_id = data.id
                        this.book_req_name = data.name
                    }
                    else{
                        this.error_mssg = ""
                    }
                } else {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch user: ${response.status} - ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        },
        async isdown() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/isdown/${this.current_user}/${this.book_id}`, {            //<int:id1> for user-fixed
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    if(data.message == "ok"){
                        this.down_pdf = true
                    }
                } else {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch user: ${response.status} - ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        },
        async deletereq(id) {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/api/bookrequest/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                });
                const data = await response.json();
                if (data.message === "successfully deleted") {
                    this.$router.go();
                } 
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin1');
                        localStorage.removeItem('activeLink1');
                        localStorage.removeItem('userSearchPrevPath');
                        localStorage.removeItem('userSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
                else if (data.message === "BookRequest does not exist.") {
                    this.$router.go();
                    alert("The Request either does not exist or has already been deleted.");
                }
            } catch (error) {
                console.error(error);
            }
        },
        down_load(id){
            fetch(`http://127.0.0.1:5000/costcut/${this.current_user}/${id}`, {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json',  
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to execute costcut operation');
                }
                return response.json();
            })
            .then(data => {
                console.log('Costcut operation successful:', data);
            })
            .catch(error => {
                console.error('Error executing costcut operation:', error);
            });
        },

        comparebal(c){
            if (this.active_user.balance >= c){
                this.lessbal = false
                this.okbal = true
            }
            else{
                this.lessbal = true
                this.okbal = false
            }
        },
        async handleBuyNow() {
            const id = this.bookdata.id; 
                fetch(`/download_pdf/${id}`, { method: 'GET' })
                .then(response => {
                    
                    if (!response.ok) {
                        throw new Error('Failed to download PDF');
                    }
                    
                    return response.blob();
                })
                .then(blobData => {
                    
                    const url = URL.createObjectURL(blobData);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `book_${id}.pdf`; 
                    
                    document.body.appendChild(a);
                    a.click();
                    
                    document.body.removeChild(a);
                    
                    this.down_load(id)

                    this.$router.go();

                })
                .catch(error => {
                    console.error('Error downloading PDF:', error);
                });
        },

        sendRequest() {
            const selectedValue = document.querySelector('input[name="gridRadios"]:checked').value;
            const intValue = parseInt(selectedValue);
            const NDate = this.getCurrentDate();
            try{
                const newDateStr = this.addWeeksToDate(NDate, intValue)
                this.newRequest.bookrequest_return_date = newDateStr
                this.newRequest.book_fk = this.bookdata.id
                
            }
            catch (error) {
             console.error('Error:', error.message);
            }
            this.send_request();
        },

        async send_request() {
            try {
                const token = localStorage.getItem("auth-token");
                this.newRequest.book_fk = this.bookdata.id
                console.log(this.bookdata.id, "this is id")
                const response = await fetch(`http://127.0.0.1:5000/new_bookreq`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(this.newRequest)
                });
                if (response.ok) {
                    const data = await response.json();
                    alert("Request send successfully");
                    this.$router.go();
                } 
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin1');
                        localStorage.removeItem('activeLink1');
                        localStorage.removeItem('userSearchPrevPath');
                        localStorage.removeItem('userSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
                else {
                    throw new Error("Internal Server Error");
                }
            } catch (error) {
                alert("Error while sending Request: " + error.message);
                console.error(error);
            }
        },

        getCurrentDate() {           
            const currentDate = new Date();
        
            const year = currentDate.getFullYear(); 
            const month = currentDate.getMonth() + 1; 
            const day = currentDate.getDate();     
            const PDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
            return PDate;
        },

        addWeeksToDate(inputDateStr, weeksToAdd) {
       
            if (typeof inputDateStr !== 'string') {
                throw new Error('Input date must be a string in YYYY-MM-DD format');
            }
        
            if (typeof weeksToAdd !== 'number' || weeksToAdd <= 0 || !Number.isInteger(weeksToAdd)) {
                throw new Error('Weeks to add must be a positive integer');
            }
     
            const inputDate = new Date(inputDateStr);
        
            if (isNaN(inputDate.getTime())) {
                throw new Error('Invalid input date');
            }
            const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
        

            const millisecondsToAdd = weeksToAdd * millisecondsPerWeek;
        

            const newDate = new Date(inputDate.getTime() + millisecondsToAdd);
        
            const year = newDate.getFullYear();
            const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
            const day = newDate.getDate().toString().padStart(2, '0');
        
            const formattedDate = `${year}-${month}-${day}`;
        
            return formattedDate;
        }   
    },

    beforeMount() {
        const token = localStorage.getItem("auth-token");
        fetch(`http://127.0.0.1:5000/book/${this.$route.params.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
        .then((response) => {
            if (response.ok){
                return response.json();
            }
            else if (response.status === 401 || response.status === 422){
                alert("Access unauthorized. Please log in to continue.");
                setTimeout(() => {
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('firstLogin1');
                    localStorage.removeItem('activeLink1');
                    localStorage.removeItem('userSearchPrevPath');
                    localStorage.removeItem('userSearchQuery');
                    this.$router.push('/');
                    this.$router.go()
                }, 1000);
            }
            else{
                throw new Error(`Failed to fetch book data: ${response.status} ${response.statusText}`);
            }
        })
        .then((data) => {
            this.bookdata = data;
            this.current_user = data.current_user
            this.getUser()
            this.isreq()
            this.isdown()
            this.newRequest.user_fk = this.current_user
        })
        .catch((error) => {
            console.error('Error fetching book data:', error.message);
        });
    },

    mounted(){

    },
});

export default book;