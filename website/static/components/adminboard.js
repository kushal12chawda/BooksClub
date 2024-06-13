import admin_sidebar from "./admin_sidebar.js";
import adminsearchbox from "./adminsearchbox.js";

const adminboard = Vue.component("adminboard", {
    template: `
    <div>
    <div style="display: flex; height: 100vh;background-color: #523A28; border-radius: 50px; font-family: MS Sans Serif">
        <admin_sidebar></admin_sidebar>
        <div class= "main-box" style="float: right; height: 92vh; background-color: #E4D4C8; width: 1230px; margin-top: 30px; border-radius: 50px; box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;">
            <adminsearchbox></adminsearchbox>
            <div align="center" class="content-box">
                <router-view></router-view>
            </div>
            <div v-if="isURL">
                <div style="height: 560px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px; overflow: auto; text-decoration: none; padding: 20px; padding-top: 0; scrollbar-width: none; color: #3C2113;">
                    <div style="width: 1200px; padding: 10px; position: fixed; background-color: #E4D4C8">
                        <h3 style="float: left; margin-left: 20px"><b>Book Status Overview</b></h3>
                        <button class="btn" @click="downloadResource" style=" float: right; margin-right: 20px; color: whitesmoke; background-color: #3C2113; font-size: 20px; box-shadow: none">Download Resource</button>
                    </div>
                    <p v-if="isDownloading" style=" float: right; margin-right: 20px; font-size: 20px; margin-top: 60px"> Downloading... </p>

                    <div style="margin-top: 80px;">
                        <div v-for="(i) in bookdata" :key="i.book_name" style="margin-bottom: 30px; margin-left: 250px">
                            <div style="display: flex; width: 70%; padding: 10px; border-radius: 10px; background-color: #D0B49F; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
                                <div style="flex: 1.3; padding: 8px; margin-top: 10px">
                                    <h3 style="padding-left: 20px"><b>{{i.book_name}}</b></h3>
                                    <h5 style="padding-left: 20px">{{i.category_name}}</h5>
                                </div>
                                <div style="flex: 1; padding: 5px">

                                    <div v-if="i.requested.length == 0 && i.issued.length == 0" style="margin-top: 35px;">
                                        No requests made yet
                                    </div>

                                    <div v-if="i.requested.length != 0 && i.issued.length == 0" style="margin-top: 30px; display: flex; flex-wrap: wrap">
                                        <h5 style="margin-bottom: 5px; margin-right: 10px;">Requested by:</h5>
                                        <span style="display: flex; align-items: center;">
                                            {{ i.requested.join(', ') }}
                                        </span>
                                    </div>

                                    <div v-if="i.requested.length == 0 && i.issued.length != 0" style="margin-top: 30px; display: flex; flex-wrap: wrap;">
                                        <h5 style="margin-bottom: 5px; margin-right: 10px;">Issued to:</h5>
                                        <span style="display: flex; align-items: center;">
                                            {{ i.issued.join(', ') }}
                                        </span>
                                    </div>

                                    <div v-if="i.requested.length != 0 && i.issued.length != 0" style="margin-top: 15px; display: flex; flex-wrap: wrap">
                                        <h5 style="margin-bottom: 5px; margin-right: 10px;">Requested by:</h5>
                                        <span style="display: flex; align-items: center;">
                                            {{ i.requested.join(', ') }}
                                        </span>
                                        <br>
                                        <h5 style="margin-bottom: 5px; margin-right: 10px;">Issued to:</h5>
                                        <span style="display: flex; align-items: center;">
                                            {{ i.issued.join(', ') }}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    </div>`,

    data(){
        return{
            search_item: "",
            bookdata: [],
            logoutTimer: null,
            isDownloading: false
        }
    },

    methods: {
        async getData() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/admin_home`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    this.bookdata = data;
                    console.log(this.bookdata);
                }
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    // Redirect to login page after 5 seconds
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
                else{
                    throw new Error('Failed to fetch book data');
                }
            } catch (error) {
                console.error('Error fetching book data:', error);
                alert("Something Went Wrong , Please Try Again")
            }
        },

        async downloadResource(){
            this.isDownloading = true
            const res = await fetch('/download-csv')
            const data = await res.json()
            if (res.ok){
                const taskId = data['task_id']
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`http://127.0.0.1:5000/get-csv/${taskId}`)
                    if (csv_res.ok){
                        this.isDownloading = false
                        clearInterval(intv)
                        window.location.href = `/get-csv/${taskId}`
                    }
                }, 1000)
            }
        },

        // Function to reset the logout timer
        resetLogoutTimer() {
            clearTimeout(this.logoutTimer);
            this.logoutTimer = setTimeout(() => {
                alert("Please log in again because your session has expired due to inactivity.");
                setTimeout(() => {
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('firstLogin');
                    localStorage.removeItem('activeLink');
                    localStorage.removeItem('adminSearchPrevPath');
                    localStorage.removeItem('adminSearchQuery');
                    this.$router.push('/');
                }, 1000);
            }, 600000); 
        },

        handleUserActivity() {
            this.resetLogoutTimer();
        }
    },

    computed: {
        isURL() {
            return this.$route.path === '/adminboard';
        },
        shouldGetData() {
            return this.$route.path.startsWith('/adminboard');
        },
    },

    mounted(){
        if (this.$route.path.startsWith('/adminboard')) {
            this.getData();
        }
        this.resetLogoutTimer();

        document.addEventListener('mousemove', this.handleUserActivity);
        document.addEventListener('keypress', this.handleUserActivity);
    },

    beforeDestroy() {
        document.removeEventListener('mousemove', this.handleUserActivity);
        document.removeEventListener('keypress', this.handleUserActivity);
        clearTimeout(this.logoutTimer);
    },

    watch: {
        shouldGetData(newValue) {
            if (newValue) {
                this.getData();
            }
        },
    },

    components: {
        admin_sidebar,
        adminsearchbox
    }
});

export default adminboard;