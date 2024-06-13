const sidebar = Vue.component("sidebar", {
    template: `
    <div class="sidebar" style="float: left; width: 265px; height: 100vh; border-radius: 50px 0 0 50px; display: grid; padding-top: 50px; padding-left: 30px; padding-bottom: 150px;">
            <!-- Modal -->
            <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 250px">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLongTitle"><strong>Logout</strong></h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="text-align: center;">
                    <h4><strong>Thank You for using Book'sClub !!</strong></h4>
                    <form style="margin-top: 25px">
                        <div class="form-group">
                        <label for="exampleFormControlTextarea1" style="float: left">Please share your feedback.</label>
                        <textarea v-model="new_feedback.user_feedback" class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Feedback"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
                    <button  @click="logout" type="button" class="btn" style="background-color: #391306; color: white">Logout</button>
                </div>
                </div>
            </div>
            </div>

            <div style="color: white; text-align: center; margin-right: 40px;">
                <div style="font-size: 40px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bolder; color: #F9F1F0">Book'sClub</div>
                <p style="font-size: 19px; font-family: MS Sans Serif; color: #F9F1F0">Welcome {{active_user.name}}</p>
            </div>
            <router-link to="/userdashboard" style="text-decoration: none">
                <div @click="setActiveLink(0)"
                     :style="{ backgroundColor: activeLink1 === 0 ? '#F9F1F0' : '#093637', color: activeLink1 === 0 ? 'black' : 'white', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px', width: '235px' ,}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bx-home bx-flip-horizontal' style='color: black; font-size: larger;'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Home 
                </div>
            </router-link>
            <router-link to="/cat" style="color: white; text-decoration: none">
                <div @click="setActiveLink(1)"
                     :style="{ backgroundColor: activeLink1 === 1 ? '#F9F1F0' : '#093637', color: activeLink1 === 1 ? 'black' : 'white', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px', width: '235px' ,}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bx-category' style='color: black; font-size: larger;'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Categories
                </div>
            </router-link>
            <router-link to="/my_acc" style="color: white; text-decoration: none">
                <div @click="setActiveLink(2)"
                     :style="{ backgroundColor: activeLink1 === 2 ? '#F9F1F0' : '#093637', color: activeLink1 === 2 ? 'black' : 'white', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px', width: '235px' ,}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bxs-user-account' style='color: black; font-size: larger'></i>&nbsp&nbsp&nbsp&nbsp&nbsp My Account 
                </div>
            </router-link>
            <router-link to="/stats" style="color: white; text-decoration: none">
                <div @click="setActiveLink(3)"
                     :style="{ backgroundColor: activeLink1 === 3 ? '#F9F1F0' : '#093637', color: activeLink1 === 3 ? 'black' : 'white', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px', width: '235px' ,}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bx-stats' style='color: black; font-size: larger'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Statistics
                </div>
            </router-link>
            <a href="#" data-toggle="modal" data-target="#logoutModal" style="color: white; text-decoration: none">
                <div @click="setActiveLink(4)"
                     :style="{ backgroundColor: activeLink1 === 4 ? '#F9F1F0' : '#093637', color: activeLink1 === 4 ? 'black' : 'white', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', fontSize: '19px', textAlign: 'left', height: '55px', padding: '15px', width: '235px' ,}"
                     class="sidebar-item">
                     &nbsp&nbsp<i class='bx bx-log-out' style='color: black; font-size: larger'></i>&nbsp&nbsp&nbsp&nbsp&nbsp Logout
                </div>
            </a>
    </div>
    `,

    data() {
        let isFirstLogin1 = !localStorage.getItem('firstLogin1'); 
        if (isFirstLogin1) {
            localStorage.setItem('firstLogin1', 'false'); 
            localStorage.setItem('activeLink1', '0'); 
        }
        return {
            active_user: [],
            current_user: null,
            new_feedback: {
                    user_feedback: ""
                },
            activeLink1: parseInt(localStorage.getItem('activeLink1')) || 0  
            
        };
    },

    methods: {
        setActiveLink(index) {
            this.activeLink1 = index;  
            localStorage.setItem('activeLink1', index); 
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

        logout() {
            // Remove the auth-token from local storage
            this.feedback()
            localStorage.removeItem('auth-token');
            localStorage.removeItem('firstLogin1');
            localStorage.removeItem('activeLink1');
            localStorage.removeItem('userSearchPrevPath');
            localStorage.removeItem('userSearchQuery');

            this.$router.push('/');
            this.$router.go()
        },

        feedback() {
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/feedback`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(this.new_feedback),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();

                }
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    // Redirect to login page after 1 seconds
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin1');
                        localStorage.removeItem('activeLink1');
                        localStorage.removeItem('userSearchPrevPath');
                        localStorage.removeItem('userSearchQuery');
                        this.$router.push('/');
                    }, 1000);
                }
                else{
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error saving feedback:', error);
            });
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
                    localStorage.removeItem('firstLogin1');
                    localStorage.removeItem('activeLink1');
                    localStorage.removeItem('userSearchPrevPath');
                    localStorage.removeItem('userSearchQuery');
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
        })
    },
});

export default sidebar;
