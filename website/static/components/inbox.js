const inbox = Vue.component("inbox", {
    template: `
    <div>
        <!-- Modal Delete Book Req-->
        <div class="modal fade" v-for="(item) in pending_list" :id="'exampleModalCenter2' + item.id" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="margin-left: 220px">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel" style><strong>Confirm Reject </h5> &nbsp&nbsp <i class='bx bx-trash' style='font-size: 27px;padding-top:-1px' ></i></strong>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to reject request for &nbsp<span style="font-size: 20px"><b>{{item.book_name}}</b></span> by  <span style="font-size: 20px"><b>{{item.user_name}}</b></span>?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-info" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-danger" @click="reject(item.id)" >Reject</button>
            </div>
            </div>
        </div>
        </div>

    <div style="height: 560px ; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px; overflow: auto; text-decoration: none; padding: 20px; scrollbar-width: none; color: #3C2113"> 
    <div align="left" style="position: fixed; width: 1190px;">
        <div>
            <button @click="pending = true; accepted = false" class="btn" :style="{backgroundColor: pending === true ? '#3C2113' : '#E4D4C8', outline: 'none', fontSize: pending === true ? '25px' : '20px', color: pending === true ? 'white' : '#3C2113', fontWeight: pending === true ? 'bolder' : 'lighter', borderRadius: '30px', boxShadow: pending === true ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : 'none',}"> Pending </button>
            <button @click="pending = false; accepted = true" class="btn" :style="{backgroundColor: accepted === true ? '#3C2113' : '#E4D4C8', outline: 'none', fontSize: accepted === true ? '25px' : '20px', color: accepted === true ? 'white' : '#3C2113', fontWeight: accepted === true ? 'bolder' : 'lighter', borderRadius: '30px', boxShadow: accepted === true ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : 'none'}"> Accepted </button>
        </div>
    </div>

    <div v-if="pending" style="padding-top: 100px;">
        <div v-if="pending_list.length !== 0">
        <table>
        <tr>
            <td style="padding: 20px;" v-for="(i) in pending_list">
                <div style="height: auto; width: 350px; padding: 20px; border-radius: 10px; background-color: #D0B49F; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px">
                    <div style="display: flex;"> 
                        <h3 style="flex: 1">{{i.book_name}}</h3>
                        <h5 align="right" style="flex: 1; margin-left: -40px; margin-top: 5px;">&nbsp&nbsp&nbsp&nbsp&nbsp{{i.category_name}}</h5>
                    </div>
                    <hr>
                    <div align="left">
                        <strong>Requested by: </strong>{{i.user_name}}
                        <br>
                        <strong>Return date: </strong>{{i.return_date.slice(0,17)}}
                        <form style="margin-top: 25px;">
                            <button class="btn" @click="issue(i.id)" style="background-color: #3C2113; color: white; box-shadow: none"> Accept </button>
                            <button type="button" class="btn" @click="openDeleteModal(i)" style="background-color: #3C2113; color: white; box-shadow: none">Reject</button>
                        </form>
                    </div>
                </div>
            </td>
        </tr>
        </table>
        </div>
        <div v-if="pending_list.length === 0" style="display: flex; justify-content: center; align-items: center;margin-top:110px">
            <h2 style="color: grey;">No pending requests</h2>
        </div>
    </div>

    <div v-if="accepted" style="padding-top: 100px;">
        <table>
        <tr>
            <td style="padding: 20px;" v-for="(i) in accepted_list">
                <div style="height: auto; width: 350px; padding: 20px; border-radius: 10px; background-color: #D0B49F; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px">
                    <div style="display: flex;"> 
                        <h3 style="flex: 1">{{i.book_name}}</h3>
                        <h5 align="right" style="flex: 1; margin-left: -40px; margin-top: 5px; margin-left: 5px">{{i.category_name}}</h5>
                    </div>
                    <hr>
                    <br>
                    <div align="left">
                        <strong>Issued to: </strong>{{i.user_name}}
                        <br>
                        <strong>Issue date: </strong>{{i.issue_date.slice(0,17)}}
                        <br>
                        <strong>Return date: </strong>{{i.return_date.slice(0,17)}}
                    </div>
                    <br>
                </div>
            </td>
        </tr>
        </table>
    </div>

    </div>
    </div>`,

    data(){
        return{
            pending: true,
            accepted: false,
            pending_list: [],
            change_data: {
                bookrequest_status: 'issued', 
                book_status: 'current',
                bookrequest_issue_date: null,
            },
            rejected_data: {
                bookrequest_status: 'rejected', 
                book_status: null,
                bookrequest_issue_date: null,
            },
            accepted_list: [],
        }
    },

    methods:{
        getPendingReq(){
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/inbox_req`,{
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    "Authorization": "Bearer " + token
                },
            })
            .then(response =>{
                if(response.status===200){
                    return response.json();
                }
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin');
                        localStorage.removeItem('activeLink');
                        localStorage.removeItem('adminSearchPrevPath');
                        localStorage.removeItem('adminSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
            })
            .then(data =>{
                this.deatils_list = data
                for(let i=0; i<this.deatils_list.length; i++){
                    if(this.deatils_list[i].bookreq_status === "requested"){
                        this.pending_list.push(this.deatils_list[i])
                    }
                }
            })
        },

        getAcceptedReq(){
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/inbox_req`,{
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    "Authorization": "Bearer " + token
                },
            })
            .then(response =>{
                if(response.status===200){
                    return response.json();
                }
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin');
                        localStorage.removeItem('activeLink');
                        localStorage.removeItem('adminSearchPrevPath');
                        localStorage.removeItem('adminSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
            })
            .then(data =>{
                this.deatils_list1 = data
                for(let i=0; i<this.deatils_list1.length; i++){
                    if(this.deatils_list1[i].bookreq_status !== "rejected" && this.deatils_list1[i].bookreq_status !== "requested"){
                        this.accepted_list.push(this.deatils_list1[i])
                    }
                }
            })
        },

        issue(i){
            const CurrDate = this.getCurrentDate();
            this.change_data.bookrequest_issue_date = CurrDate;
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/api/bookrequest/${i}`,{
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    "Authorization": "Bearer " + token
                },
                body:JSON.stringify(this.change_data)
            })
            .then(response =>{
                if(response.status===200){
                    return response.json();
                }
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin');
                        localStorage.removeItem('activeLink');
                        localStorage.removeItem('adminSearchPrevPath');
                        localStorage.removeItem('adminSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
            })
            .then(data=>{
            this.$router.go();
            })
            // this.$router.go();
        },

        getCurrentDate() {           

            
            const currentDate = new Date();
        
            
            const year = currentDate.getFullYear(); 
            const month = currentDate.getMonth() + 1; 
            const day = currentDate.getDate(); 
        
            // Construct the current date string in the format "YYYY-MM-DD"
            const ADate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
            return ADate;
        },

        openDeleteModal(bookreq) {
            $('#exampleModalCenter2' + bookreq.id).modal('show');
        },

        reject(i){
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/api/bookrequest/${i}`,{
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    "Authorization": "Bearer " + token
                },
                body:JSON.stringify(this.rejected_data)
            })
            .then(response =>{
                if(response.status===200){
                    return response.json();
                }
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin');
                        localStorage.removeItem('activeLink');
                        localStorage.removeItem('adminSearchPrevPath');
                        localStorage.removeItem('adminSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
            })
            .then(data=>{
                console.log(data)
            })
            this.$router.go();
        },

    },


    mounted(){
        this.getPendingReq()
        this.getAcceptedReq()
    },
});

export default inbox;