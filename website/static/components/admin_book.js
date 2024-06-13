const admin_book = Vue.component("admin_book", {
    template: `
    <div> 
        <!-- Modal Update Category -->
        <div class="modal fade" v-for="(item) in bookdata" :id="'exampleModalCenter' + item.book_id" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 220px">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle"><strong>Update Book Details</strong></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="box-shadow: none;">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="exampleFormControlInput1" style="float: left">Book Name</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Book Name" v-model="selectedbook.book_name">
                            <br>
                            <p class="error" style="color:red;" id="book_error">{{ book_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlInput1" style="float: left">Author Name</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Author Name" v-model="selectedbook.book_author">
                            <br>
                            <p class="error" style="color:red;" id="auth_error">{{ auth_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlInput1" style="float: left">No. of Copies</label>
                            <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Enter no. of copies"  v-model="selectedbook.book_copies">
                            <br>
                            <p class="error" style="color:red;" id="copies_error">{{ copies_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlInput1" style="float: left">Book Cost</label>
                            <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Enter Cost of book"  v-model="selectedbook.book_cost">
                            <br>
                            <p class="error" style="color:red;" id="cost_error">{{ cost_error }}</p>
                        </div>
                        <div class="form-group">
                        <label for="exampleFormControlTextarea1" style="float: left">Book Description</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" v-model="selectedbook.book_description"  rows="3"></textarea>
                        <br>
                        <p class="error" style="color:red;" id="des_error">{{ des_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlFile1" style="float: left">Book Pdf</label>
                            <br>
                            <br>
                            <div style="float: left">
                                Stored Book Name:- 
                                <a v-if="selectedbook.pdf_name !== 'None'" :href="'/view_pdf/' + item.book_id" style="cursor: pointer; text-decoration: underline;">
                                    {{ selectedbook.pdf_name }}
                                </a>
                                <span v-else>
                                    {{ selectedbook.pdf_name }}
                                </span>
                            </div>
                            <br>
                            <div>
                                <label for="'file_' + item.book_id" style="margin-right: 360px">Update Book :- </label>
                                <input type="file" class="form-control-file" :id="'file_' + item.book_id" :name="'file_' + item.book_id"  @change="handleFileInputChange">
                                <br>
                                <p class="error" style="color:red;" id="pdf_error">{{ pdf_error }}</p>
                            </div>
                        </div>     
                    </form>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-success" @click="updatebook(item.book_id); uploadBookPDF(item.book_id)" :disabled="isForm1Invalid || book_error.length > 0 || auth_error.length > 0  || copies_error.length > 0  || cost_error.length > 0  || des_error.length > 0 || pdf_error.length > 0">Save changes</button>
                </div>
                <br>
                <p v-if="isForm1Invalid" style="color: red;">Please fill in all fields.</p>
            </div>
            </div>
        </div>

        <!-- Modal Create New Category -->
        <div class="modal fade" id="exampleModalCenterCreate" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="margin-left: 220px">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle"><strong>Create New Book</strong></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="box-shadow: none;">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="exampleFormControlInput2" style="float: left">Book Name</label>
                            <input type="text" class="form-control" id="exampleFormControlInput2" placeholder="Enter Book Name" v-model="newbook.book_name">
                            <br>
                            <p class="error" style="color:red;" id="new_book_error">{{ new_book_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlInput2" style="float: left">Author Name</label>
                            <input type="text" class="form-control" id="exampleFormControlInput2" placeholder="Enter Author Name" v-model="newbook.book_author">
                            <br>
                            <p class="error" style="color:red;" id="new_auth_error">{{ new_auth_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlInput2" style="float: left">No. of Copies</label>
                            <input type="number" class="form-control" id="exampleFormControlInput2" placeholder="Enter no. of copies"  v-model="newbook.book_copies">
                            <br>
                            <p class="error" style="color:red;" id="new_copies_error">{{ new_copies_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlInput2" style="float: left">Book Cost</label>
                            <input type="number" class="form-control" id="exampleFormControlInput2" placeholder="Enter Cost of book"  v-model="newbook.book_cost">
                            <br>
                            <p class="error" style="color:red;" id="new_cost_error">{{ new_cost_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea2" style="float: left">Book Description</label>
                            <textarea class="form-control" id="exampleFormControlTextarea2" v-model="newbook.book_description"  rows="3"></textarea>
                            <br>
                            <p class="error" style="color:red;" id="new_des_error">{{ new_des_error }}</p>
                        </div>
                        <div class="form-group">
                            <label for="'filee'" style="float: left">Book Pdf&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</label>
                            <div style="display: flex;margin-right: 150px;">
                            <input type="file" class="form-control-file" :id="'filee'" :name="'filee'"  @change="handleInputChange" ref="fileInput">
                                <button v-if="crossFile" @click="clearFileInput" class="clear-button" style="background: none;border: none;font-size: 16px;color: red;cursor: pointer;">
                                    &#x2715; <!-- Unicode symbol for cross icon -->
                                </button>
                            </div>
                            <br>
                            <p class="error" style="color:red;" id="new_pdf_error">{{ new_pdf_error }}</p>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-dark" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" @click="create_book"  :disabled="isForm2Invalid || new_book_error.length > 0 || new_auth_error.length > 0  || new_copies_error.length > 0  || new_cost_error.length > 0  || new_des_error.length > 0 || new_pdf_error.length > 0">Create</button>
                </div>   
                <br>
                <p v-if="isForm2Invalid" style="color: red;">Please fill in all fields.</p>
            </div>
            </div>
        </div>


        
        <!-- Modal Delete Category-->
        <div class="modal fade" v-for="(item) in bookdata" :id="'exampleModalCenter2' + item.book_id" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="margin-left: 220px">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel" style><strong>Delete Book </h5> &nbsp&nbsp <i class='bx bx-trash' style='font-size: 27px;padding-top:-1px' ></i></strong>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete &nbsp<span style="font-size: 20px"><b>{{item.book_name}}</b></span> Book ?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-info" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-danger" @click="deletebook(item.book_id)" >Delete</button>
            </div>
            </div>
        </div>
        </div>

        <div v-if="bookdata.length > 0" style="height: 560px ; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px; overflow: auto; text-decoration: none; padding-left: 20px; scrollbar-width: none; color: #3C2113">
        <h3 align="left" style="position: fixed; margin-left: 30px">{{bookdata[0].cat_name}}</h3>
        <table style="margin-top: 40px">
            <tr>
                <td v-for="(item) in bookdata" style>
                    <div class="book-column" style="padding: 20px; color: #3C2113">
                        <div style="width: 300px; height: 390px; padding: 20px; border-radius: 10px; background-color: #D0B49F; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;">
                            <h4><strong>{{item.book_name}}</strong></h4>
                            <br>
                            <div style="display: flex;">
                                <div style="flex: 1;">Author: {{item.book_author}}</div>
                                <div style="flex: 1; text-align: right;">Cost: Rs {{item.book_cost}}</div>
                            </div>
                            <div style="display: flex;">
                                <div style="flex: 1;">No.of Copies: {{item.book_copies}}</div>
                                <div style="flex: 1; text-align: right;"><a :href="'/view_pdf/' + item.book_id " style="color: #3C2113"><u>View PDF</u></a></div>
                            </div>
                            <hr style="background-color: #523A28">
                            <div style="height: 150px; overflow-y: auto; scrollbar-width: none;">
                                {{item.book_description}}
                            </div>
                            <br>
                            <div>
                                <button type="button" class="btn"  @click="openUpdateModal(item)" style="background-color: #D0B49F; border: 1px solid #3C2113;transition: background-color 0.3s;"
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
        <div style="position: fixed; margin-left: 530px;">
            <button type="button" class="btn" data-toggle="modal" data-target="#exampleModalCenterCreate" style="background: none; box-shadow: none;"><i class='bx bxs-plus-circle' style="font-size: 70px; color: #A47551; box-shadow: inset 0px 0px 0px 4px #3C2113; border-radius: 50%"></i></button>
        </div>
        </div>

        <div v-if="bookdata.length === 0">
            <div align="left" style="height: 480px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none;">
                <h3 align="center" style="margin-top: 200px; color: #757575;"> No books present</h3>
                
            </div>
            <div style="position: fixed; margin-left: 530px;">
                <button type="button" class="btn" data-toggle="modal" data-target="#exampleModalCenterCreate" style="background: none; box-shadow: none;"><i class='bx bxs-plus-circle' style="font-size: 70px; color: #A47551; box-shadow: inset 0px 0px 0px 4px #3C2113; border-radius: 50%"></i></button>
            </div>
        </div>

    </div>`,

    data(){
        return{
            bookdata: [],
            selectedbook: {
                book_name: '',
                book_author: '',
                book_description: '',
                book_copies: '',
                book_cost:'',
                book_text:'',
            }, 
            newbook:{
                book_name: '',
                book_author: '',
                book_description: '',
                book_copies: '',
                book_cost:'',
                category_fk: this.$route.params.id,
            },
            isFirstTime: null, 
            oldValue: '',
            book_error:'',
            new_book_error:'',
            auth_error:'',
            new_auth_error:'',
            copies_error:'',
            new_copies_error:'',
            cost_error:'',
            new_cost_error:'',
            des_error:'',
            new_des_error:'',
            pdf_error:'',
            new_pdf_error:'Choose a PDF file for the Book',
            isFileChosen: false,
            isFile1Chosen: false,
            crossFile: null,
            harbook: []
        }
    },

    methods : {
        async getbook() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/category/${this.$route.params.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    this.bookdata = data;
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
                    throw new Error('Failed to fetch book data');
                }
            } catch (error) {
                console.error('Error fetching book data:', error);
                alert("Something Went Wrong , Please Try Again")
            }
        },

        async deletebook(id) {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/api/book/${id}`, {
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
                else if (data.message === "Book does not exist.") {
                    this.$router.go();
                    alert("The Book either does not exist or has already been deleted.");
                }
            } catch (error) {
                console.error(error);
            }
        },

        async create_book() {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await fetch(`http://127.0.0.1:5000/api/book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(this.newbook)
                });
        
                if (response.ok) {
                    const data = await response.json();
                    this.new_uploadBookPDF(data.book_id)
                    alert("New Book successfully created");
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
                alert("Error creating new Book: " + error.message);
                console.error(error);
            }
        },

        updatebook(id){
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/api/book/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    "Authorization": "Bearer " + token
                },
                body:JSON.stringify(this.selectedbook)
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
        },

        uploadBookPDF(bookId) {
            const fileInput = document.getElementById("file_" + bookId);
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            fetch(`/upload/${bookId}`, {
              method: 'POST',
              body: formData,
            })
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                console.log(error)
            });
        },

        new_uploadBookPDF(bookId) {
            const fileInput = document.getElementById("filee"); 
        
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                console.error("No file selected");
                return;
            }
        
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
        
            fetch(`/upload/${bookId}`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(result => {
                console.log("Upload successful:", result);
            })
            .catch(error => {
                console.error("Error uploading PDF:", error);
            });
        },
        openUpdateModal(book) {
            this.isFirstTime = true,
            this.crossFile = null,
            this.selectedbook = {
                book_name: book.book_name,
                book_author: book.book_author,
                book_description: book.book_description,
                book_copies: book.book_copies,
                book_cost: book.book_cost,
                pdf_name: book.pdf_name // Store the PDF file name
                  
            };            
            $('#exampleModalCenter' + book.book_id).modal('show');
        },

        openDeleteModal(book) {
            $('#exampleModalCenter2' + book.book_id).modal('show');
        },

        handleFileInputChange(event) {
            const files = event.target.files;
            if (files.length > 0) {
                this.isFileChosen = true;
            } else {
                this.isFileChosen = false;
            }
        },
        handleInputChange(event) {
            const files1 = event.target.files;
            if (files1.length > 0) {
                this.new_pdf_error="";
                this.isFile1Chosen = true;
                this.crossFile = files1;
            } else {
                this.new_pdf_error="Choose a PDF file for the Book";
                this.isFile1Chosen = false;
                this.crossFile = null;
            }
        },
        clearFileInput() {
            const fileInput = this.$refs.fileInput;
            if (fileInput) {
                fileInput.value = ''; 
                this.crossFile = null; 
            }
        },
        bookscha(){
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/api/book`,{
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
            .then(data=>{
                this.harbook = data
            })
        },
      
    },
    mounted(){
        this.getbook();
        this.bookscha()
    },
    computed:{
        isForm1Invalid() {
            return !this.selectedbook.book_name.trim() || !this.selectedbook.book_author.trim() || !this.selectedbook.book_description.trim() || !this.selectedbook.book_copies || !this.selectedbook.book_cost
        },

        isForm2Invalid() {
            return !this.newbook.book_name.trim() || !this.newbook.book_author.trim() || !this.newbook.book_description.trim() || !this.newbook.book_copies || !this.newbook.book_cost
        },

        pdfErrorMessage() {
            if (this.selectedbook.pdf_name === 'None' && !this.isFileChosen) {
                return "Choose a PDF file for the Book"; 
            } else {
                return "";
            }
        },
        nextBookId() {
            if (this.bookdata && this.bookdata.length > 0) {
              const lastItem = this.bookdata[this.bookdata.length - 1];
              const nextBookId = lastItem.book_id + 1;
              return nextBookId;
            }
          },
    },
    watch: {
        'selectedbook.book_name': function(newValue) {
            if (this.isFirstTime) {
                this.oldValue = newValue;
                this.isFirstTime = false;
            }
            const found = this.harbook.some(item => item.name === newValue);
            if (!found || newValue == this.oldValue ) {
                this.book_error = ""
            }
            else{
                this.book_error = "The Book name already exist , Give Unique Name"
            }
        },
        'selectedbook.book_author': function(newValue) {
            if (newValue.length === 0) {
                this.auth_error = "";
                return;
            }
            if (newValue.length < 4) {
                this.auth_error = "Author Name must be longer than 3 letters.";
            } else {
                this.auth_error = "";
            }
        },
        'selectedbook.book_copies': function(newValue) {
            if (newValue > 100) {
                this.copies_error = "Book copies are restricted to 100 copies !!!";
            } else {
                this.copies_error = "";
            }
        },
        'selectedbook.book_cost': function(newValue) {
            if (newValue > 10001) {
                this.cost_error = "Book cost are restricted to 10000 Rs !!!";
            } else {
                this.cost_error = "";
            }
        },
        'selectedbook.book_description': function(newValue) {
            if (newValue.length <= 5) {
                this.des_error = "Book description must be longer than 5 letters.";
            } else {
                this.des_error = "";
            }
        },
        pdfErrorMessage(newValue) {
            this.pdf_error = newValue;
        },
        'newbook.book_name': function(newValue) {
            const found1 = this.bookdata.some(item => item.book_name === newValue);
            if (found1) {
                this.new_book_error = "The Book name already exist , Give Unique Name"
            }
            else{
                this.new_book_error = ""
            }
        },
        'newbook.book_author': function(newValue) {
            if (newValue.length === 0) {
                this.new_auth_error = "";
                return;
            }
            if (newValue.length < 4) {
                this.new_auth_error = "Author Name must be longer than 3 letters.";
            } else {
                this.new_auth_error = "";
            }
        },
        'newbook.book_copies': function(newValue) {
            if (newValue > 100) {
                this.new_copies_error = "Book copies are restricted to 100 copies !!!";
            } else {
                this.new_copies_error = "";
            }
        },
        'newbook.book_cost': function(newValue) {
            if (newValue > 10001) {
                this.new_cost_error = "Book cost are restricted to 10000 Rs !!!";
            } else {
                this.new_cost_error = "";
            }
        },
        'newbook.book_description': function(newValue) {
            if (newValue.length <= 5) {
                this.new_des_error = "Book description must be longer than 5 letters.";
            } else {
                this.new_des_error = "";
            }
        },
    }    
});

export default admin_book;