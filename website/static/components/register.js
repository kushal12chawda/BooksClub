const register = Vue.component("register",{
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
                    <form @submit.prevent="createUser" class="login-form">
                        <div align="center" class="title" style="font-size: larger; margin-bottom: 30px;">
                            <h1>BooksClub</h1>
                        </div>
                        <div class="mt-2">
                            <p style="letter-spacing: 1px; font-size: 20px;">Create your account</p>
                        </div>
                        <div class="item mt-2">
                            <input v-model="formData.username" type="text" name="username" id="username" class="form-control" placeholder="    Enter Username" required style="border: 2px solid lightgrey; border-radius: 5px; width: 500px; height: 40px; margin-bottom: 10px;">
                            <p class="error" style="color:red;" id="username1Error">{{ usernameError }}</p>   
                        </div>
                        <div class="item mt-2">
                            <input v-model="formData.email" type="email" class="form-control" name="email" id="email" placeholder="    Enter Email" required style="border: 2px solid lightgrey; border-radius: 5px; width: 500px; height: 40px; margin-bottom: 10px;">
                            <p class="error" style="color:red;" id="emailError">{{ emailError }}</p>
                        </div>
                        <div class="item mt-2">
                            <input v-model="formData.password" class="form-control" type="password" name="password" id="password" placeholder="    Enter Password" required style="border: 2px solid lightgrey; border-radius: 5px; width: 500px; height: 40px; margin-bottom: 10px;">
                            <p class="error" style="color:red;" id="passwordError">{{ passwordError }}</p>
                        </div>
                        <div class="item mt-2">
                            <input v-model="formData.password2" class="form-control" type="password" name="password2" id="password2" placeholder="    Re-Enter Password" required style="border: 2px solid lightgrey; border-radius: 5px; width: 500px; height: 40px; margin-bottom: 10px;">
                            <p class="error" style="color:red;" id="password2Error">{{ password2Error }}</p>
                        </div>
                        <div class="mt-2">
                            <select id="role" name="role" v-model="formData.role" class="form-control" style="border: 2px solid lightgrey; border-radius: 5px; width: 500px; height: 40px; margin-bottom: 10px;">
                                <option disabled selected value="">-- Select Role --</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                        </div>
                        <div class="mt-3">
                            <div class="button">
                                <button
                                    type="submit"
                                    :disabled="usernameError.length > 0 || passwordError.length > 0 || password2Error.length > 0 || emailError.length > 0"
                                    :style="{ color: isDisabled ? 'red' : 'white' , backgroundColor: 'black' ,  cursor: isDisabled ? 'not-allowed' : 'pointer', borderRadius: '5px', fontSize: '20px', width: '505px', height: '45px' }">
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div align="center" class="footer" v-if="isregisterpage" style="font-weight: lighter;color: #393f81;margin-top: 30px;">
                    <p>Back to <router-link v-if="isregisterpage" to="/"> Login </router-link></p>
                </div>
            </div>
        </div>
    </div>
    </div>
        `,
    data(){
        return{
            userdata: [],
            formData:{
                username:"",
                email:"",
                password:"",
                password2:"",
                role:"",
            },
            emailError: "",
            usernameError: "",
            passwordError: "",
            password2Error: "",
        };
    },
    methods: {
        async createUser() {
          const data = {
              username: this.formData.username,
              email: this.formData.email,
              password: this.formData.password,
              password2: this.formData.password2,
              role: this.formData.role 
            }
            try {
                const response = await fetch("http://127.0.0.1:5000/signup", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
        
                if (response.status === 200) {
                    const responseData = await response.json();
                    if(responseData.message === "Role already taken"){
                        alert("An admin account already exists. You cannot become a second admin as only one admin account is allowed.")
                        this.$router.go();
                    }
                    else if (responseData.message === "Successfully registered!!") {
                        alert("Successfully registered!!");
                        // Reload the current route or page
                        this.$router.go();
                    } else {
                        alert("Registration unsuccessful.");
                        // Reload the current route or page
                        this.$router.go();
                    }
                } else {
                    throw new Error("Registration failed with status: " + response.status);
                }
            } catch (error) {
                console.error("An error occurred during registration:", error.message);
                alert("Registration failed. Please try again later.");
            }   
        },   
        async fetchData() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    this.userdata = data;
                } else {
                    throw new Error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    }, 
    watch: {
        'formData.username': function(newVal) {
            if (!newVal) {
                this.usernameError = "";
                return;
            }
            if (this.userdata.length > 0) { 
                let userExists = false;
                for (let i = 0; i < this.userdata.length; i++) {
                    if (this.userdata[i].name === newVal) {
                        userExists = true;
                        break; // Exit loop early if a matching user is found
                    }
                }
                this.usernameError = userExists ? "Username already exists" : "";
        
                if (newVal.length < 5) {
                    this.usernameError = "Username must be 5 characters or more";
                }
            }
        },
        'formData.email' : function (newVal) {
            if (this.userdata.length > 0) { 
                let emailExists = this.userdata.some((user) => user.email === newVal);
                this.emailError = emailExists ? "Email already exists" : "";
            }
        },
        'formData.password2' : function (newVal) {
            if (!newVal) {
                this.password2Error = ""; 
                return;
            }
            if(this.formData.password == newVal){
                this.password2Error = "";
            }
            else if(this.formData.password.length == 0 && newVal.length>0){
                this.password2Error = "Enter Password First";
            }
            else{
                this.password2Error = "Password you enter do not match";
            }
        },
        'formData.password': function(newVal) {
            if (!newVal) {
                this.passwordError = ""; 
                return;
            }
            const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*'];
          
            this.passwordError = specialCharacters.some(char => newVal.includes(char))
                ? "" // Password includes at least one special character
                : "Password must include a special character";
        
            if (newVal.length < 5) {
                this.passwordError = "Password must be 5 characters or more";
            }
        },
    },  
    mounted(){
        this.fetchData();
    }, 
    computed:{
        isregisterpage(){
            return this.$route.path ==="/register";
        },

        isDisabled() {
            return (
              this.usernameError.length > 0 ||
              this.passwordError.length > 0 ||
              this.password2Error.length > 0 ||
              this.emailError.length > 0
            );
        },
    },
});

export default register;