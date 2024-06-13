const login = Vue.component("login",{
    template: `
    <div>
    <div style = "margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div class="container" style="background-color: white; border-radius: 10px; padding: 25px; width: 1150px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="content1" style="float: left;">
                <div class="left-image">
                    <img src="https://i.pinimg.com/564x/41/b8/37/41b837f49e639504300957e15347def4.jpg" width="500" height="580" style="border-radius: 10px;">
                </div>
            </div>
            <div class="content2" style="float: left; margin-right: 30px;">
                <div class="right">
                    <form @submit.prevent="login" class="login-form">
                        <div align="center" class="title" style="font-size: larger; margin-bottom: 30px;">
                            <h1>BooksClub</h1>
                        </div>
                        <br>
                        <div class="mt-2">
                            <p style="letter-spacing: 1px; font-size: 20px;">Login into your account</p>
                        </div>
                        <div class="item mt-2">
                            <input type="text" name="username" class="form-control" v-model="username" id="username" placeholder="    Enter Username" required style="border: 2px solid lightgrey; border-radius: 5px; width: 500px; height: 40px; margin-bottom: 10px;">
                            <p class="error" style="color:red;margin-left:15px" id="e1">{{ usernameerror }}</p>
                        </div>
                        <div class="item mt-2">
                            <input type="password" class="form-control" v-model="password" name="password" id="password" placeholder="    Enter Password" required style="border: 2px solid lightgrey; border-radius: 5px; width: 500px; height: 40px; margin-bottom: 10px;">
                            <p class="error" style="color:red;margin-left:15px" id="e2">{{ passworderror }}</p>
                        </div>
                        <div class="item mt-2">
                            <select id="role" name="role" v-model="role" class="form-control" style="border: 2px solid lightgrey; border-radius: 5px; width: 500px; height: 40px; margin-bottom: 10px;">
                                <option disabled selected value="">-- Select Role --</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                            <p class="error" style="color:red;margin-left:15px" id="e3">{{ roleerror }}</p>
                        </div>
                        <div class="mt-3">
                            <div class="button">
                                <button type="submit"  formmethod="" style="border-radius: 5px; font-size: 20px; background-color: #202020; color: aliceblue; font-weight: bold; cursor: pointer; width: 505px; height: 45px;">Login</button>
                            </div>
                        </div>
                    </form>
                    <br>
                    <p class="error" style="color:red;margin-left:35px" id="e5">{{ servererror }}</p>
                </div>
                <div align="center" class="footer" v-if="isloginpage" style="font-weight: lighter;color: #393f81;margin-top: 30px;">
                    <p>Do not have an Account ?<router-link to="/register"> Register Here </router-link></p>
                </div>
            </div>
        </div>
    </div>
    </div> 
        `,
    data(){
        return{
            username: "",
            password: "",
            role: "",
            usernameerror: "",
            passworderror: "",
            roleerror: "",
            servererror: "",
            token: "",
        };
    },
    methods: {
        async login(){
            this.usernameerror=""
            this.passworderror=""
            this.roleerror=""

            // Get current date and format to YYYY-MM-DD
            const currentDate = new Date();
            const dateOnly = currentDate.toISOString().split('T')[0]

            const info = {
                username: this.username,
                password: this.password,
                role: this.role,
                date: dateOnly
            };

            try {
                const response = await fetch("/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(info)
                });
        
                if (!response.ok) {
                    throw new Error("Server error"); 
                }
        
                const data = await response.json();
        
                if (data.msg === "User not found") {
                    this.usernameerror = "Invalid Username";
                } else if (data.msg === "Wrong password") {
                    this.passworderror = "Invalid password";
                } else if (data.msg === "Wrong Role") {
                    this.roleerror = "Access Denied";
                } else if (data.msg === "All done") {
                    this.token = data["auth-token"];
                    localStorage.setItem('auth-token', this.token);
                    if (data.role === 'User') {
                        this.userDashboard();
                    } else {
                        this.adminDashboard();
                    }
                }
            } catch (error) {
                if (error.message === "Server error") {
                    this.servererror = "Server error occurred";
                } else {
                    this.servererror = "Something went wrong. Please try again.";
                }
                console.error(error);
            }
        },
        userDashboard() {
            this.$router.push({ path: '/userdashboard', query: { token: this.token } }); 
        },
        adminDashboard() {
            this.$router.push({ path: '/adminboard', query: { token: this.token } }); 
        },
        
    },

    computed:{
        isloginpage(){
            return this.$route.path ==="/";
        },
    },
    mounted(){
        localStorage.clear();
    },    

});

export default login;