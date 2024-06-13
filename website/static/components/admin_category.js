const admin_cat = Vue.component("admin_cat", {
    template: `
    <div>
        <!-- Modal Update Category -->
        <div class="modal fade" v-for="(item) in cat_list" :id="'exampleModalCenter' + item.category_id" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 250px">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle"><strong>Update Category Details</strong></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="box-shadow: none;">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                        <label for="exampleFormControlInput1" style="float: left">Category Name</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Category Name" v-model="selectedCategory.category_name">
                        <p class="error" style="color:red;" id="cat_error">{{ cat_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlInput1" style="float: left">Create Date</label>
                            <input type="date" class="form-control" id="exampleFormControlInput1" placeholder="Enter Date" v-model="formattedDate">
                        </div>
                        <div class="form-group">
                        <label for="exampleFormControlTextarea1" style="float: left">Category Description</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="selectedCategory.category_description"></textarea>
                        <p class="error" style="color:red;" id="new_desc_error">{{ new_desc_error }}</p>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-success" @click="updateCategory(item.category_id)" :disabled="isFormInvalid || cat_error.length > 0 || desc_error.length > 0"  >Save changes</button>
                </div>
                <p v-if="isFormInvalid" style="color: red;">Please fill in all fields.</p>
            </div>
            </div>
        </div>

        <!-- Modal Create New Category -->
        <div class="modal fade" id="exampleModalCenternew" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 250px">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle"><strong>Create New Category</strong></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="box-shadow: none;">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                        <label for="exampleFormControlInput1" style="float: left">Category Name</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Category Name" v-model="newCategory.category_name">
                        <p class="error" style="color:red;" id="new_cat_error">{{ new_cat_error }}</p>
                        </div>
                        <div class="form-group">
                        <label for="exampleFormControlTextarea1" style="float: left">Category Description</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="newCategory.category_description" placeholder="Enter Category Description"></textarea>
                        </div>
                        <p class="error" style="color:red;" id="new_desc_error">{{ new_desc_error }}</p>
                    </form>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-success"  @click="create_cat" :disabled="is_newcategory_Invalid  || new_cat_error.length > 0 || new_desc_error.length > 0 ">Create</button>
                </div>   
                <br>
                <p v-if="is_newcategory_Invalid" style="color: red;">Please fill in all fields.</p>
            </div>
            </div>
        </div>

        <!-- Modal Delete Category-->
        <div class="modal fade" v-for="(item) in cat_list" :id="'exampleModalCenter2' + item.category_id" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="margin-left: 220px">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel" style><strong>Delete Category </h5> &nbsp&nbsp <i class='bx bx-trash' style='font-size: 27px;padding-top:-1px' ></i></strong>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete &nbsp<span style="font-size: 20px"><b>{{item.category_name}}</b></span> category ?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-info" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-danger" @click="deleteCategory(item.category_id)" >Delete</button>
            </div>
            </div>
        </div>
        </div>

        <div style="height: 560px ; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px; overflow: auto; text-decoration: none; padding-left: 20px; scrollbar-width: none;"> 
            <table>
            <tr>
                <td v-for="(item) in cat_list">
                        <div class="book-column" style="padding: 20px; color: #3C2113">
                            <div style="width: 250px; height: 400px; padding: 20px; border-radius: 10px; background-color: #D0B49F; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
                                <router-link :to="/category/+item.category_id" style="text-decoration: none; cursor: pointer; color: #3C2113">
                                    <h4>{{item.category_name}}</h4>
                                    Date: {{item.category_date.slice(0, 17)}}
                                    <hr style="background-color: #3C2113;">
                                    <div style="height: 210px; overflow-y: auto; scrollbar-width: none;">{{item.category_description}}</div>
                                    <br>
                                </router-link>
                                <div>
                                    <button type="button" class="btn" @click="openUpdateModal(item)" style="background-color: #D0B49F; border: 1px solid #3C2113;transition: background-color 0.3s;" 
                                    onmouseover="this.style.backgroundColor='#523A28';this.style.color='white'" 
                                    onmouseout="this.style.backgroundColor='#D0B49F';this.style.color='#3C2113'">
                                        Update
                                    </button>
                                    <button type="button" class="btn" @click="openDeleteModal(item)" style="float: right; background-color: #D0B49F; border: 1px solid #3C2113;transition: background-color 0.3s;"
                                    onmouseover="this.style.backgroundColor='#523A28';this.style.color='white'"
                                    onmouseout="this.style.backgroundColor='#D0B49F';this.style.color='#3C2113'">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                </td>
            </tr>
            </table>
            <br>
            <div class="add_new_cat" style="position: fixed; margin-left: 530px;">
                <button type="button" class="btn" data-toggle="modal" data-target="#exampleModalCenternew" style="background: none; box-shadow: none;"><i class='bx bxs-plus-circle' style="font-size: 80px; color: #A47551; box-shadow: inset 0px 0px 0px 5px #3C2113; border-radius: 50%"></i></button>
            </div>
        </div>
    </div>`,
    data(){
        return{
            cat_list:[],
            selectedCategory: {
                category_name: '',
                category_date: '',
                category_description: ''
            },
            newCategory: {
                category_name: '',
                category_description: ''
            },
            cat_error:'',
            desc_error:'',
            isFirstTime: null, 
            oldValue: '',
            new_cat_error: '',
            new_desc_error: '',
        };
    },
    methods: {
        async getsection() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/api/category`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                });
        
                if (response.status === 200) {
                    const data = await response.json();
                    this.cat_list = data;
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
                    throw new Error(errorData.error);
                }
            } catch (error) {
                alert("Something went Wrong , Please try again ");
                console.error(error);
            }
        },

        async create_cat() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/api/category`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(this.newCategory)
                });
        
                if (response.ok) {
                    const data = await response.json();
                    alert("New Category successfully created");
                    this.$router.go();
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
                    throw new Error("Server error");
                }
            } catch (error) {
                alert("Error creating new category: " + error.message);
                console.error(error);
            }
        },

        openUpdateModal(category) {
            this.isFirstTime = true, 
            this.selectedCategory = {
                category_name: category.category_name,
                category_date: category.category_date,
                category_description: category.category_description
            };
            $('#exampleModalCenter' + category.category_id).modal('show');
        },

        openDeleteModal(category) {
            $('#exampleModalCenter2' + category.category_id).modal('show');
        },

        async updateCategory(id) {
            try {
                const token = localStorage.getItem("auth-token");
                if (!this.isFormInvalid) {
                    const response = await fetch(`http://127.0.0.1:5000/api/category/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + token
                        },
                        body: JSON.stringify(this.selectedCategory)
                    });
        
                    if (response.ok) {
                        const data = await response.json();
                        alert("Update successful!");
                        this.$router.go();
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
                        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
                    }
                }
            } catch (error) {
                alert("Update unsuccessful, please try again: " + error.message);
                console.error(error);
            }
        },
 
        async deleteCategory(id) {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/api/category/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                });
                const data = await response.json();
                if (data.message === "successfully deleted") {
                    this.$router.go();
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
                else if (data.message === "id does not exist.") {
                    this.$router.go();
                    alert("The category either does not exist or has already been deleted.");
                }
            } catch (error) {
                console.error(error);
            }
        },
    },

    mounted(){
        this.getsection();
    },

    computed: {
        formattedDate: {
          get() {
            if (!this.selectedCategory.category_date) return ''; 
            const dateObj = new Date(this.selectedCategory.category_date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          },
          set(value) {
            this.selectedCategory.category_date = value;
          }
        },
        isFormInvalid() {
            return !this.selectedCategory.category_name.trim() || !this.selectedCategory.category_date.trim() || !this.selectedCategory.category_description.trim();
        },
        is_newcategory_Invalid() {
            return !this.newCategory.category_name.trim() || !this.newCategory.category_description.trim();
        },
      }, 

      watch: {
        'selectedCategory.category_name': function(newValue) {
            if (this.isFirstTime) {
                this.oldValue = newValue;
                this.isFirstTime = false;
            }
            const found = this.cat_list.some(item => item.category_name === newValue);
            if (!found || newValue == this.oldValue ) {
                this.cat_error = ""
            }
            else{
                this.cat_error = "The category name already exist"
            }
        },
        'selectedCategory.category_description': function(newValue) {
            if (newValue.length <= 5) {
                this.desc_error = "Category description must be longer than 5 letters.";
            } else {
                this.desc_error = "";
            }
        },
        'newCategory.category_name': function (newValue) {
            if (newValue.length === 0) {
                this.new_cat_error = "";
                return;
            }
            const found = this.cat_list.some(item => item.category_name === newValue);
            if (found) {
                this.new_cat_error = "The category name already exists";
            } else if (newValue.length < 3 || newValue.length > 50) {
                this.new_cat_error = "Category name must be between 3 and 50 characters";
            } else {
                this.new_cat_error = "";
            }
        },
        'newCategory.category_description': function (newValue) {
            if (newValue.length <= 5) {
                this.new_desc_error = "Category description must be longer than 5 letters.";
            } else {
                this.new_desc_error = "";
            }
        },
    },
        

});


export default admin_cat;