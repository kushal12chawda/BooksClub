const my_acc = Vue.component("my_acc", {
    template: `
    <div> 
        <!-- Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 250px">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle"><strong>Add Money to Wallet</strong></h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="font-size: 40px; outline: none">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form @submit.prevent="userbalance">
                <div class="modal-body" align="left">
                    <br>
                    <h5>Available Balance: {{active_user.balance}} Rs</h5>
                    <p>
                    <div class="form-group" style="display: flex">
                        <label for="balance" style="flex: 1;"><h5>Enter Amount: </h5></label>
                        <input v-model="balan"  type="number" class="form-control" id="balance" style="flex: 1;height: 30px;padding: 15px;margin-right:150px;">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" data-dismiss="modal" style="background-color: #C39E7E; color: white; box-shadow: none">Close</button>
                    <button type="submit" class="btn" @click="closeModal" style="background-color: #3C2113; color: white; box-shadow: none">Submit</button>
                </div>
            </form>
            </div>
        </div>
        </div>

        <div align="left" style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none; padding: 0px 20px 20px 20px;">
            <div style="position: fixed; width: 1190px; display: flex; background-color: #F9F1F0; z-index: 1">
                <div style="flex:3">
                    <button @click="showCurrent = true; showCompleted = false" class="btn btn-ouline" :style="{backgroundColor: showCurrent === true ? '#5A213C' : '#F9F1F0', outline: 'none', fontSize: showCurrent === true ? '25px' : '20px', color: showCurrent === true ? 'white' : '#5A213C', fontWeight: showCurrent === true ? 'bolder' : 'lighter', borderRadius: '30px', boxShadow: showCurrent === true ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : 'none',}"> Current </button>
                    <button @click="showCurrent = false; showCompleted = true" class="btn" :style="{backgroundColor: showCompleted === true ? '#5A213C' : '#F9F1F0', outline: 'none', fontSize: showCompleted === true ? '25px' : '20px', color: showCompleted === true ? 'white' : '#5A213C', fontWeight: showCompleted === true ? 'bolder' : 'lighter', borderRadius: '30px', boxShadow: showCompleted === true ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : 'none'}"> Completed </button>
                </div>
                <div style="flex:1">
                    <h6 style="padding-top: 10px; font-size: 19px"><strong>Avail Bal:</strong> Rs {{active_user.balance}}
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-outline btn-custom" data-toggle="modal" data-target="#exampleModalCenter" style="margin-left: 20px; color: #5A213C; border-color: #5A213C; background-color: white; font-size: 20px; box-shadow: none"> Recharge</button></h6>
                </div>
            </div>
            <br>
            <div v-if="showCurrent" style="padding: 20px; width: 600px; margin-left: 280px;">

                <div v-if="rejected_req.length > 0" class="alert alert-warning alert-dismissible fade show" role="alert" style="z-index: 1">
                    Your request for 
                    <span v-for="(i) in rejected_req"><strong>{{i.book_name}} </strong></span> was rejected by admin
                    <button @click="dismissAlert(rejected_req)" type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <ul v-for="i in current">
                    <li style="height: 170px; display: flex;">
                        <router-link :to=/book/+i.book>
                            <div style="position: relative; z-index: 0; margin-top: 20px">
                                <div style="position: absolute; top:0; left:0; z-index: 9;height: 150px; width: 130px;  background: linear-gradient(to bottom, #43c6ac, #191654); text-align: center; padding-top: 60px; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;">
                                    <h4><p style="color: white; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; text-decoration: none; text-decoration-skip-ink: none;">{{ i.book_name }}</p></h4>
                                </div>
                                <div style="position: relative; top: 8px; left: 8px; height: 150px; width: 130px; background-color: #24243e; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px"></div>
                            </div>
                        </router-link>
                        <div style="flex: 1; margin-left: 80px; margin-top: 20px"> 
                            <p style="margin: 5px 0;"><strong>Return Date:</strong> {{i.return_date.slice(0, 17)}}</p>
                            <p style="margin: 5px 0;"><strong>Category:</strong> {{i.category_name}} </p>
                            <div class="rating" style="unicode-bidi: bidi-override; direction: rtl;">
                                <input type="radio" :id="'star5_' + i.id" name="rating" value="5" style="display: none;" />
                                <label :for="'star5_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 5)" :style="{ color: i.book_rating >= 5 ? 'gold' : 'black' }">&#9733;</label>
                                <input type="radio" :id="'star4_' + i.id" name="rating" value="4" style="display: none;" />
                                <label :for="'star4_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 4)" :style="{ color: i.book_rating >= 4 ? 'gold' : 'black' }">&#9733;</label>
                                <input type="radio" :id="'star3_' + i.id" name="rating" value="3" style="display: none;" />
                                <label :for="'star3_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 3)" :style="{ color: i.book_rating >= 3 ? 'gold' : 'black' }">&#9733;</label>
                                <input type="radio" :id="'star2_' + i.id" name="rating" value="2" style="display: none;" />
                                <label :for="'star2_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 2)" :style="{ color: i.book_rating >= 2 ? 'gold' : 'black' }">&#9733;</label>
                                <input type="radio" :id="'star1_' + i.id" name="rating" value="1" style="display: none;" />
                                <label :for="'star1_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 1)" :style="{ color: i.book_rating >= 1 ? 'gold' : 'black' }">&#9733;</label>
                            </div>
                            <form>
                                <button type="submit" :formaction="/view_pdf/+i.book" formmethod="GET" class="btn" style="background: linear-gradient(to bottom, #134e5e, #71b280); color: white; box-shadow: none"> View </button>
                                <button class="btn" @click="change(i.id,'Return')" style="background: linear-gradient(to bottom, #134e5e, #71b280); color: white; box-shadow: none"> Return </button>
                                <button class="btn" @click="change(i.id,'Completed')" style="background: linear-gradient(to bottom, #134e5e, #71b280); color: white; box-shadow: none"> Completed </button>
                            </form>
                        </div>
                    </li>
                </ul>
            </div>

            <div v-if="showCompleted" style="padding: 20px; width: 600px; margin-left: 280px">
                <ul v-for="i in completed">
                    <li style="height: 170px; display: flex;">
                        <router-link :to=/book/+i.book>
                        <div style="position: relative; z-index: 0; margin-top: 20px">
                            <div style="position: absolute; top:0; left:0; z-index: 9;height: 150px; width: 130px;  background: linear-gradient(to bottom, #43c6ac, #191654); text-align: center; padding-top: 60px; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;">
                                <h4><p style="color: white; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; text-decoration: none; text-decoration-skip-ink: none;">{{ i.book_name }}</p></h4>
                            </div>
                            <div style="position: relative; top: 8px; left: 8px; height: 150px; width: 130px; background-color: #24243e; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px"></div>
                        </div>
                        </router-link>
                        <div style="flex: 1; margin-left: 80px; margin-top: 20px"> 
                            <p style="margin: 5px 0;"><strong>Return Date:</strong> {{i.return_date.slice(0,17)}}</p>
                            <p style="margin: 5px 0;"><strong>Category:</strong> {{i.category_name}}</p>
                            <div class="rating" style="unicode-bidi: bidi-override; direction: rtl;">
                                <input type="radio" :id="'star5_' + i.id" name="rating" value="5" style="display: none;" />
                                <label :for="'star5_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 5)" :style="{ color: i.book_rating >= 5 ? 'gold' : 'black' }">&#9733;</label>
                                <input type="radio" :id="'star4_' + i.id" name="rating" value="4" style="display: none;" />
                                <label :for="'star4_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 4)" :style="{ color: i.book_rating >= 4 ? 'gold' : 'black' }">&#9733;</label>
                                <input type="radio" :id="'star3_' + i.id" name="rating" value="3" style="display: none;" />
                                <label :for="'star3_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 3)" :style="{ color: i.book_rating >= 3 ? 'gold' : 'black' }">&#9733;</label>
                                <input type="radio" :id="'star2_' + i.id" name="rating" value="2" style="display: none;" />
                                <label :for="'star2_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 2)" :style="{ color: i.book_rating >= 2 ? 'gold' : 'black' }">&#9733;</label>
                                <input type="radio" :id="'star1_' + i.id" name="rating" value="1" style="display: none;" />
                                <label :for="'star1_' + i.id" style="display: inline-block; padding: 0 1px; font-size: 25px; cursor: pointer;" @click="setRating(i.id, 1)" :style="{ color: i.book_rating >= 1 ? 'gold' : 'black' }">&#9733;</label>
                            </div>
                            <form><button class="btn" @click="change(i.id,'Return')" style="background: linear-gradient(to bottom, #134e5e, #71b280); color: white; box-shadow: none"> Return </button>
                            <button type="submit" :formaction="/view_pdf/+i.book" formmethod="GET" class="btn" style="background: linear-gradient(to bottom, #134e5e, #71b280); color: white; box-shadow: none"> View </button></form>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>`,

    data(){
        return{
            showCurrent: true,
            showCompleted: false,
            current: [],
            completed: [],
            deatils_list: [],
            change_data: {
                book_status: 'completed', 
            },
            return_data: {
                bookrequest_status: 'returned', 
                book_status: 'completed', 
            },
            id: 3,
            active_user: [],
            balan:0,
            rejected_req: [],
            current_user: null,
            active_user: []
        }
    },

    methods: {
        details() {
            console.log("details called")
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/api/myacc/${this.current_user}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401 || response.status === 422) {
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin1');
                        localStorage.removeItem('activeLink1');
                        localStorage.removeItem('userSearchPrevPath');
                        localStorage.removeItem('userSearchQuery');
                        this.$router.push('/');
                        this.$router.go();
                    }, 1000);
                    throw new Error('Access unauthorized');
                } else {
                    throw new Error('Failed to fetch details');
                }
            })
            .then(data => {
                this.details_list = data;
                console.log(this.details_list, "data list");
                this.current = []
                this.completed = []
        
                for (let i = 0; i < this.details_list.length; i++) {
                    if (this.details_list[i].book_status === 'current' && !this.current.includes(this.details_list[i])) {
                        this.current.push(this.details_list[i]);
                    } else if (this.details_list[i].book_status === 'completed' && !this.completed.includes(this.details_list[i])) {
                        this.completed.push(this.details_list[i]);
                    }
                }
                console.log(this.completed, "comp5")
            })
            // .catch(error => {
            //     console.error('Error fetching details:', error.message);
            //     alert("Error in fetching details");
            // });
        },

        change(i, s) {
            const token = localStorage.getItem("auth-token");
            let url = `http://127.0.0.1:5000/api/bookrequest/${i}`;
            let requestData = {};
        
            if (s === 'Completed') {
                requestData = this.change_data;
            } else if (s === 'Return') {
                requestData = this.return_data;
            }
            console.log(this.current, "comp00")
        
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                if (response.status === 200) {
                    // Update was successful, now call details() to fetch updated data
                    console.log(this.completed, "comp0")
                    console.log(this.completed, "comp1")
                    // window.location.reload();
                    // this.$router.go()
                    // this.$router.go()
                    console.log(this.completed, "comp2")
                    // return response.json();
                    return this.details();
                } else if (response.status === 401 || response.status === 422) {
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin1');
                        localStorage.removeItem('activeLink1');
                        localStorage.removeItem('userSearchPrevPath');
                        localStorage.removeItem('userSearchQuery');
                        this.$router.push('/');
                        this.$router.go();
                    }, 1000);
                    throw new Error('Access unauthorized');
                } else {
                    throw new Error('Failed to update book request');
                }
            })
            .then(data => {
                console.log(this.completed, "comp2")
            })
            // .catch(error => {
            //     console.error('Error updating book request:', error.message);
            //     alert("Error in updating book request, please check console");
            // });
        },

        async rating(i, obj2) {
            try {
                const token = localStorage.getItem("auth-token");
                const url = `http://127.0.0.1:5000/api/bookrequest/${i}`;
        
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(obj2)
                });
        
                if (response.status === 200) {
                    const data = await response.json();
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
                    throw new Error('Failed to update book request');
                }
            } catch (error) {
                console.error('Error updating book request:', error.message);
                alert("Failed to update book request,please check console")
            }
        },

        completed_func(i){
            console.log(i)
            this.current = this.current.filter(j => j !== i)
            this.completed.push(i)
        }, 

        setRating(bookId, rating) {
            const book = this.current.find(book => book.id === bookId);
            if (book) {
                book.book_rating = rating;
                let obj={
                    book_rating: rating
                }
                this.rating(bookId,obj)

            } else {
                const completedBook = this.completed.find(book => book.id === bookId);
                if (completedBook) {
                    completedBook.book_rating = rating;
                    let obj={
                        book_rating: rating
                    }
                    this.rating(bookId,obj)
                    
                }     
            }    
        },

        async getUser() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/userrr`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    this.active_user = data;
                    this.current_user = data.current_user;
                    console.log("getUser is running first");
                    console.log(this.active_user, "activeUser");
                    console.log(this.current_user, "currentUser");
                } else if (response.status === 401 || response.status === 422) {
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        this.$router.push('/');
                        this.$router.go();
                    }, 1000);
                } else {
                    throw new Error(`Failed to fetch user: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching user:', error.message);
                alert("Error fetching user");
            }
        },
        

        userbalance(){
            const user = {
                "user_name":this.active_user.name,
                "user_email":this.active_user.email,
                "user_role":this.active_user.role,
                "user_password":this.active_user.password,
                "user_balance":parseInt(this.active_user.balance)+parseInt(this.balan),

            }
            try {
                const token = localStorage.getItem("auth-token");
                const response = fetch(`http://127.0.0.1:5000/api/user/${this.current_user}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(user)
                });
        
                if (response.status === 200) {
                    const data = response.json();
                    console.log(data); 
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
                    throw new Error('Failed to update user');
                }
            } catch (error) {
                console.error('Error updating user:', error.message);
            }
        },

        closeModal(){
            this.userbalance();
            $('#exampleModalCenter').modal('hide');
            this.$router.go();
        },

        deleteBookReq(id) {
            try {
                const token = localStorage.getItem("auth-token");
                const url = `http://127.0.0.1:5000/api/bookrequest/${id}`;
                const response = fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                });
        
                const data = response.json();
        
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
                    alert("The book request either does not exist or has already been deleted.");
                }
            } catch (error) {
                console.error('Error deleting book request:', error.message);
                alert("Error deleting book request")
            }
        },

        getRejectedBooks() {
            const url = `http://127.0.0.1:5000/rejected_req/${this.current_user}`;
        
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch rejected books');
                }
            })
            .then(data => {
                this.rejected_req = data;
                // console.log(this.rejected_req, "rejected request");
            })
            .catch(error => {
                console.error('Error fetching rejected books:', error.message);
                alert("Error fetching rejected books")
            });
        },
        
        dismissAlert(id_list) {
            id_list.forEach(item => {
                this.deleteBookReq(item.id)
            });
        },
    },

    async mounted() {
        try {
            await this.getUser();
            // await console.log(this.current_user, "value of current user");
            await this.details();
            await this.getRejectedBooks();
            // await this.getCompletedCurrent()
        } catch (error) {
            console.error('Error in mounted:', error.message);
        }
    }
    
});

export default my_acc;