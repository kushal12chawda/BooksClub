const adminsearch = Vue.component("adminsearch", {
    template: `
    <div>
    <div v-if="if_book">
        <div align="left" class="book-search-page">
            <h3 style="padding-top: 20px; padding-left: 40px;">Result(s) for "{{value}}" is</h3>
        </div>
        <div style="display: flex; justify-content: space-between; border-radius: 20px; background-color: #E4D4C8; overflow: hidden;">
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
        <h3 align="left" style="position: fixed; margin-left: 30px; margin-top: 10px">Result(s) for "{{value}}" is</h3>
            <table style="margin-top: 60px">
                <tr v-for="(row, index) in cat_obj" :key="index" >
                    <td v-for="(value, key) in row.book" :key="key" style="padding: 10px; padding-left: 20px;">
                        <div style="position: relative;">
                            <div class="book-column" style="padding: 20px; color: #3C2113;">
                                <div style="width: 300px; height: 320px; padding: 20px; border-radius: 10px; background-color: #D0B49F; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
                                    <div style="display: flex; justify-content: center;"><h4><strong>{{value[1]}}</strong></h4></div>
                                    <br>
                                    <div style="display: flex;">
                                        <div style="flex: 1;"><b>Author:</b> {{value[2]}}</div>
                                        <div style="flex: 1; text-align: right;"><b>Cost:</b> Rs {{value[5]}}</div>
                                    </div>
                                    <div style="display: flex;margin-top:5px">
                                        <div style="flex: 1;"><b>No.of Copies:</b> {{value[3]}}</div>
                                        <div style="flex: 1; text-align: right;"><a :href="'/view_pdf/' + value[0] " style="color: #3C2113"><u>View PDF</u></a></div>
                                    </div>
                                    <hr style="background-color: #523A28">
                                    <div style="height: 150px; overflow-y: auto; scrollbar-width: none;">
                                        {{value[4]}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>  
                </tr>
            </table>     
        </div>
    </div>
        
    <div v-if="if_author">
        <div align="left" style="height: 576px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none">
        <h3 align="left" style="position: fixed; margin-left: 30px; margin-top: 10px">Result(s) for "{{value}}" is</h3>
            <table style="margin-top: 60px">
                <tr>
                    <td v-for="(row, index) in auth_obj" style="padding: 30px; padding-left: 50px">
                        <div style="position: relative;">
                            <div class="book-column" style="padding: 20px; color: #3C2113;">
                                <div style="width: 300px; height: 320px; padding: 20px; border-radius: 10px; background-color: #D0B49F; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
                                    <div style="display: flex; justify-content: center;"><h4><strong>{{ row.name }}</strong></h4></div>
                                    <br>
                                    <div style="display: flex;">
                                        <div style="flex: 1;"><b>Author:</b> {{ row.author }}</div>
                                        <div style="flex: 1; text-align: right;"><b>Cost:</b> Rs {{ row.cost }}</div>
                                    </div>
                                    <div style="display: flex;margin-top:5px">
                                        <div style="flex: 1;"><b>No.of Copies:</b> {{ row.copies }}</div>
                                        <div style="flex: 1; text-align: right;"><a :href="'/view_pdf/' + row.id " style="color: #3C2113"><u>View PDF</u></a></div>
                                    </div>
                                    <hr style="background-color: #523A28">
                                    <div style="height: 150px; overflow-y: auto; scrollbar-width: none;">
                                        {{ row.description }}
                                    </div>
                                </div>
                            </div>
                        </div>
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
            booksPerPage: 5,
            search_type: "",
            checklist: [],
            book_obj: {},
            cat_obj: [],
            auth_obj: [],
            image_path_1: "/static/new2.png.jpeg",
        }
    },
    methods:{
        async searchfunc() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/search/${this.value}`, {
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
                } else if (response.status === 401 || response.status === 422) {
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
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }            
        }

    },
    computed: {
        cat_bookRows() {
            const rows = [];
            for (let i = 0; i < this.cat_obj.length; i += this.booksPerPage) {
                rows.push(this.cat_obj.slice(i, i + this.booksPerPage));
            }
            return rows;
        },
        auth_bookRows() {
            const rows = [];
            for (let i = 0; i < this.auth_books.length; i += this.booksPerPage) {
                rows.push(this.auth_books.slice(i, i + this.booksPerPage));
            }
            return rows;
        },
        if_book(){
            return this.search_type === "book";
        },
        if_category(){
            return this.search_type === "category";
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


    beforeRouteUpdate(to, from, next) {
        this.value = to.params.name;

        this.searchfunc();

        next();
    },

});

export default adminsearch;