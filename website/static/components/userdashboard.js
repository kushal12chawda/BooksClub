import sidebar from "./sidebar.js";
import searchbox from "./searchbox.js";

const userdashboard = Vue.component("userdashboard", {
    template: `
    <div>
    <div style="display: flex; height: 100vh; background: linear-gradient(to top, #44a08d, #093637); border-radius: 50px; font-family: MS Sans Serif">
        <sidebar></sidebar>
        <div class= "main-box" style="float: right; height: 92vh; background-color: #F9F1F0; width: 1230px; margin-top: 30px; border-radius: 50px; box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;">
            <searchbox></searchbox>
            <div align="center" class="content-box">
                <router-view></router-view>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; margin: 0;">
                <div v-if="isURL" style="text-align: center;margin-top:120px;color: grey;">
                    <i class='bx bx-gift' style="font-size: 80px; margin-bottom: 25px;color:#2c3e50"></i> <!-- Icon with increased font size and margin -->
                    <p style="font-size: 20px; font-style: italic; line-height: 1.5;">
                        &#x275B Books are a uniquely portable magic, a gift that can be opened again and again. &#x275C &nbsp -  <strong><span style="color:grey;">Garrison Keillor</span></strong>
                        <br>
                        <br>
                        <br>
                        Open the book of possibilities with our &nbsp<strong><span style="color:grey;">Book'sClub</span></strong>. Explore, discover, and organize your knowledge journey seamlessly !!
                    </p>
                </div>
            </div>
        </div>
    </div>
    </div>
        `,

    data(){
        return{
            search_item: "",
            logoutTimer: null
        }
    },

    methods: {
      
        resetLogoutTimer() {
            
            clearTimeout(this.logoutTimer);
            
            this.logoutTimer = setTimeout(() => {
                
                alert("Please log in again because your session has expired due to inactivity.");
                
                setTimeout(() => {
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('firstLogin1');
                    localStorage.removeItem('activeLink1');
                    localStorage.removeItem('userSearchPrevPath');
                    localStorage.removeItem('userSearchQuery');
                    this.$router.push('/');
                    this.$router.go()
                }, 1000);
            }, 600000); 
        },

        
        handleUserActivity() {
            this.resetLogoutTimer();
        }
    },

    computed: {
        isURL() {
            return this.$route.path === '/userdashboard';
        },
    },

    mounted() {
        // Initial setup: Set the logout timer when the component mounts
        this.resetLogoutTimer();

        // Add event listeners for mouse movement and keypress
        document.addEventListener('mousemove', this.handleUserActivity);
        document.addEventListener('keypress', this.handleUserActivity);
    },

    beforeDestroy() {
        document.removeEventListener('mousemove', this.handleUserActivity);
        document.removeEventListener('keypress', this.handleUserActivity);
        clearTimeout(this.logoutTimer);
    },

    components: {
        sidebar,
        searchbox
    }
});

export default userdashboard;