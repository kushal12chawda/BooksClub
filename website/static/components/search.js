const search = Vue.component("search", {
    template: `
    <div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h3 class="modal-title" id="exampleModalLongTitle"><strong>Buy {{book_obj.name}}</strong></h3>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="font-size: 40px; outline: none">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p style="margin: 5px 0;"><strong>Author:</strong> {{book_obj.author}}</p>
            <p style="margin: 5px 0;"><strong>Cost:</strong> {{book_obj.cost}}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> {{book_obj.category}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn" style="background-color: #C39E7E; color: white; box-shadow: none" data-dismiss="modal">Close</button>
            <div v-if="lessbal"><button type="button" class="btn" style="background-color: #3C2113; color: white; box-shadow: none" disabled>Buy Now</button></div>
            <div v-if="okbal"><button type="button" class="btn" style="background-color: #3C2113; color: white; box-shadow: none">Buy Now</button></div>
        </div>
        </div>
        
    </div>
    </div>


    <div v-if="if_book">
        <div align="left" class="book-search-page">
            <h3 style="padding-top: 20px; padding-left: 40px;">Result(s) for "{{value}}" is</h3>
        </div>
        <div style="display: flex; justify-content: space-between; border-radius: 20px; overflow: hidden;">
            <div style="flex: 0.5; padding: 20px; border-right: 1px dotted black;">
                <div style="margin-top: 20px; width: 250px; height: 320px; margin-right: 20px; overflow: hidden; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
                    <img :src="image_path_1" alt="Book Cover" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <br>
                <h1 style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; color: #3C2113; margin-top: 10px;">{{book_obj.name}}</h1>
            </div>
            <div style="flex: 1; padding: 20px; margin-top: 20px;">
                <h1 style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; margin-bottom: 15px;">Description</h1>
                <p>{{book_obj.description}}</p>
                <div style="margin-top: 30px;">
                    <p style="margin: 8px 0;font-size:20px"><strong>Author:</strong>&nbsp {{book_obj.author}}</p>
                    <p style="margin: 8px 0;font-size:20px"><strong>Cost:</strong>&nbsp {{book_obj.cost}}</p>
                    <p style="margin: 8px 0;font-size:20px"><strong>Category:</strong>&nbsp {{book_obj.category}}</p>
                    <p style="margin: 8px 0;font-size:20px"><strong>Copies Left:</strong>&nbsp {{book_obj.copies}}</p>
                </div>
            </div>
        </div>
    </div>
    
    <div v-if="if_category">    
        <div align="left" style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none">
        <h3 style=" padding: 20px; padding-left: 40px;">Result(s) for "{{value}}" is</h3>
            <table>
                <th colspan="5" style="padding-left: 40px; padding-top: 20px; font-size: 30px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">{{cat_obj[0].name}}</th>
                <tr v-for="(row, index) in cat_obj" :key="index">
                    <td v-for="(value, key) in row.book" :key="key" style="padding: 30px; padding-left: 50px">
                        <router-link :to=/book/+value[0]>
                            <div style="position: relative;">
                                <div style="position: absolute; top:0; left:0; z-index: 9;height: 150px; width: 130px; background: linear-gradient(to bottom, #43c6ac, #191654); text-align: center; padding-top: 60px; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;">
                                    <h4><p style="color: white; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; text-decoration: none; text-decoration-skip-ink: none;">{{ value[1] }}</p></h4>
                                </div>
                                <div style="position: relative; top: 8px; left: 8px; height: 150px; width: 130px; background-color: #24243e; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px"></div>
                            </div>
                        </router-link>
                    </td>  
                </tr>
            </table>     
        </div>
    </div>
        
    <div v-if="if_author">
        <div align="left" style="height: 576px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none">
        <h3 style="padding: 20px; padding-left: 40px">Result(s) for "{{value}}" is</h3>
            <table>
                <th colspan="5" style="padding-left: 40px; padding-top: 20px; font-size: 30px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">{{auth_obj[0].author}}</th>
                <tr>
                    <td v-for="(row, index) in auth_obj" style="padding: 30px; padding-left: 50px">
                        <router-link :to=/book/+row.id>
                        <div style="position: relative;">
                            <div style="position: absolute; top:0; left:0; z-index: 9;height: 150px; width: 130px; background: linear-gradient(to bottom, #43c6ac, #191654); text-align: center; padding-top: 60px; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;">
                                <h4><p style="color: white; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; text-decoration: none; text-decoration-skip-ink: none;">{{ row.name }}</p></h4>
                            </div>
                            <div style="position: relative; top: 8px; left: 8px; height: 150px; width: 130px; background-color: #24243e; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px"></div>
                        </div>
                        </router-link>
                    </td>  
                </tr>
            </table>
        </div>
    </div>

    <div v-if="if_none">
        <div align="left" style="height: 576px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none;">
        <h3 align="center" style="margin-top: 200px; color: #757575;"> No search results found for "{{value}}" </h3>
            
        </div>
    </div>
    </div>
    `,

    data() {
        return{
            value: this.$route.params.name,
            booksPerPage: 5,   //nw
            search_type: "",
            checklist: [],
            book_obj: {},
            cat_obj: [],
            auth_obj: [],
            active_user: [],
            lessbal: false,
            okbal: false,
            info:null,
            image_path_1: "/static/new2.png.jpeg",
        }
    },
    methods:{
        async searchfunc() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000//search/${this.value}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                });
        
                if (response.status === 200) {
                    const data = await response.json();
        
                    this.checklist = data;
        
                    if (this.checklist[0].check === "book") {

                        this.search_type = "book";
                        this.book_obj = this.checklist[0];

                    } else if (this.checklist[0].check === "category") {
                        this.search_type = "category";
                        this.cat_obj = this.checklist;

                    } else if (this.checklist[0].check === "author") {

                        this.search_type = "author";
                        this.auth_obj = this.checklist;

                    } else if (this.checklist[0].message === "not found") {

                        this.search_type = "none";

                    }
                } 
                else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        },
        async getUser() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch("http://127.0.0.1:5000/user/1", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    }
                });
        
                if (response.status === 200) {
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
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
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
        }

    },
    computed: {
        cat_bookRows() {
            const rows = [];
            for (let i = 0; i < this.cat_obj.length; i += this.booksPerPage) {   //nw
                rows.push(this.cat_obj.slice(i, i + this.booksPerPage));
            }
            return rows;
        },
        auth_bookRows() {
            const rows = [];
            for (let i = 0; i < this.auth_books.length; i += this.booksPerPage) {   //nw
                rows.push(this.auth_books.slice(i, i + this.booksPerPage));
            }
            return rows;
        },
        if_book(){
            return this.search_type === "book";
        },
        if_category(){
            return this.search_type == "category";
        },
        if_author(){
            return this.search_type === "author";
        },
        if_none(){
            return this.search_type === "none";
        },
    },
    created() {
        this.searchfunc();
    },

    mounted(){
        this.getUser()
    },

    beforeRouteUpdate(to, from, next) {

        this.value = to.params.name;

        this.searchfunc();

        next();
    },

});

export default search;