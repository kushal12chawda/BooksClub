const sidebar = Vue.component("sidebar", {
    template: `
    <div class="sidebar" style="float: left; width: 265px; height: 100vh; background-color: #523A28; border-radius: 50px 0 0 50px; display: grid; padding-top: 50px; padding-left: 30px; padding-bottom: 200px;">
            <!-- Modal -->
            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 250px">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLongTitle"><strong>Logout</strong></h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="text-align: center;">
                    <h4>Are you sure you want to logout ?</h4>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
                    <button  @click="logout" type="button" class="btn btn-outline-info" >Logout</button>
                </div>
                </div>
            </div>
            </div>

            <div style="color: #E4D4C8; text-align: center; margin-right: 40px;">
                <div style="font-size: 40px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bolder">Book'sClub</div>
                <p style="font-size: 19px; font-family: MS Sans Serif;">Welcome {{active_user.name}}</p>
            </div>
            <router-link to="/adminboard" style="text-decoration: none">
                <div @click="setActiveLink(0)"
                     :style="{ backgroundColor: activeLink === 0 ? '#E4D4C8' : '#523A28', color: activeLink === 0 ? '#3C2113' : '#E4D4C8', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px',}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bx-home bx-flip-horizontal' style=' color:#3C2113; font-size: larger;'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Home 
                </div>
            </router-link>
            <router-link to="/admin_cat" style="text-decoration: none">
                <div @click="setActiveLink(1)"
                     :style="{ backgroundColor: activeLink === 1 ? '#E4D4C8' : '#523A28', color: activeLink === 1 ? '#3C2113' : '#E4D4C8', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px',}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bx-category' style='color: #3C2113; font-size: larger;'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Categories 
                </div>
            </router-link>
            <router-link to="/inbox" style="color: white; text-decoration: none">
                <div @click="setActiveLink(2)"
                     :style="{ backgroundColor: activeLink === 2 ? '#E4D4C8' : '#523A28', color: activeLink === 2 ? '#3C2113' : '#E4D4C8', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px',}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bxs-inbox' style='color: #3C2113; font-size: larger'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Inbox
                </div>
            </router-link>
            <router-link to="/admin_stats" style="color: white; text-decoration: none">
                <div @click="setActiveLink(3)"
                     :style="{ backgroundColor: activeLink === 3 ? '#E4D4C8' : '#523A28', color: activeLink === 3 ? '#3C2113' : '#E4D4C8', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px',}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bx-stats' style='color: #3C2113; font-size: larger'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Statistics
                </div>
            </router-link>
            <a href="#" data-toggle="modal" data-target="#exampleModalCenter" style="color: white; text-decoration: none">
                <div @click="setActiveLink(4)"
                     :style="{ backgroundColor: activeLink === 4 ? '#E4D4C8' : '#523A28', color: activeLink === 4 ? '#3C2113' : '#E4D4C8', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px',}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bx-log-out' style='color: #3C2113; font-size: larger'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Logout
                </div>
            </a>
    </div>
    `,

    data() {
        let isFirstLogin = !localStorage.getItem('firstLogin'); 
        if (isFirstLogin) {
            localStorage.setItem('firstLogin', 'false'); // Set firstLogin to false after the first login
            localStorage.setItem('activeLink', '0'); 
        }
        return {
            current_user: null,
            active_user: [],
            activeLink: parseInt(localStorage.getItem('activeLink')) || 0  
        };
    },

    methods: {
        setActiveLink(index) {
            this.activeLink = index;  
            localStorage.setItem('activeLink', index); 
        },

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
                        localStorage.removeItem('firstLogin');
                        localStorage.removeItem('activeLink');
                        localStorage.removeItem('adminSearchPrevPath');
                        localStorage.removeItem('adminSearchQuery');
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

        logout() {
            // Remove the auth-token from local storage
            localStorage.removeItem('auth-token');
            localStorage.removeItem('firstLogin');
            localStorage.removeItem('activeLink');
            localStorage.removeItem('adminSearchPrevPath');
            localStorage.removeItem('adminSearchQuery');

            this.$router.push('/');
            this.$router.go()
        }
    },

    beforeMount(){
        const token = localStorage.getItem("auth-token");
        fetch(`http://127.0.0.1:5000/get_current_user`, {
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
                    localStorage.removeItem('firstLogin');
                    localStorage.removeItem('activeLink');
                    localStorage.removeItem('adminSearchPrevPath');
                    localStorage.removeItem('adminSearchQuery');
                    this.$router.push('/');
                    this.$router.go()
                }, 1000);
            }
            else{
                throw new Error(`Failed to fetch current user: ${response.status} ${response.statusText}`);
            }
        })
        .then((data) => {
            this.current_user = data.current_user
            this.getUser()
        })
        .catch((error) => {
            console.error('Error fetching current user data:', error.message);
        });
    },
});

export default sidebar;
